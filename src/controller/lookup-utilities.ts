// ---------------------------------------------------------------------
// GENERIC LOOKUP HELPERS
// ---------------------------------------------------------------------
import { allEvidence, allPeople, allLocations } from "./state.js";

// Only the field these lookups actually read. The real Evidence/Person/
// Location interfaces are Demo 6's job, state.js is still untyped.
type HasId = { id: string };

function findEvidenceById(id: string): HasId | null {
  for (let i = 0; i < allEvidence.length; i++) {
    // noUncheckedIndexedAccess makes allEvidence[i] possibly undefined.
    const item = allEvidence[i];
    if (item && item.id === id) return item;
  }
  return null;
}

function findPersonById(id: string): HasId | null {
  for (let i = 0; i < allPeople.length; i++) {
    const item = allPeople[i];
    if (item && item.id === id) return item;
  }
  return null;
}

function findLocationById(id: string): HasId | null {
  for (let i = 0; i < allLocations.length; i++) {
    const item = allLocations[i];
    if (item && item.id === id) return item;
  }
  return null;
}

function evidenceMentionsPerson(
  ev: { personIds?: string[] },
  person: { id: string; name: string },
): boolean {
  if (!ev.personIds) return false;
  return ev.personIds.indexOf(person.id) !== -1 || ev.personIds.indexOf(person.name) !== -1;
}

function formatDate(ts: string | null | undefined): string {
  if (!ts) return "Unknown date";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return (
    d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}

function getStatusBadgeClass(status: string | null | undefined): string {
  const s = (status || "").toLowerCase();
  if (s === "reviewed") return "badge-reviewed";
  if (s === "flagged") return "badge-flagged";
  return "badge-unreviewed";
}

function getRelevanceBadgeClass(relevance: string | null | undefined): string {
  const r = (relevance || "").toLowerCase();
  if (r === "relevant") return "badge-relevant";
  return "badge-unreviewed";
}

// User-typed text must be inserted as text, not markup.
// unknown rather than any: the caller passes unvalidated note text.
function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export {
  findEvidenceById,
  findLocationById,
  findPersonById,
  evidenceMentionsPerson,
  formatDate,
  getStatusBadgeClass,
  getRelevanceBadgeClass,
  escapeHtml,
};
