// ---------------------------------------------------------------------
// DOMAIN TYPES - shapes of the case data in public/data/*.json
// ---------------------------------------------------------------------

// Id aliases. No runtime effect, but they name what a string is supposed to be.
export type EvidenceId = string; // "E01"
export type PersonId = string; // "nova-byte"
export type LocationId = string; // "L01"
export type TimelineEventId = string; // "T01"

// The data uses two different date formats, so they get two names.
export type IsoDateTime = string; // "2026-10-16T06:49:00Z"
export type IsoDate = string; // "2026-10-16"

// Closed sets. The UI offers exactly these three each.
// NOTE: evidence.json contains "Reviewed" and "Unknown" (capitalised), which
// do not match these. Normalising at load is Demo 6 task 2.
export type EvidenceStatus = "unreviewed" | "reviewed" | "flagged";
export type EvidenceRelevance = "unknown" | "relevant" | "irrelevant";

// The only field whose values are consistent in the raw data.
export type Certainty = "confirmed" | "reported" | "contradictory";

// case.json - a single object, not an array.
export interface CaseData {
  caseId: string; // "REMOTION-2026-10"
  title: string;
  subtitle: string;
  status: string; // "open" - case lifecycle, unrelated to EvidenceStatus
  opened: IsoDate; // date only, unlike every other date in the data
  summary: string;
  location: string; // free text place name, NOT a LocationId
  leadInvestigator: string; // free text ("Unassigned"), NOT a PersonId
  notes: string;
}

// evidence.json - 18 records.
export interface Evidence {
  id: EvidenceId;
  type: string; // 15 distinct values incl. "test-report"/"Test-Report", left open
  title: string;
  timestamp: IsoDateTime;
  summary: string;
  content: string;
  personIds: PersonId[]; // NOTE: some entries hold a display name ("Nova Byte")
  locationIds: LocationId[];
  tags: string[];
  status: EvidenceStatus;
  relevance: EvidenceRelevance;
}

// people.json - 6 records.
export interface Person {
  id: PersonId;
  name: string; // "Nova Byte"
  role: string;
  speciality: string;
  responsibilities: string[];
  statement: string;
  background: string;
  avatar: string; // document-relative path, "assets/people/nova-byte.png"
}

// locations.json - 6 records. Named CaseLocation because Location is a DOM global.
export interface CaseLocation {
  id: LocationId;
  name: string;
  description: string;
  contains: string[]; // free text equipment names, not ids
}

// timeline.json - 15 records.
export interface TimelineEvent {
  id: TimelineEventId;
  time: IsoDateTime;
  title: string;
  description: string;
  type: string; // 11 distinct values, left open like Evidence.type
  certainty: Certainty;
  personIds: PersonId[];
  locationIds: LocationId[];
  evidenceIds: EvidenceId[];
}
