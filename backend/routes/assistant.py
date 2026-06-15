from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
from agent.client import client
from agent.tools import tools
from models.models import User
from agent.executor import execute_tool

assistant_router = APIRouter(prefix="/assistant")


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
        print("this is request")
        print(req)
        print("")
        messages = list(req.history)
        messages.append({"role": "user", "content": req.message})

        response = client.messages.create(
            model="mimo-v2.5-pro",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=messages,
            tools=tools,
        )
        print("this is response")
        print(response)
        print("")
        while response.stop_reason == "tool_use":
            print("this is message")
            print(messages)
            print("")
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
            print("this is block")
            print(content_blocks)
            print("")
            response = client.messages.create(
                model="mimo-v2.5-pro",
                max_tokens=1024,
                system=SYSTEM_PROMPT,
                messages=messages,
                tools=tools,
            )
        print("this is response")
        print(response)
        print("")
        text = next((b.text for b in response.content if b.type == "text"), "")
        print("this is text")
        print(text)
        return ChatResponse(response=text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
