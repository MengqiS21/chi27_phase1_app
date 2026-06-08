import type { Condition, ExperimentState, ScenarioType } from "./types";

export function currentScenarioType(
  state: Pick<ExperimentState, "scenarioOrder" | "scenarioIndex">
): ScenarioType {
  return state.scenarioOrder[state.scenarioIndex];
}

export function currentCondition(
  state: Pick<ExperimentState, "assignedCondition">
): Condition {
  if (!state.assignedCondition) {
    throw new Error("Participant condition not assigned yet.");
  }
  return state.assignedCondition;
}

export function resetScenarioChat(): Pick<
  ExperimentState,
  "messages" | "turnCount" | "refusalDelivered"
> {
  return {
    messages: [],
    turnCount: 0,
    refusalDelivered: false,
  };
}
