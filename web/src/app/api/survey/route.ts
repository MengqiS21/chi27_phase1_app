import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      participantId,
      section,
      scenarioIndex,
      scenarioType,
      responses,
      nextStage,
      complete,
    } = body;

    if (!participantId || !section || !responses) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = getSupabase();

    const { error: insertError } = await supabase.from("survey_responses").insert({
      participant_id: participantId,
      section,
      scenario_index: scenarioIndex ?? null,
      scenario_type: scenarioType ?? null,
      responses,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const updatePayload: Record<string, unknown> = {};
    if (nextStage) updatePayload.stage = nextStage;
    if (complete) {
      updatePayload.completed_at = new Date().toISOString();
      updatePayload.stage = "debrief";
    }

    if (Object.keys(updatePayload).length > 0) {
      const { error: updateError } = await supabase
        .from("participants")
        .update(updatePayload)
        .eq("id", participantId);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
