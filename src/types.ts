export type EvidenceId = string;
export type PersonId = string;
export type LocationId = string;
export type TimelineEventId = string;

export type IsoDateTime = string;
export type IsoDate = string;

export type EvidenceStatus = "unreviewed" | "reviewed" | "flagged";
export type EvidenceRelevance = "unknown" | "relevant" | "irrelevant";

export type Certainty = "confirmed" | "reported" | "contradictory";

export interface CaseData {
  caseId: string;
  title: string;
  subtitle: string;
  status: string;
  opened: IsoDate; 
  summary: string;
  location: string;
  leadInvestigator: string;
  notes: string;
}

export interface Evidence {
  id: EvidenceId;
  type: string;
  title: string;
  timestamp: IsoDateTime;
  summary: string;
  content: string;
  personIds: PersonId[];
  locationIds: LocationId[];
  tags: string[];
  status: EvidenceStatus;
  relevance: EvidenceRelevance;
}

export interface Person {
  id: PersonId;
  name: string;
  role: string;
  speciality: string;
  responsibilities: string[];
  statement: string;
  background: string;
  avatar: string;
}

export interface CaseLocation {
  id: LocationId;
  name: string;
  description: string;
  contains: string[];
}

export interface TimelineEvent {
  id: TimelineEventId;
  time: IsoDateTime;
  title: string;
  description: string;
  type: string;
  certainty: Certainty;
  personIds: PersonId[];
  locationIds: LocationId[];
  evidenceIds: EvidenceId[];
}
