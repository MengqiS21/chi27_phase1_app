-- Same script as chi27_pilot_app/scripts/clear-phase1-study-data.sql
-- Clear Phase 1 study data only (study = 'phase1').

DELETE FROM survey_responses
WHERE participant_id IN (
  SELECT id FROM participants WHERE study = 'phase1'
);

DELETE FROM conversations
WHERE participant_id IN (
  SELECT id FROM participants WHERE study = 'phase1'
);

DELETE FROM participants
WHERE study = 'phase1';
