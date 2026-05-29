-- =============================================================================
-- CHI'27 Experiment Platform — Supabase setup (run entire file once)
-- Supports both Pilot and Phase 1 studies in one database.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Participants
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_code TEXT,
  study TEXT NOT NULL DEFAULT 'pilot',
  scenario_order JSONB,
  experienced_scenario_index INTEGER,
  assigned_condition TEXT,
  latin_square_row INTEGER,
  condition_order JSONB,
  current_scenario_index INTEGER DEFAULT 0,
  stage TEXT DEFAULT 'landing',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Migration helpers (safe to re-run)
ALTER TABLE participants ADD COLUMN IF NOT EXISTS study TEXT DEFAULT 'pilot';
ALTER TABLE participants ADD COLUMN IF NOT EXISTS experienced_scenario_index INTEGER;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS assigned_condition TEXT;

-- Drop legacy pre-survey columns if migrating from old schema (optional)
-- ALTER TABLE participants DROP COLUMN IF EXISTS age;

-- -----------------------------------------------------------------------------
-- Conversations
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES participants(id),
  scenario_index INTEGER,
  scenario_type TEXT,
  condition TEXT,
  turn_index INTEGER,
  role TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- Survey responses (flexible JSONB for all questionnaire sections)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES participants(id),
  section TEXT NOT NULL,
  scenario_index INTEGER,
  scenario_type TEXT,
  responses JSONB NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- Legacy table kept for backward compatibility
CREATE TABLE IF NOT EXISTS scenario_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES participants(id),
  scenario_index INTEGER,
  scenario_type TEXT,
  condition TEXT,
  dg_1 INTEGER, dg_2 INTEGER, dg_3 INTEGER, dg_4 INTEGER,
  bi_follow INTEGER, bi_retry INTEGER, bi_switch INTEGER, bi_alone INTEGER,
  med_understanding INTEGER, med_agency INTEGER, med_refusal INTEGER,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS)
-- -----------------------------------------------------------------------------

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_participants" ON participants;
DROP POLICY IF EXISTS "anon_select_participants" ON participants;
DROP POLICY IF EXISTS "anon_update_participants" ON participants;
DROP POLICY IF EXISTS "anon_insert_conversations" ON conversations;
DROP POLICY IF EXISTS "anon_select_conversations" ON conversations;
DROP POLICY IF EXISTS "anon_insert_survey_responses" ON survey_responses;
DROP POLICY IF EXISTS "anon_select_survey_responses" ON survey_responses;
DROP POLICY IF EXISTS "anon_insert_scenario_responses" ON scenario_responses;
DROP POLICY IF EXISTS "anon_select_scenario_responses" ON scenario_responses;

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

CREATE POLICY "anon_insert_survey_responses"
  ON survey_responses FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_survey_responses"
  ON survey_responses FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_scenario_responses"
  ON scenario_responses FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_scenario_responses"
  ON scenario_responses FOR SELECT TO anon USING (true);
