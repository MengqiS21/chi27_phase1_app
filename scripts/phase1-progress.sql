-- =============================================================================
-- Phase 1 — recruitment progress dashboard (run in Supabase SQL Editor)
--
-- Allocation: 180 slots total, 45 per condition (A/B/C/D), seed 20260601
-- Valid N: completed_at + demographics submitted + at least one chat turn
--
-- Production only (STUDY2026) for slots / valid counts (matches /api/assign).
-- CHI2026 / PHASE1A / PHASE1B test rows appear only in summary.test_rows.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) Summary (production slots + valid; test row count separate)
-- ---------------------------------------------------------------------------
WITH params AS (
  SELECT
    180 AS target_n,
    45 AS quota_per_condition
),
prod_assigned AS (
  SELECT p.*
  FROM participants p
  WHERE p.study = 'phase1'
    AND p.access_code = 'STUDY2026'
    AND p.assigned_condition IS NOT NULL
    AND p.latin_square_row IS NOT NULL
),
prod_valid AS (
  SELECT p.*
  FROM participants p
  WHERE p.study = 'phase1'
    AND p.access_code = 'STUDY2026'
    AND p.completed_at IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM survey_responses sr
      WHERE sr.participant_id = p.id
        AND sr.section = 'demographics'
    )
    AND EXISTS (
      SELECT 1
      FROM conversations c
      WHERE c.participant_id = p.id
        AND c.turn_count > 0
    )
)
SELECT
  'summary' AS section,
  params.target_n AS target_n,
  (SELECT COUNT(*) FROM prod_assigned) AS slots_claimed,
  params.target_n - (SELECT COUNT(*) FROM prod_assigned) AS slots_open,
  (SELECT COUNT(*) FROM prod_valid) AS valid_n,
  (SELECT COUNT(*) FROM prod_assigned WHERE completed_at IS NOT NULL) AS assigned_completed,
  (SELECT COUNT(*) FROM participants p WHERE p.study = 'phase1' AND p.access_code = 'STUDY2026') AS production_rows,
  (SELECT COUNT(*) FROM participants p WHERE p.study = 'phase1' AND p.access_code = 'CHI2026') AS test_rows
FROM params;

-- ---------------------------------------------------------------------------
-- 2) Per condition — assigned, valid, remaining quota (STUDY2026 only)
-- ---------------------------------------------------------------------------
WITH params AS (
  SELECT 45 AS quota_per_condition
),
conditions AS (
  SELECT *
  FROM (
    VALUES
      ('A', 'baseline'),
      ('B', 'attitude'),
      ('C', 'subjective_norms'),
      ('D', 'pbc')
  ) AS t(assigned_condition, condition_label)
),
assigned AS (
  SELECT p.assigned_condition, COUNT(*) AS n_assigned
  FROM participants p
  WHERE p.study = 'phase1'
    AND p.access_code = 'STUDY2026'
    AND p.assigned_condition IS NOT NULL
  GROUP BY p.assigned_condition
),
valid AS (
  SELECT p.assigned_condition, COUNT(*) AS n_valid
  FROM participants p
  WHERE p.study = 'phase1'
    AND p.access_code = 'STUDY2026'
    AND p.completed_at IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM survey_responses sr
      WHERE sr.participant_id = p.id AND sr.section = 'demographics'
    )
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.participant_id = p.id AND c.turn_count > 0
    )
  GROUP BY p.assigned_condition
)
SELECT
  c.assigned_condition,
  c.condition_label,
  COALESCE(a.n_assigned, 0) AS assigned_n,
  COALESCE(v.n_valid, 0) AS valid_n,
  params.quota_per_condition - COALESCE(a.n_assigned, 0) AS slots_remaining
FROM conditions c
CROSS JOIN params
LEFT JOIN assigned a ON a.assigned_condition = c.assigned_condition
LEFT JOIN valid v ON v.assigned_condition = c.assigned_condition
ORDER BY c.assigned_condition;

-- ---------------------------------------------------------------------------
-- 3) Funnel by stage (STUDY2026 production only)
-- ---------------------------------------------------------------------------
SELECT
  COALESCE(stage, '(null)') AS stage,
  COUNT(*) AS n
FROM participants
WHERE study = 'phase1'
  AND access_code = 'STUDY2026'
GROUP BY stage
ORDER BY n DESC, stage;

-- ---------------------------------------------------------------------------
-- 4) Recent completions (last 20 valid, STUDY2026 only)
-- ---------------------------------------------------------------------------
SELECT
  p.id AS participant_id,
  p.cloudresearch_participant_id,
  p.cloudresearch_assignment_id,
  p.assigned_condition,
  p.condition_label,
  p.latin_square_row AS slot_index,
  p.completed_at,
  c.turn_count AS chat_turns
FROM participants p
LEFT JOIN conversations c
  ON c.participant_id = p.id AND c.scenario_index = 0
WHERE p.study = 'phase1'
  AND p.access_code = 'STUDY2026'
  AND p.completed_at IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM survey_responses sr
    WHERE sr.participant_id = p.id AND sr.section = 'demographics'
  )
  AND EXISTS (
    SELECT 1 FROM conversations c2
    WHERE c2.participant_id = p.id AND c2.turn_count > 0
  )
ORDER BY p.completed_at DESC
LIMIT 20;
