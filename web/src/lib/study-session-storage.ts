const PHASE1_SESSION_KEY = "chi27_phase1_participant_id";

export function readStudySessionParticipantId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = sessionStorage.getItem(PHASE1_SESSION_KEY)?.trim();
    return value || null;
  } catch {
    return null;
  }
}

export function persistStudySessionParticipantId(participantId: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PHASE1_SESSION_KEY, participantId);
  } catch {
    // Ignore quota / private-mode errors.
  }
}

export function clearStudySessionParticipantId(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(PHASE1_SESSION_KEY);
  } catch {
    // Ignore.
  }
}
