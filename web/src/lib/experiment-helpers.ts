import type { Condition, ExperimentState, ScenarioType } from "./types";

export function currentScenarioType(
  state: Pick<ExperimentState, "scenarioOrder" | "scenarioIndex">
): ScenarioType {
  return state.scenarioOrder[state.scenarioIndex];
}

export function isExperiencedScenario(
  state: Pick<ExperimentState, "scenarioIndex" | "experiencedScenarioIndex">
): boolean {
  return state.scenarioIndex === state.experiencedScenarioIndex;
}

export function currentCondition(
  state: Pick<ExperimentState, "assignedCondition">
): Condition {
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
