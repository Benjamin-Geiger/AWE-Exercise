// ---------------------------------------------------------------------
// NORMALISATION OF LOADED JSON (shared by the vanilla and React apps)
// ---------------------------------------------------------------------
import type { Evidence, EvidenceRelevance, EvidenceStatus, Person, PersonId } from "../types.js";

const STATUSES: EvidenceStatus[] = ["unreviewed", "reviewed", "flagged"];
const RELEVANCES: EvidenceRelevance[] = ["unknown", "relevant", "irrelevant"];

export function toStatus(value: unknown): EvidenceStatus {
  const s = String(value).toLowerCase();
  return STATUSES.find((v) => v === s) ?? "unreviewed";
}

export function toRelevance(value: unknown): EvidenceRelevance {
  const r = String(value).toLowerCase();
  return RELEVANCES.find((v) => v === r) ?? "unknown";
}

// resolve names to ids
function toPersonIds(value: unknown, people: Person[]): PersonId[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    const raw = String(entry);
    if (people.some((p) => p.id === raw)) return raw;
    const byName = people.find((p) => p.name === raw);
    return byName ? byName.id : raw;
  });
}

export function toEvidenceList(value: unknown, people: Person[]): Evidence[] {
  if (!Array.isArray(value)) return [];
  return value.map((raw) => {
    const ev = raw as Evidence;
    return {
      ...ev,
      status: toStatus(ev.status),
      relevance: toRelevance(ev.relevance),
      personIds: toPersonIds(ev.personIds, people),
    };
  });
}
