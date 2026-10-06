// ---------------------------------------------------------------------
// DATA LOADING
// ---------------------------------------------------------------------
import {
  populateAllDropdowns,
  renderEvidenceList,
  applyStoredBookmarkFlags,
} from "../view/evidence-catalogue.js";
import { renderDashboard } from "../view/dashboard.js";
import { renderTimeline } from "../view/timeline.js";
import {
  setCaseData,
  setAllPeople,
  setAllLocations,
  setAllEvidence,
  setFilteredEvidence,
  setAllTimeline,
  currentPage,
  loadingStepsRemaining,
  setLoadingStepsRemaining,
  decrementLoadingStepsRemaining,
  allEvidence,
  allPeople,
  setEvidenceViewLoading,
} from "./state.js";
import type { CaseData, CaseLocation, Person, TimelineEvent } from "../types.js";
import { toEvidenceList } from "../shared/normalize.js";

// fetch().json() is typed any -> Pinned to unknown so nothing downstream inherits any
async function fetchJson(path: string): Promise<unknown> {
  const res = await fetch(path);
  return await res.json();
}

function showLoadingOverlay(msg: string): void {
  const overlay = document.getElementById("loadingOverlay");
  const text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

function hideLoadingStep(): void {
  decrementLoadingStepsRemaining();
  if (loadingStepsRemaining <= 0) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}
// sequential load, waiting for each step, promises are chained
async function loadCorePeopleAndLocations(): Promise<void> {
  const caseJson = await fetchJson("data/case.json");
  setCaseData(caseJson as CaseData);

  const peopleJson = await fetchJson("data/people.json");
  setAllPeople(peopleJson as Person[]);

  const locationsJson = await fetchJson("data/locations.json");
  setAllLocations(locationsJson as CaseLocation[]);

  hideLoadingStep();
  renderDashboard();
  populateAllDropdowns();
}

async function loadEvidenceData(): Promise<void> {
  try {
    const data = await fetchJson("data/evidence.json");
    // people are already loaded, toPersonIds resolves names
    setAllEvidence(toEvidenceList(data, allPeople as Person[]));
    applyStoredBookmarkFlags();
    setFilteredEvidence([...allEvidence]);
    setEvidenceViewLoading(false);
    renderDashboard();
    populateAllDropdowns();
    if (currentPage === "evidence") renderEvidenceList();
  } catch (err) {
    console.error("Failed to load evidence.json", err);
    setEvidenceViewLoading(false); // adjust state on failure
    alert("Evidence could not be loaded. Some views may be incomplete.");
  }
}

async function loadTimelineData(): Promise<void> {
  try {
    const data = await fetchJson("data/timeline.json");
    setAllTimeline(data as TimelineEvent[]);
    renderDashboard();
    if (currentPage === "timeline") renderTimeline();
    populateAllDropdowns();
  } catch (err) {
    console.log("timeline load error", err);
  } finally {
    hideLoadingStep();
  }
}

export async function loadAllData(): Promise<void> {
  showLoadingOverlay("Loading case file…");
  setLoadingStepsRemaining(2);
  await loadCorePeopleAndLocations();
  loadEvidenceData();
  loadTimelineData();
}
