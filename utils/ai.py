import os

import anthropic

from content.system_prompts import CONDITIONS

DEFAULT_MODEL = "claude-sonnet-4-20250514"

REFUSAL_NOTE = (
    "\n\n[SYSTEM NOTE: The user has now sent their 3rd message. "
    "You MUST deliver the boundary message now as instructed.]"
)


def get_ai_response(
    messages: list,
    condition: str,
    scenario_type: str,
    turn_count: int,
) -> str:
    client = anthropic.Anthropic()
    system = CONDITIONS[condition]
    if turn_count == 3:
        system += REFUSAL_NOTE
    api_messages = [
        {"role": m["role"], "content": m["content"]}
        for m in messages
        if m.get("content")
    ]
    response = client.messages.create(
        model=os.environ.get("ANTHROPIC_MODEL", DEFAULT_MODEL),
        max_tokens=1000,
        system=system,
        messages=api_messages,
    )
    parts = []
    for block in response.content:
        if hasattr(block, "text"):
            parts.append(block.text)
    return "\n".join(parts).strip()
