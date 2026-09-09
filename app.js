import { loadAllData } from "./data-loading.js";
import { handleHashChange, navigateTo } from "./navigation.js";
import {
  clearFilters,
  handleSearchInput,
  handleSortChange,
  renderEvidenceList
} from "./evidence-catalogue.js";
import { renderTimeline } from "./timeline.js";
import { loadBookmarksFromStorage, loadNotesFromStorage, loadNoteAsync } from "./storageHelpers.js";
import { saveHypothesis } from "./workspace.js";
import { switchPeopleTab } from "./peopleAndLocations.js";
import { closeEvidenceDetail, saveCurrentNote } from "./evidence-detail.js";
import { allEvidence, currentPage } from "./data.js";

// ---------------------------------------------------------------------
// EVENT LISTENER SETUP
// ---------------------------------------------------------------------

function setupEventListeners() {
  window.addEventListener("hashchange", handleHashChange);

  var navButtons = document.querySelectorAll(".nav-btn");
  for (var i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", function () {
      var targetView = navButtons[i].getAttribute("data-view");
      console.log("nav clicked:", targetView);
    });
  }

  document.getElementById("evidenceSearch").addEventListener("input", handleSearchInput);

  document.getElementById("filterType").addEventListener("change", renderEvidenceList);
  document.getElementById("filterPerson").addEventListener("change", renderEvidenceList);
  document.getElementById("filterLocation").addEventListener("change", renderEvidenceList);

  document.getElementById("filterStatus").addEventListener("change", renderEvidenceList);
  document.getElementById("filterStatus").setAttribute("onchange", "renderEvidenceList()");

  document.getElementById("filterRelevance").addEventListener("change", renderEvidenceList);

  document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters);

  document.getElementById("timelineOrder").addEventListener("change", renderTimeline);
  document.getElementById("timelinePersonFilter").addEventListener("change", renderTimeline);
  document.getElementById("timelineLocationFilter").addEventListener("change", renderTimeline);
  document.getElementById("timelineTypeFilter").addEventListener("change", renderTimeline);

  document.getElementById("hypConfidence").addEventListener("input", function (e) {
    document.getElementById("hypConfidenceValue").textContent = e.target.value;
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

function initApp() {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();

  loadAllData().then(function () {
    handleHashChange();
    var firstNote = loadNoteAsync("E01");
    console.log("First note preview:", firstNote);
  });
}

window.addEventListener("DOMContentLoaded", initApp);
window.addEventListener("hashchange", handleHashChange);
