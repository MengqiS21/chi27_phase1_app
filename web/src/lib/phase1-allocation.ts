import type { ConditionLabel } from "./study-config";

export type Phase1AllocationSlot = {
  conditionLabel: ConditionLabel;
};

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const copy = [...items];
  const random = mulberry32(seed);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildPhase1AllocationTable(
  targetN: number,
  seed: number
): Phase1AllocationSlot[] {
  const quota = Math.floor(targetN / 4);
  const labels: ConditionLabel[] = [
    "baseline",
    "attitude",
    "subjective_norms",
    "pbc",
  ];
  const slots: Phase1AllocationSlot[] = [];
  for (const conditionLabel of labels) {
    for (let i = 0; i < quota; i++) {
      slots.push({ conditionLabel });
    }
  }
  const remainder = targetN - slots.length;
  for (let i = 0; i < remainder; i++) {
    slots.push({ conditionLabel: labels[i % labels.length] });
  }
  return seededShuffle(slots, seed >>> 0);
}

let cachedKey: string | null = null;
let cachedTable: Phase1AllocationSlot[] | null = null;

export function getPhase1AllocationTable(
  targetN: number,
  seed: number
): Phase1AllocationSlot[] {
  const key = `${targetN}:${seed >>> 0}`;
  if (cachedTable && cachedKey === key) {
    return cachedTable;
  }
  cachedTable = buildPhase1AllocationTable(targetN, seed);
  cachedKey = key;
  return cachedTable;
}

export function getPhase1AllocationSlot(
  slotIndex: number,
  targetN: number,
  seed: number
): Phase1AllocationSlot | null {
  if (slotIndex < 0 || slotIndex >= targetN) {
    return null;
  }
  return getPhase1AllocationTable(targetN, seed)[slotIndex];
}
