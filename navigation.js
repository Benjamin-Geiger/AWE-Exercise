// ---------------------------------------------------------------------
// NAVIGATION / HASH ROUTING
// ---------------------------------------------------------------------
import { renderDashboard } from "./dashboard.js";
import { renderEvidenceList } from "./evidence-catalogue.js";
import { renderPeople, renderLocations } from "./peopleAndLocations.js";
import { renderTimeline } from "./timeline.js";
import { renderWorkspace } from "./workspace.js";
import { viewRendered, setCurrentPage, setViewRendered } from "./state.js";

export function navigateTo(viewName) {
  window.location.hash = viewName;
  // handleHashChange() will pick this up via the hashchange listener
}

export function handleHashChange() {
  var hash = window.location.hash.replace("#", "");
  var validViews = ["dashboard", "evidence", "people", "timeline", "workspace"];
  if (validViews.indexOf(hash) === -1) {
    hash = "dashboard";
  }
  setCurrentPage(hash);

  var sections = document.querySelectorAll(".view");
  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.remove("active");
  }
  document.getElementById("view-" + hash).classList.add("active");

  var navButtons = document.querySelectorAll(".nav-btn");
  for (var n = 0; n < navButtons.length; n++) {
    navButtons[n].classList.remove("active");
    if (navButtons[n].getAttribute("data-view") === hash) {
      navButtons[n].classList.add("active");
    }
  }

  if (hash === "dashboard" && !viewRendered.dashboard) {
    renderDashboard();
    setViewRendered("dashboard", true);
  } else if (hash === "evidence" && !viewRendered.evidence) {
    renderEvidenceList();
    setViewRendered("evidence", true);
  } else if (hash === "people" && !viewRendered.people) {
    renderPeople();
    renderLocations();
    setViewRendered("people", true);
  } else if (hash === "timeline" && !viewRendered.timeline) {
    renderTimeline();
    setViewRendered("timeline", true);
  } else if (hash === "workspace") {
    // workspace is cheap enough that it always re-renders
    renderWorkspace();
  }
}