import type { ScenarioType } from "./types";

export const STUDY = "phase1" as const;

/** Provisional — final value set after pilot calibration. Change here only (or via env). */
export const TRANSITION_TRIGGER_T = Number(
  process.env.NEXT_PUBLIC_TRANSITION_TRIGGER_T ?? "3"
);

/** User turns in the transition span after T (spec: ~2–3 turns). */
export const TRANSITION_TURN_SPAN = Number(
  process.env.NEXT_PUBLIC_TRANSITION_TURN_SPAN ?? "3"
);

export function maxUserTurns(): number {
  return TRANSITION_TRIGGER_T + TRANSITION_TURN_SPAN;
}

/**
 * Single scenario for all Phase 1 participants — switch here only after pilot.
 * Must be one of scenario_1 | scenario_2 | scenario_3.
 */
export const PHASE1_SCENARIO = (process.env.NEXT_PUBLIC_PHASE1_SCENARIO ??
  "scenario_3") as ScenarioType;

export const PHASE1_TARGET_N = Number(
  process.env.PHASE1_TARGET_N ?? process.env.NEXT_PUBLIC_PHASE1_TARGET_N ?? "180"
);

export const PHASE1_QUOTA_PER_CONDITION = Math.floor(PHASE1_TARGET_N / 4);

export const PHASE1_ALLOCATION_SIZE = PHASE1_TARGET_N;

/** Seeded shuffle for the Phase 1 allocation table — change here only. */
export const PHASE1_ALLOCATION_SEED = Number(
  process.env.PHASE1_ALLOCATION_SEED ??
    process.env.NEXT_PUBLIC_PHASE1_ALLOCATION_SEED ??
    "20260601"
);

export const CONDITION_LABELS = {
  A: "baseline",
  B: "attitude",
  C: "subjective_norms",
  D: "pbc",
} as const;

export type ConditionLabel =
  (typeof CONDITION_LABELS)[keyof typeof CONDITION_LABELS];

export const LABEL_TO_CONDITION = {
  baseline: "A",
  attitude: "B",
  subjective_norms: "C",
  pbc: "D",
} as const satisfies Record<ConditionLabel, keyof typeof CONDITION_LABELS>;
