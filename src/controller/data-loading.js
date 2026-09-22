// ---------------------------------------------------------------------
// DATA LOADING
// ---------------------------------------------------------------------
import { populateAllDropdowns, renderEvidenceList, applyStoredBookmarkFlags } from "../view/evidence-catalogue.js";
import { renderDashboard } from "../view/dashboard.js";
import { renderTimeline } from "../view/timeline.js";
import {
  setCaseData, setAllPeople, setAllLocations, setAllEvidence, setFilteredEvidence,
  setAllTimeline, currentPage, loadingStepsRemaining, setLoadingStepsRemaining,
  decrementLoadingStepsRemaining, allEvidence, setEvidenceViewLoading
} from "./state.js";

function showLoadingOverlay(msg) {
  const overlay = document.getElementById("loadingOverlay");
  const text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

function hideLoadingStep() {
  decrementLoadingStepsRemaining();
  if (loadingStepsRemaining <= 0) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}

// Still sequential on purpose: each request only starts after the previous one finished.
async function loadCorePeopleAndLocations() {
  const caseRes = await fetch("data/case.json");
  const caseJson = await caseRes.json();
  setCaseData(caseJson);

  const peopleRes = await fetch("data/people.json");
  const peopleJson = await peopleRes.json();
  setAllPeople(peopleJson);

  const locationsRes = await fetch("data/locations.json");
  const locationsJson = await locationsRes.json();
  setAllLocations(locationsJson);

  hideLoadingStep();
  renderDashboard();
  populateAllDropdowns();
}

async function loadEvidenceData() {
  try {
    const res = await fetch("data/evidence.json");
    const data = await res.json();
    setAllEvidence(data);
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

async function loadTimelineData() {
  try {
    const res = await fetch("data/timeline.json");
    const data = await res.json();
    setAllTimeline(data);
    renderDashboard();
    if (currentPage === "timeline") renderTimeline();
    populateAllDropdowns();
  } catch (err) {
    console.log("timeline load error", err);
  } finally {
    hideLoadingStep();
  }
}

export async function loadAllData() {
  showLoadingOverlay("Loading case file…");
  setLoadingStepsRemaining(2);
  await loadCorePeopleAndLocations();
  // Started but not awaited, exactly like the .then() version.
  loadEvidenceData();
  loadTimelineData();
}