import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      participantId,
      scenarioIndex,
      scenarioType,
      condition,
      responses,
      complete,
    } = body;

    const supabase = getSupabase();

    const { error: insertError } = await supabase.from("scenario_responses").insert({
      participant_id: participantId,
      scenario_index: scenarioIndex,
      scenario_type: scenarioType,
      condition,
      ...responses,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    if (complete) {
      const { error: completeError } = await supabase
        .from("participants")
        .update({
          stage: "debrief",
          completed_at: new Date().toISOString(),
        })
        .eq("id", participantId);

      if (completeError) {
        return NextResponse.json({ error: completeError.message }, { status: 500 });
      }
    } else {
      const nextIndex = scenarioIndex + 1;
      const { error: stageError } = await supabase
        .from("participants")
        .update({
          stage: "scenario_chat",
        })
        .eq("id", participantId);

      if (stageError) {
        return NextResponse.json({ error: stageError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
