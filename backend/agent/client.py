import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.getenv("ANTHROPIC_AUTH_KEY"),
    base_url="https://api.xiaomimimo.com/anthropic",
)
