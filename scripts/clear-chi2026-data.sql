-- Clear all rows tied to access code CHI2026 (test / lab channel).
-- Tables: participants, conversations, survey_responses
-- Run in Supabase SQL Editor. Review the preview counts before uncommenting DELETEs.

-- ---------------------------------------------------------------------------
-- Preview (safe to run first)
-- ---------------------------------------------------------------------------
SELECT 'participants' AS table_name, COUNT(*) AS rows_to_delete
FROM participants
WHERE access_code = 'CHI2026'
UNION ALL
SELECT 'conversations', COUNT(*)
FROM conversations
WHERE participant_id IN (SELECT id FROM participants WHERE access_code = 'CHI2026')
UNION ALL
SELECT 'survey_responses', COUNT(*)
FROM survey_responses
WHERE participant_id IN (SELECT id FROM participants WHERE access_code = 'CHI2026');

-- ---------------------------------------------------------------------------
-- Delete (child tables first, then participants)
-- conversations / survey_responses also CASCADE if you only delete participants,
-- but explicit deletes match our other maintenance scripts.
-- ---------------------------------------------------------------------------
BEGIN;

DELETE FROM survey_responses
WHERE participant_id IN (
  SELECT id FROM participants WHERE access_code = 'CHI2026'
);

DELETE FROM conversations
WHERE participant_id IN (
  SELECT id FROM participants WHERE access_code = 'CHI2026'
);

DELETE FROM participants
WHERE access_code = 'CHI2026';

COMMIT;

-- ---------------------------------------------------------------------------
-- Verify (should all be 0)
-- ---------------------------------------------------------------------------
SELECT 'participants' AS table_name, COUNT(*) AS remaining
FROM participants
WHERE access_code = 'CHI2026'
UNION ALL
SELECT 'conversations', COUNT(*)
FROM conversations
WHERE participant_id IN (SELECT id FROM participants WHERE access_code = 'CHI2026')
UNION ALL
SELECT 'survey_responses', COUNT(*)
FROM survey_responses
WHERE participant_id IN (SELECT id FROM participants WHERE access_code = 'CHI2026');
