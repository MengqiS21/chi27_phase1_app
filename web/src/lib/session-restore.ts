import type { SessionRestorePayload } from "@/lib/session-restore-types";
import { getSupabase } from "@/lib/supabase";
import type { ChatMessage, Condition, ScenarioType, Stage } from "@/lib/types";

export type { SessionRestorePayload };

type StoredConversationMessage = {
  role: "user" | "assistant";
  content: string;
  turn_index?: number;
};

type ParticipantRow = {
  id: string;
  stage: string | null;
  scenario_order: ScenarioType[] | null;
  experienced_scenario_index: number | null;
  assigned_condition: Condition | null;
};

type SurveyRow = {
  section: string;
  responses: Record<string, unknown>;
};

function isStage(value: string): value is Stage {
  return [
    "landing",
    "screening",
    "screened_out",
    "consent",
    "pre_moderators",
    "scenario_view",
    "scenario_chat",
    "post_survey",
    "open_questions",
    "demographics",
    "debrief",
  ].includes(value);
}

function resolveStageAndScenarioIndex(
  dbStage: string,
  experiencedScenarioIndex: number
): { stage: Stage; scenarioIndex: number } {
  const stage = isStage(dbStage) ? dbStage : "screening";

  if (
    stage === "scenario_view" ||
    stage === "scenario_chat" ||
    stage === "post_survey"
  ) {
    return { stage, scenarioIndex: experiencedScenarioIndex };
  }

  return { stage, scenarioIndex: 0 };
}

function toChatMessages(messages: StoredConversationMessage[]): ChatMessage[] {
  return messages.map(({ role, content }) => ({ role, content }));
}

export async function buildSessionRestore(
  participantId: string
): Promise<SessionRestorePayload | null> {
  const supabase = getSupabase();

  const { data: participant, error: participantError } = await supabase
    .from("participants")
    .select(
      "id, stage, scenario_order, experienced_scenario_index, assigned_condition"
    )
    .eq("id", participantId)
    .eq("study", "phase1")
    .maybeSingle();

  if (participantError || !participant) {
    return null;
  }

  const row = participant as ParticipantRow;
  const scenarioOrder = row.scenario_order ?? [];
  const experiencedScenarioIndex = row.experienced_scenario_index ?? 0;

  const { data: surveys, error: surveysError } = await supabase
    .from("survey_responses")
    .select("section, responses")
    .eq("participant_id", participantId)
    .order("submitted_at", { ascending: true });

  if (surveysError) {
    return null;
  }

  const surveyRows = (surveys ?? []) as SurveyRow[];
  const screeningRow = surveyRows.find((entry) => entry.section === "screening");
  const consentRow = surveyRows.find((entry) => entry.section === "consent");

  const dbStage = row.stage ?? "screening";
  const { stage, scenarioIndex } = resolveStageAndScenarioIndex(
    dbStage,
    experiencedScenarioIndex
  );

  let messages: ChatMessage[] = [];
  let turnCount = 0;
  let chatStartedAtMs: number | null = null;

  if (stage === "scenario_chat") {
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .select("messages, turn_count, started_at")
      .eq("participant_id", participantId)
      .eq("scenario_index", scenarioIndex)
      .maybeSingle();

    if (!conversationError && conversation) {
      const stored =
        (conversation.messages as StoredConversationMessage[] | null) ?? [];
      messages = toChatMessages(stored);
      turnCount =
        typeof conversation.turn_count === "number"
          ? conversation.turn_count
          : messages.filter((m) => m.role === "user").length;
      if (turnCount > 0 && conversation.started_at) {
        chatStartedAtMs = new Date(conversation.started_at as string).getTime();
      }
    }
  }

  const consentAgreed =
    Boolean(consentRow) ||
    !["landing", "screening", "consent", "screened_out"].includes(stage);

  const screening =
    screeningRow?.responses &&
    typeof screeningRow.responses === "object" &&
    !Array.isArray(screeningRow.responses)
      ? (Object.fromEntries(
          Object.entries(screeningRow.responses).map(([key, value]) => [
            key,
            String(value),
          ])
        ) as Record<string, string>)
      : null;

  return {
    participantId: row.id,
    stage,
    scenarioIndex,
    scenarioOrder,
    experiencedScenarioIndex,
    assignedCondition: row.assigned_condition ?? null,
    messages,
    turnCount,
    chatStartedAtMs,
    consentAgreed,
    screening,
  };
}

export async function findPhase1ParticipantIdByAssignment(
  assignmentId: string
): Promise<string | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("participants")
    .select("id")
    .eq("study", "phase1")
    .eq("cloudresearch_assignment_id", assignmentId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.id as string;
}
