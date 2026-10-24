// localStorage access for React app
import { STORAGE_KEY_BOOKMARKS, STORAGE_KEY_HYPOTHESIS, STORAGE_KEY_NOTES } from "./storageKeys.js";
import type { EvidenceId, PersonId } from "../types.js";

export interface HypothesisDraft {
  suspectId: PersonId;
  nature: string;
  evidenceIds: EvidenceId[];
  confidence: string;
  explanation: string;
  alternative: string;
  savedAt: string;
}

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function readBookmarks(): EvidenceId[] {
  const parsed = readJson(STORAGE_KEY_BOOKMARKS);
  return Array.isArray(parsed) ? parsed.map(String) : [];
}

export function saveBookmarks(ids: readonly EvidenceId[]): void {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(ids));
}

// cast, not validation - like the vanilla loader
export function readNotes(): Record<EvidenceId, string> {
  const parsed = readJson(STORAGE_KEY_NOTES);
  return parsed && typeof parsed === "object" ? (parsed as Record<EvidenceId, string>) : {};
}

export function saveNotes(notes: Record<EvidenceId, string>): void {
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
}

export function readHypothesis(): Partial<HypothesisDraft> {
  const parsed = readJson(STORAGE_KEY_HYPOTHESIS);
  return parsed && typeof parsed === "object" ? (parsed as Partial<HypothesisDraft>) : {};
}

export function saveHypothesis(draft: HypothesisDraft): void {
  localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
}
