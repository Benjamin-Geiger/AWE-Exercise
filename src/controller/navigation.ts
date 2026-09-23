// ---------------------------------------------------------------------
// NAVIGATION / HASH ROUTING
// ---------------------------------------------------------------------
import { renderDashboard } from "../view/dashboard.js";
import { renderEvidenceList } from "../view/evidence-catalogue.js";
import { renderPeople, renderLocations } from "../view/peopleAndLocations.js";
import { renderTimeline } from "../view/timeline.js";
import { renderWorkspace } from "../view/workspace.js";
import { viewRendered, setCurrentPage, setViewRendered } from "./state.js";
import type { ViewName } from "./state.js";

const VALID_VIEWS: ViewName[] = ["dashboard", "evidence", "people", "timeline", "workspace"];

export function navigateTo(viewName: ViewName): void {
  window.location.hash = viewName;
  // handleHashChange() will pick this up via the hashchange listener
}

export function handleHashChange(): void {
  const raw = window.location.hash.replace("#", "");
  // narrows string -> ViewName, same fallback as the old indexOf check
  const hash: ViewName = VALID_VIEWS.find((v) => v === raw) ?? "dashboard";
  setCurrentPage(hash);

  const sections = document.querySelectorAll(".view");
  for (let i = 0; i < sections.length; i++) {
    sections[i]?.classList.remove("active");
  }
  document.getElementById("view-" + hash)?.classList.add("active");

  const navButtons = document.querySelectorAll(".nav-btn");
  for (let n = 0; n < navButtons.length; n++) {
    const btn = navButtons[n];
    if (!btn) continue;
    btn.classList.remove("active");
    if (btn.getAttribute("data-view") === hash) {
      btn.classList.add("active");
    }
  }

  if (hash === "dashboard") {
    //&& !viewRendered.dashboard -> blocks rerendering
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
