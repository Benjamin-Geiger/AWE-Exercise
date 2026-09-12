// ---------------------------------------------------------------------
// GLOBAL STATE
// ---------------------------------------------------------------------
export let allEvidence = [];
export let filteredEvidence = [];
export let selectedEvidence = null;
export let bookmarks = [];
export let currentPage = "dashboard";

export let allPeople = [];
export let allLocations = [];
export let allTimeline = [];
export let caseData = {};

export let currentPeopleTab = "people";
export let loadingStepsRemaining = 2;

export let evidenceViewLoading = true;
export let viewRendered = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false
};

export let notesStore = {};
export let modalCloseListenerCount = 0;

export const STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
export const STORAGE_KEY_NOTES = "remotion_notes";
export const STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";

export function setAllEvidence(value) { allEvidence = value; }
export function setFilteredEvidence(value) { filteredEvidence = value; }
export function setSelectedEvidence(value) { selectedEvidence = value; }
export function setBookmarks(value) { bookmarks = value; }
export function setCurrentPage(value) { currentPage = value; }
export function setAllPeople(value) { allPeople = value; }
export function setAllLocations(value) { allLocations = value; }
export function setAllTimeline(value) { allTimeline = value; }
export function setCaseData(value) { caseData = value; }
export function setCurrentPeopleTab(value) { currentPeopleTab = value; }
export function setLoadingStepsRemaining(value) { loadingStepsRemaining = value; }
export function decrementLoadingStepsRemaining() { loadingStepsRemaining--; }
export function setNotesStore(value) { notesStore = value; }
export function incrementModalCloseListenerCount() { modalCloseListenerCount++; }
export function setViewRendered(view, value) { viewRendered[view] = value; }