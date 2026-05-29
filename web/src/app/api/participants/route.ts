import { NextResponse } from "next/server";
import { VALID_CODES } from "@/content/access-codes";
import { assignPhase1 } from "@/lib/assignment";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { accessCode } = await request.json();
    const code = String(accessCode ?? "")
      .trim()
      .toUpperCase();

    if (!VALID_CODES.has(code)) {
      return NextResponse.json({ error: "Invalid access code." }, { status: 400 });
    }

    const supabase = getSupabase();
    const { count, error: countError } = await supabase
      .from("participants")
      .select("id", { count: "exact", head: true })
      .eq("study", "phase1");

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const assignment = assignPhase1(count ?? 0);

    const { data, error } = await supabase
      .from("participants")
      .insert({
        access_code: code,
        study: assignment.study,
        scenario_order: assignment.scenarioOrder,
        experienced_scenario_index: assignment.experiencedScenarioIndex,
        assigned_condition: assignment.assignedCondition,
        condition_order: assignment.conditionOrder,
        latin_square_row: (count ?? 0) % 4,
        stage: "screening",
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      participantId: data.id,
      study: assignment.study,
      scenarioOrder: assignment.scenarioOrder,
      experiencedScenarioIndex: assignment.experiencedScenarioIndex,
      assignedCondition: assignment.assignedCondition,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
