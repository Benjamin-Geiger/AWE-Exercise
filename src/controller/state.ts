// ---------------------------------------------------------------------
// GLOBAL STATE
// ---------------------------------------------------------------------
import type { CaseData, CaseLocation, EvidenceItem, Person, TimelineEvent } from "../types.js";

// the five views, used by currentPage and viewRendered
export type ViewName = "dashboard" | "evidence" | "people" | "timeline" | "workspace";

export let allEvidence: EvidenceItem[] = [];
export let filteredEvidence: EvidenceItem[] = [];
// bookmarks hold evidence ids, not evidence objects
export let bookmarks: string[] = [];
export let currentPage: ViewName = "dashboard";

export let allPeople: Person[] = [];
export let allLocations: CaseLocation[] = [];
export let allTimeline: TimelineEvent[] = [];
export let caseData: Partial<CaseData> = {};

export let loadingStepsRemaining = 2;

export let evidenceViewLoading = true;
// only its properties change, the object itself is never replaced -> const
export const viewRendered: Record<ViewName, boolean> = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false,
};

export let notesStore: Record<string, string> = {};

export const STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
export const STORAGE_KEY_NOTES = "remotion_notes";
export const STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";

export function setAllEvidence(value: EvidenceItem[]): void {
  allEvidence = value;
}
export function setFilteredEvidence(value: EvidenceItem[]): void {
  filteredEvidence = value;
}
export function setBookmarks(value: string[]): void {
  bookmarks = value;
}
export function setCurrentPage(value: ViewName): void {
  currentPage = value;
}
export function setAllPeople(value: Person[]): void {
  allPeople = value;
}
export function setAllLocations(value: CaseLocation[]): void {
  allLocations = value;
}
export function setAllTimeline(value: TimelineEvent[]): void {
  allTimeline = value;
}
export function setCaseData(value: CaseData): void {
  caseData = value;
}
export function setLoadingStepsRemaining(value: number): void {
  loadingStepsRemaining = value;
}
export function decrementLoadingStepsRemaining(): void {
  loadingStepsRemaining--;
}
export function setNotesStore(value: Record<string, string>): void {
  notesStore = value;
}
export function setViewRendered(view: ViewName, value: boolean): void {
  viewRendered[view] = value;
}
export function setEvidenceViewLoading(value: boolean): void {
  evidenceViewLoading = value;
}
