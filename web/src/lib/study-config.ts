import type { ScenarioType } from "./types";

export const STUDY = "phase1" as const;

/**
 * User turn index when condition strategy begins (turns 1..T-1 are general-only).
 * Phase 1: four general turns, strategy from user turn 5 onward.
 */
export const TRANSITION_TRIGGER_T = Number(
  process.env.NEXT_PUBLIC_TRANSITION_TRIGGER_T ?? "5"
);

export const PRE_TRANSITION_USER_TURNS = Math.max(0, TRANSITION_TRIGGER_T - 1);

/** Minimum chat duration before "Continue to survey" is enabled. */
export const CHAT_MIN_DURATION_MS = 12 * 60 * 1000;

/** Maximum chat duration — auto-advance to post-survey. */
export const CHAT_MAX_DURATION_MS = 25 * 60 * 1000;

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
