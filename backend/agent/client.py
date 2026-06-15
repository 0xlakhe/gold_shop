import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.getenv("ANTHROPIC_AUTH_KEY"),
    base_url=os.getenv("ANTHROPIC_BASE_URL", "https://api.anthropic.com"),
)
