import { NextResponse } from "next/server";
import { PRODUCTION_ACCESS_CODE } from "@/content/access-codes";
import { assignPhase1 } from "@/lib/assignment";
import { getPhase1AllocationSlot } from "@/lib/phase1-allocation";
import {
  PHASE1_ALLOCATION_SEED,
  PHASE1_ALLOCATION_SIZE,
} from "@/lib/study-config";
import { getSupabase } from "@/lib/supabase";
import type { Condition, ScenarioType } from "@/lib/types";

type ParticipantRow = {
  id: string;
  study: string;
  access_code: string | null;
  assigned_condition: Condition | null;
  condition_label: string | null;
  scenario_order: ScenarioType[] | null;
  experienced_scenario_index: number | null;
  interaction_scenario: ScenarioType | null;
  latin_square_row: number | null;
};

function devOnlySlotIndex(participantId: string): number {
  let hash = 0;
  for (let i = 0; i < participantId.length; i++) {
    hash = (hash * 31 + participantId.charCodeAt(i)) >>> 0;
  }
  return hash % PHASE1_ALLOCATION_SIZE;
}

function assignmentResponse(row: ParticipantRow) {
  return {
    scenarioOrder: row.scenario_order ?? [],
    experiencedScenarioIndex: row.experienced_scenario_index ?? 0,
    assignedCondition: row.assigned_condition,
    conditionLabel: row.condition_label ?? null,
    allocationSlotIndex: row.latin_square_row ?? null,
  };
}

const MAX_CLAIM_ATTEMPTS = 8;

async function findFirstOpenPhase1Slot(
  supabase: ReturnType<typeof getSupabase>
): Promise<number | null> {
  const { data: takenRows, error } = await supabase
    .from("participants")
    .select("latin_square_row")
    .eq("study", "phase1")
    .eq("access_code", PRODUCTION_ACCESS_CODE)
    .not("assigned_condition", "is", null)
    .not("latin_square_row", "is", null);

  if (error) {
    throw error;
  }

  const taken = new Set(
    (takenRows ?? [])
      .map((row) => row.latin_square_row)
      .filter((value): value is number => typeof value === "number")
  );

  for (let slotIndex = 0; slotIndex < PHASE1_ALLOCATION_SIZE; slotIndex++) {
    if (!taken.has(slotIndex)) {
      return slotIndex;
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const { participantId } = await request.json();
    if (!participantId) {
      return NextResponse.json({ error: "Missing participantId" }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data: existing, error: fetchError } = await supabase
      .from("participants")
      .select(
        "id, study, access_code, assigned_condition, condition_label, scenario_order, experienced_scenario_index, interaction_scenario, latin_square_row"
      )
      .eq("id", participantId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Participant not found." }, { status: 404 });
    }

    if (existing.study !== "phase1") {
      return NextResponse.json(
        { error: "Assignment is only used for the Phase 1 study." },
        { status: 400 }
      );
    }

    if (existing.assigned_condition) {
      return NextResponse.json(assignmentResponse(existing as ParticipantRow));
    }

    for (let attempt = 0; attempt < MAX_CLAIM_ATTEMPTS; attempt++) {
      let slotIndex: number;
      try {
        const openSlot = await findFirstOpenPhase1Slot(supabase);
        if (openSlot === null) {
          if (existing.access_code === PRODUCTION_ACCESS_CODE) {
            return NextResponse.json(
              {
                error:
                  "This study has reached its participant capacity. Thank you for your interest.",
              },
              { status: 403 }
            );
          }
          slotIndex = devOnlySlotIndex(existing.id);
        } else {
          slotIndex = openSlot;
        }
      } catch (slotLookupError) {
        const message =
          slotLookupError instanceof Error
            ? slotLookupError.message
            : "Could not look up allocation slots.";
        return NextResponse.json({ error: message }, { status: 500 });
      }

      const allocationSlot = getPhase1AllocationSlot(
        slotIndex,
        PHASE1_ALLOCATION_SIZE,
        PHASE1_ALLOCATION_SEED
      );

      if (!allocationSlot) {
        return NextResponse.json(
          { error: "No allocation slot available." },
          { status: 403 }
        );
      }

      const assignment = assignPhase1(slotIndex, allocationSlot);

      const { data: updated, error: updateError } = await supabase
        .from("participants")
        .update({
          scenario_order: assignment.scenarioOrder,
          experienced_scenario_index: assignment.experiencedScenarioIndex,
          interaction_scenario: assignment.interactionScenario,
          assigned_condition: assignment.assignedCondition,
          condition_label: assignment.conditionLabel,
          latin_square_row: slotIndex,
        })
        .eq("id", participantId)
        .is("assigned_condition", null)
        .select(
          "id, study, assigned_condition, condition_label, scenario_order, experienced_scenario_index, interaction_scenario, latin_square_row"
        )
        .maybeSingle();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      if (updated) {
        await supabase.from("survey_responses").insert({
          participant_id: participantId,
          section: "assignment_meta",
          responses: {
            transition_trigger_t: assignment.transitionTriggerT,
            scenario: assignment.interactionScenario,
            condition_label: assignment.conditionLabel,
            allocation_slot_index: slotIndex,
          },
        });

        return NextResponse.json(assignmentResponse(updated as ParticipantRow));
      }

      const { data: retry, error: retryError } = await supabase
        .from("participants")
        .select(
          "id, study, assigned_condition, condition_label, scenario_order, experienced_scenario_index, interaction_scenario, latin_square_row"
        )
        .eq("id", participantId)
        .maybeSingle();

      if (retryError) {
        return NextResponse.json({ error: retryError.message }, { status: 500 });
      }

      if (retry?.assigned_condition) {
        return NextResponse.json(assignmentResponse(retry as ParticipantRow));
      }
    }

    return NextResponse.json(
      { error: "Could not assign a participant slot. Please try again." },
      { status: 409 }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
