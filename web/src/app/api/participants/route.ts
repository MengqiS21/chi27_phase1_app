import { NextResponse } from "next/server";
import { VALID_CODES } from "@/content/access-codes";
import { cloudResearchInsertFields } from "@/lib/cloudresearch-params";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accessCode } = body;
    const code = String(accessCode ?? "")
      .trim()
      .toUpperCase();

    if (!VALID_CODES.has(code)) {
      return NextResponse.json({ error: "Invalid access code." }, { status: 400 });
    }

    const supabase = getSupabase();
    const crFields = cloudResearchInsertFields(body);
    const assignmentId = crFields.cloudresearch_assignment_id as
      | string
      | undefined;

    if (assignmentId) {
      const { data: existing, error: lookupError } = await supabase
        .from("participants")
        .select("id")
        .eq("study", "phase1")
        .eq("cloudresearch_assignment_id", assignmentId)
        .maybeSingle();

      if (lookupError) {
        return NextResponse.json({ error: lookupError.message }, { status: 500 });
      }

      if (existing?.id) {
        return NextResponse.json({
          participantId: existing.id,
          study: "phase1",
          resumed: true,
        });
      }
    }

    const { data, error } = await supabase
      .from("participants")
      .insert({
        access_code: code,
        study: "phase1",
        stage: "screening",
        ...crFields,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      participantId: data.id,
      study: "phase1",
      resumed: false,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
