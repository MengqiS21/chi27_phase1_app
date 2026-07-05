-- Tier 2 schema migration for existing Supabase projects.
-- Safe to re-run. Deploy updated web apps before or with this migration.
--
-- Changes:
--   participants: drop condition_order, transition_trigger_t, current_scenario_index
--   survey_responses: add indexes
--   drop legacy scenario_responses table

ALTER TABLE participants DROP COLUMN IF EXISTS condition_order;
ALTER TABLE participants DROP COLUMN IF EXISTS transition_trigger_t;
ALTER TABLE participants DROP COLUMN IF EXISTS current_scenario_index;

CREATE INDEX IF NOT EXISTS participants_study_idx ON participants (study);
CREATE INDEX IF NOT EXISTS survey_responses_participant_id_idx
  ON survey_responses (participant_id);
CREATE INDEX IF NOT EXISTS survey_responses_participant_section_idx
  ON survey_responses (participant_id, section);

DROP POLICY IF EXISTS "anon_insert_scenario_responses" ON scenario_responses;
DROP POLICY IF EXISTS "anon_select_scenario_responses" ON scenario_responses;
DROP TABLE IF EXISTS scenario_responses CASCADE;
