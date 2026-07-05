-- =============================================================================
-- CHI'27 Experiment Platform — Supabase setup (run entire file once)
-- Supports both Pilot and Phase 1 studies in one database.
-- Tier 2 schema: lean participants + survey_responses; conversations unchanged.
-- Keep identical to chi27_pilot_app/schema.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Participants
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_code TEXT,
  cloudresearch_participant_id TEXT,
  cloudresearch_assignment_id TEXT,
  cloudresearch_hit_id TEXT,
  url_query_raw TEXT,
  study TEXT NOT NULL DEFAULT 'pilot',
  scenario_order JSONB,
  experienced_scenario_index INTEGER,
  assigned_condition TEXT,
  pilot_group TEXT,
  interaction_scenario TEXT,
  condition_label TEXT,
  latin_square_row INTEGER,
  stage TEXT DEFAULT 'landing',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Migration helpers (safe to re-run on DBs created from older schema)
ALTER TABLE participants ADD COLUMN IF NOT EXISTS study TEXT DEFAULT 'pilot';
ALTER TABLE participants ADD COLUMN IF NOT EXISTS experienced_scenario_index INTEGER;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS assigned_condition TEXT;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS pilot_group TEXT;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS interaction_scenario TEXT;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS condition_label TEXT;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS cloudresearch_participant_id TEXT;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS cloudresearch_assignment_id TEXT;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS cloudresearch_hit_id TEXT;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS url_query_raw TEXT;

ALTER TABLE participants DROP COLUMN IF EXISTS condition_order;
ALTER TABLE participants DROP COLUMN IF EXISTS transition_trigger_t;
ALTER TABLE participants DROP COLUMN IF EXISTS current_scenario_index;

CREATE INDEX IF NOT EXISTS participants_study_idx ON participants (study);

-- -----------------------------------------------------------------------------
-- Conversations (one row per participant + scenario chat session)
-- messages JSONB holds the full transcript, e.g.
-- [{"role":"user","content":"...","turn_index":1},{"role":"assistant",...}]
-- -----------------------------------------------------------------------------

-- Upgrade from legacy per-message rows (column "role") — safe to re-run
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'conversations'
      AND column_name = 'role'
  ) THEN
    DROP TABLE public.conversations CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  scenario_index INTEGER NOT NULL,
  scenario_type TEXT,
  condition TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  turn_count INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (participant_id, scenario_index)
);

CREATE INDEX IF NOT EXISTS conversations_participant_id_idx
  ON conversations (participant_id);

-- -----------------------------------------------------------------------------
-- Survey responses (flexible JSONB for all questionnaire sections)
--
-- Common section values:
--   screening, consent, section_a, section_b, section_c, demographics
--   pre_moderators, post_survey (phase1)
--   assignment_meta — frozen assignment snapshot at randomization, e.g.
--     { transition_trigger_t, scenario, condition_label, allocation_slot_index,
--       pilot_group? }
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  scenario_index INTEGER,
  scenario_type TEXT,
  responses JSONB NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS survey_responses_participant_id_idx
  ON survey_responses (participant_id);

CREATE INDEX IF NOT EXISTS survey_responses_participant_section_idx
  ON survey_responses (participant_id, section);

-- Drop legacy table (old per-scenario Likert export; web apps use survey_responses)
DROP POLICY IF EXISTS "anon_insert_scenario_responses" ON scenario_responses;
DROP POLICY IF EXISTS "anon_select_scenario_responses" ON scenario_responses;
DROP TABLE IF EXISTS scenario_responses CASCADE;

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS)
-- -----------------------------------------------------------------------------

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_participants" ON participants;
DROP POLICY IF EXISTS "anon_select_participants" ON participants;
DROP POLICY IF EXISTS "anon_update_participants" ON participants;
DROP POLICY IF EXISTS "anon_insert_conversations" ON conversations;
DROP POLICY IF EXISTS "anon_select_conversations" ON conversations;
DROP POLICY IF EXISTS "anon_update_conversations" ON conversations;
DROP POLICY IF EXISTS "anon_insert_survey_responses" ON survey_responses;
DROP POLICY IF EXISTS "anon_select_survey_responses" ON survey_responses;

CREATE POLICY "anon_insert_participants"
  ON participants FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_participants"
  ON participants FOR SELECT TO anon USING (true);

CREATE POLICY "anon_update_participants"
  ON participants FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_insert_conversations"
  ON conversations FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_conversations"
  ON conversations FOR SELECT TO anon USING (true);

CREATE POLICY "anon_update_conversations"
  ON conversations FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_insert_survey_responses"
  ON survey_responses FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_survey_responses"
  ON survey_responses FOR SELECT TO anon USING (true);
