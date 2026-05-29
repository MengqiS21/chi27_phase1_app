import Anthropic from "@anthropic-ai/sdk";
import { CONDITIONS, REFUSAL_NOTE } from "@/content/system-prompts";
import { toPlainText } from "@/lib/plain-text";
import type { ChatMessage } from "./types";

const DEFAULT_MODEL = "claude-sonnet-4-20250514";

function getModel(): string {
  return process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;
}

export async function getAiResponse(
  messages: ChatMessage[],
  condition: string,
  turnCount: number
): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  let system = CONDITIONS[condition] ?? CONDITIONS.A;
  if (turnCount === 3) {
    system += REFUSAL_NOTE;
  }

  const response = await client.messages.create({
    model: getModel(),
    max_tokens: 1000,
    system,
    messages: messages
      .filter((m) => m.content?.trim())
      .map((m) => ({ role: m.role, content: m.content })),
  });

  const parts: string[] = [];
  for (const block of response.content) {
    if (block.type === "text") {
      parts.push(block.text);
    }
  }
  return toPlainText(parts.join("\n"));
}
