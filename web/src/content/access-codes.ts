/** CloudResearch / production channel — only these rows consume allocation slots. */
export const PRODUCTION_ACCESS_CODE = "STUDY2026";

export const VALID_CODES = new Set([
  PRODUCTION_ACCESS_CODE,
  "CHI2026", // lab & internal testing
  "PHASE1A",
  "PHASE1B",
]);
