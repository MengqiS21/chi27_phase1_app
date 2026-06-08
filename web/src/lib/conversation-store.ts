import { getSupabase } from "@/lib/supabase";

export type StoredConversationMessage = {
  role: "user" | "assistant";
  content: string;
  turn_index: number;
};

type SaveTurnParams = {
  participantId: string;
  scenarioIndex: number;
  scenarioType: string;
  condition: string;
  turnCount: number;
  userContent: string;
  assistantText: string;
};

export async function saveConversationTurn(
  params: SaveTurnParams
): Promise<string | null> {
  const supabase = getSupabase();
  const {
    participantId,
    scenarioIndex,
    scenarioType,
    condition,
    turnCount,
    userContent,
    assistantText,
  } = params;

  const turnMessages: StoredConversationMessage[] = [
    { role: "user", content: userContent, turn_index: turnCount },
    { role: "assistant", content: assistantText, turn_index: turnCount },
  ];

  const { data: existing, error: fetchError } = await supabase
    .from("conversations")
    .select("id, messages")
    .eq("participant_id", participantId)
    .eq("scenario_index", scenarioIndex)
    .maybeSingle();

  if (fetchError) {
    return fetchError.message;
  }

  const prior = (existing?.messages as StoredConversationMessage[] | null) ?? [];
  const messages = [...prior, ...turnMessages];
  const updatedAt = new Date().toISOString();

  if (existing?.id) {
    const { error } = await supabase
      .from("conversations")
      .update({
        messages,
        turn_count: turnCount,
        condition,
        updated_at: updatedAt,
      })
      .eq("id", existing.id);

    return error?.message ?? null;
  }

  const { error } = await supabase.from("conversations").insert({
    participant_id: participantId,
    scenario_index: scenarioIndex,
    scenario_type: scenarioType,
    condition,
    messages,
    turn_count: turnCount,
    updated_at: updatedAt,
  });

  return error?.message ?? null;
}
