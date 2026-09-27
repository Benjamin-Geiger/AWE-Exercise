import { loadAllData } from "./data-loading.js";
import { handleHashChange, navigateTo } from "./navigation.js";
import {
  clearFilters,
  handleSearchInput,
  handleSortChange,
  renderEvidenceList,
} from "../view/evidence-catalogue.js";
import { renderTimeline } from "../view/timeline.js";
import { loadBookmarksFromStorage, loadNotesFromStorage, loadNoteAsync } from "./storageHelpers.js";
import { saveHypothesis } from "../view/workspace.js";
import { switchPeopleTab } from "../view/peopleAndLocations.js";
import { closeEvidenceDetail, saveCurrentNote } from "./evidence-detail.js";

// index.html calls these from inline onclick handlers so they must exist on window
declare global {
  interface Window {
    navigateTo: typeof navigateTo;handleSortChange: typeof handleSortChange;switchPeopleTab: typeof switchPeopleTab;saveHypothesis: typeof saveHypothesis;closeEvidenceDetail: typeof closeEvidenceDetail;
    saveCurrentNote: typeof saveCurrentNote;
  }
}

// ---------------------------------------------------------------------
// EVENT LISTENER SETUP
// ---------------------------------------------------------------------

function on(id: string, event: string, handler: EventListener): void {
  document.getElementById(id)?.addEventListener(event, handler);
}

function setupEventListeners(): void {
  window.addEventListener("hashchange", handleHashChange);

  const navButtons = document.querySelectorAll(".nav-btn");
  for (let i = 0; i < navButtons.length; i++) {
    navButtons[i]?.addEventListener("click", (event) => {
      const targetView = (event.currentTarget as HTMLElement).getAttribute("data-view");
      console.log("nav clicked:", targetView);
    });
  }

  on("evidenceSearch", "input", handleSearchInput);

  on("filterType", "change", renderEvidenceList);
  on("filterPerson", "change", renderEvidenceList);
  on("filterLocation", "change", renderEvidenceList);

  on("filterStatus", "change", renderEvidenceList);

  on("filterRelevance", "change", renderEvidenceList);

  on("clearFiltersBtn", "click", clearFilters);

  on("timelineOrder", "change", renderTimeline);
  on("timelinePersonFilter", "change", renderTimeline);
  on("timelineLocationFilter", "change", renderTimeline);
  on("timelineTypeFilter", "change", renderTimeline);

  on("hypConfidence", "input", (e) => {
    const value = (e.target as HTMLInputElement).value;
    const out = document.getElementById("hypConfidenceValue");
    if (out) out.textContent = value;
  });
}

window.navigateTo = navigateTo;
window.handleSortChange = handleSortChange;
window.switchPeopleTab = switchPeopleTab;
window.saveHypothesis = saveHypothesis;
window.closeEvidenceDetail = closeEvidenceDetail;
window.saveCurrentNote = saveCurrentNote;

// ---------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------

function initApp(): void {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();

  void loadAllData().then(() => {
    handleHashChange();
    const firstNote = loadNoteAsync("E01");
    console.log("First note preview:", firstNote);
  });
}

window.addEventListener("DOMContentLoaded", initApp);
window.addEventListener("hashchange", handleHashChange);
