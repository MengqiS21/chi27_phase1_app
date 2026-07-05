import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function PATCH(request: Request) {
  try {
    const { participantId, stage } = await request.json();
    if (!participantId || !stage) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("participants")
      .update({ stage })
      .eq("id", participantId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
