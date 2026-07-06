import type {
  ChatMessage,
  Condition,
  ScenarioType,
  Stage,
} from "@/lib/types";

export type SessionRestorePayload = {
  participantId: string;
  stage: Stage;
  scenarioIndex: number;
  scenarioOrder: ScenarioType[];
  experiencedScenarioIndex: number;
  assignedCondition: Condition | null;
  messages: ChatMessage[];
  turnCount: number;
  chatStartedAtMs: number | null;
  consentAgreed: boolean;
  screening: Record<string, string> | null;
};
