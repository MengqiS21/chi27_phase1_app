import type { Phase1AllocationSlot } from "@/lib/phase1-allocation";
import {
  LABEL_TO_CONDITION,
  PHASE1_SCENARIO,
  TRANSITION_TRIGGER_T,
} from "@/lib/study-config";
import type { Condition, ScenarioType } from "./types";

export function assignPhase1(slotIndex: number, slot: Phase1AllocationSlot) {
  const assignedCondition = LABEL_TO_CONDITION[
    slot.conditionLabel
  ] as Condition;

  return {
    study: "phase1" as const,
    allocationSlotIndex: slotIndex,
    scenarioOrder: [PHASE1_SCENARIO] as ScenarioType[],
    experiencedScenarioIndex: 0,
    interactionScenario: PHASE1_SCENARIO,
    assignedCondition,
    conditionLabel: slot.conditionLabel,
    conditionOrder: [assignedCondition],
    transitionTriggerT: TRANSITION_TRIGGER_T,
  };
}
