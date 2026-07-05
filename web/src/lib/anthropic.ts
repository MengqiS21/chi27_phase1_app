import Anthropic from "@anthropic-ai/sdk";
import {
  CONDITION_INSTRUCTION_OVERRIDE,
  CONDITION_PROMPTS,
  GENERAL_PROMPT_GROUP_2,
  getTransitionPhasePrompt,
} from "@/content/system-prompts";
import { toPlainText } from "@/lib/plain-text";
import { TRANSITION_TRIGGER_T, maxUserTurns } from "@/lib/study-config";
import type { ChatMessage, Condition } from "./types";

const DEFAULT_MODEL = "claude-sonnet-4-6";

function getModel(): string {
  return process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;
}

type ChatOptions = {
  condition: Condition;
  turnCount: number;
};

export function buildSystemPrompt({ condition, turnCount }: ChatOptions): string {
  const system = GENERAL_PROMPT_GROUP_2;

  if (turnCount >= TRANSITION_TRIGGER_T) {
    const totalTransitionTurns =
      maxUserTurns() - TRANSITION_TRIGGER_T + 1;
    const transitionTurn = turnCount - TRANSITION_TRIGGER_T + 1;
    const phasePrompt = getTransitionPhasePrompt(
      condition,
      transitionTurn,
      totalTransitionTurns
    );

    let conditionBlock = CONDITION_INSTRUCTION_OVERRIDE;
    conditionBlock += `\n\n${CONDITION_PROMPTS[condition] ?? CONDITION_PROMPTS.A}`;
    if (phasePrompt) {
      conditionBlock += `\n\n${phasePrompt}`;
    }

    return system + `\n\n${conditionBlock}`;
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
