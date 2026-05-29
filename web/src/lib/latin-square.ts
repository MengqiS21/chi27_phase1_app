import type { Condition, ScenarioType } from "./types";

const LATIN_SQUARE: { conditions: Condition[]; scenarios: ScenarioType[] }[] = [
  {
    conditions: ["A", "B", "C", "D"],
    scenarios: ["temporal", "relational", "face", "grief"],
  },
  {
    conditions: ["B", "C", "D", "A"],
    scenarios: ["relational", "face", "grief", "temporal"],
  },
  {
    conditions: ["C", "D", "A", "B"],
    scenarios: ["face", "grief", "temporal", "relational"],
  },
  {
    conditions: ["D", "A", "B", "C"],
    scenarios: ["grief", "temporal", "relational", "face"],
  },
];

export function getAssignment(row: number) {
  return LATIN_SQUARE[row % 4];
}
