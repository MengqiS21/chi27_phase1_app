import {
  CHAT_MAX_DURATION_MS,
  CHAT_MIN_DURATION_MS,
} from "@/lib/study-config";

export function chatElapsedMs(chatStartedAtMs: number | null): number {
  if (chatStartedAtMs == null) return 0;
  return Math.max(0, Date.now() - chatStartedAtMs);
}

export function canContinueToSurvey(chatStartedAtMs: number | null): boolean {
  if (chatStartedAtMs == null) return false;
  return chatElapsedMs(chatStartedAtMs) >= CHAT_MIN_DURATION_MS;
}

export function hasReachedMaxDuration(chatStartedAtMs: number | null): boolean {
  if (chatStartedAtMs == null) return false;
  return chatElapsedMs(chatStartedAtMs) >= CHAT_MAX_DURATION_MS;
}
