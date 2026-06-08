import Anthropic from "@anthropic-ai/sdk";
import {
  CONDITION_PROMPTS,
  GENERAL_PROMPT,
} from "@/content/system-prompts";
import { toPlainText } from "@/lib/plain-text";
import { TRANSITION_TRIGGER_T } from "@/lib/study-config";
import type { ChatMessage, Condition } from "./types";

const DEFAULT_MODEL = "claude-sonnet-4-20250514";

function getModel(): string {
  return process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;
}

type ChatOptions = {
  condition: Condition;
  turnCount: number;
};

export function buildSystemPrompt({ condition, turnCount }: ChatOptions): string {
  let system = GENERAL_PROMPT;

  if (turnCount >= TRANSITION_TRIGGER_T) {
    system += `\n\n${CONDITION_PROMPTS[condition] ?? CONDITION_PROMPTS.A}`;
  }

  return system;
}

export async function getAiResponse(
  messages: ChatMessage[],
  options: ChatOptions
): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const system = buildSystemPrompt(options);

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
