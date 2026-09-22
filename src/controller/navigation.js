// ---------------------------------------------------------------------
// NAVIGATION / HASH ROUTING
// ---------------------------------------------------------------------
import { renderDashboard } from "../view/dashboard.js";
import { renderEvidenceList } from "../view/evidence-catalogue.js";
import { renderPeople, renderLocations } from "../view/peopleAndLocations.js";
import { renderTimeline } from "../view/timeline.js";
import { renderWorkspace } from "../view/workspace.js";
import { viewRendered, setCurrentPage, setViewRendered } from "./state.js";

export function navigateTo(viewName) {
  window.location.hash = viewName;
  // handleHashChange() will pick this up via the hashchange listener
}

export function handleHashChange() {
  let hash = window.location.hash.replace("#", "");
  const validViews = ["dashboard", "evidence", "people", "timeline", "workspace"];
  if (validViews.indexOf(hash) === -1) {
    hash = "dashboard";
  }
  setCurrentPage(hash);

  const sections = document.querySelectorAll(".view");
  for (let i = 0; i < sections.length; i++) {
    sections[i].classList.remove("active");
  }
  document.getElementById("view-" + hash).classList.add("active");

  const navButtons = document.querySelectorAll(".nav-btn");
  for (let n = 0; n < navButtons.length; n++) {
    navButtons[n].classList.remove("active");
    if (navButtons[n].getAttribute("data-view") === hash) {
      navButtons[n].classList.add("active");
    }
  }

  if (hash === "dashboard") { //&& !viewRendered.dashboard -> blocks rerendering
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