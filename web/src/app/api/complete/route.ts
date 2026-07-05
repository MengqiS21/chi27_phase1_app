import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/** Idempotently mark a participant as finished (debrief reached). */
export async function POST(request: Request) {
  try {
    const { participantId } = await request.json();
    if (!participantId) {
      return NextResponse.json({ error: "Missing participantId" }, { status: 400 });
    }

    const supabase = getSupabase();
    const completedAt = new Date().toISOString();

    const { data, error } = await supabase
      .from("participants")
      .update({
        stage: "debrief",
        completed_at: completedAt,
      })
      .eq("id", participantId)
      .is("completed_at", null)
      .select("id, completed_at")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data) {
      return NextResponse.json({ ok: true, completed_at: data.completed_at });
    }

    const { data: existing, error: fetchError } = await supabase
      .from("participants")
      .select("completed_at")
      .eq("id", participantId)
      .maybeSingle();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Participant not found." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      completed_at: existing.completed_at,
      alreadyComplete: true,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
