import logging
import os
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
from agent.client import client
from agent.tools import tools
from models.models import User
from agent.executor import execute_tool

logger = logging.getLogger(__name__)

assistant_router = APIRouter(prefix="/assistant")

MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-20250514")


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


class ChatResponse(BaseModel):
    response: str


SYSTEM_PROMPT = (
    "You are a helpful assistant for a gold and silver jewelry shop in Nepal. "
    "You help the shop owner manage their inventory, track prices, and analyze profits. "
    "Prices are in NPR (Nepali Rupees) and weights are in tola. "
    "When the owner asks you to do something, use the available tools to do it. "
    "Always confirm what action you took after using a tool. "
    "Be concise and friendly."
)


@assistant_router.post("/chat", response_model=ChatResponse)
def chat(
    req: ChatRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        messages = list(req.history)
        messages.append({"role": "user", "content": req.message})

        response = client.messages.create(
            model=MODEL,
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=messages,
            tools=tools,
        )

        while response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})
            content_blocks = []

            for block in response.content:
                if block.type == "tool_use":
                    result = execute_tool(block.name, block.input, db, user.id)
                    content_blocks.append(
                        {
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result,
                        }
                    )

            messages.append({"role": "user", "content": content_blocks})
            response = client.messages.create(
                model=MODEL,
                max_tokens=1024,
                system=SYSTEM_PROMPT,
                messages=messages,
                tools=tools,
            )

        text = next((b.text for b in response.content if b.type == "text"), "")
        return ChatResponse(response=text)

    except Exception as e:
        logger.exception("Assistant chat error")
        raise HTTPException(status_code=500, detail="Something went wrong. Please try again.")
