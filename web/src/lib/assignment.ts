import type { Condition, ScenarioType } from "./types";

export const PILOT_SCENARIO_TYPES: ScenarioType[] = [
  "temporal",
  "relational",
  "face",
];

export const PHASE1_SCENARIO_TYPES: ScenarioType[] = [
  "temporal",
  "relational",
  "face",
  "grief",
];

const CONDITIONS: Condition[] = ["A", "B", "C", "D"];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function assignPilot(count: number) {
  const scenarioOrder = shuffle(PILOT_SCENARIO_TYPES);
  const experiencedScenarioIndex = Math.floor(Math.random() * 3);
  const assignedCondition = CONDITIONS[count % 4];

  return {
    study: "pilot" as const,
    scenarioOrder,
    experiencedScenarioIndex,
    assignedCondition,
    conditionOrder: [assignedCondition],
  };
}

export function assignPhase1(count: number) {
  const scenarioIndex = count % PHASE1_SCENARIO_TYPES.length;
  const scenarioType = PHASE1_SCENARIO_TYPES[scenarioIndex];
  const assignedCondition = CONDITIONS[Math.floor(count / PHASE1_SCENARIO_TYPES.length) % 4];

  return {
    study: "phase1" as const,
    scenarioOrder: [scenarioType],
    experiencedScenarioIndex: 0,
    assignedCondition,
    conditionOrder: [assignedCondition],
  };
}
