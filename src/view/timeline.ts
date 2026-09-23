// ---------------------------------------------------------------------
// TIMELINE
// ---------------------------------------------------------------------
import { findEvidenceById, findLocationById, formatDate } from "../controller/lookup-utilities.js";
import { navigateTo } from "../controller/navigation.js";
import { openEvidenceDetail } from "../controller/evidence-detail.js";
import { allPeople, allLocations, allTimeline } from "../controller/state.js";

export function populateTimelineDropdowns(): void {
  const personSelect = document.getElementById("timelinePersonFilter");
  const locationSelect = document.getElementById("timelineLocationFilter");
  const typeSelect = document.getElementById("timelineTypeFilter");
  if (!personSelect || !locationSelect || !typeSelect) return;

  personSelect.innerHTML = '<option value="">All people</option>';
  for (const person of allPeople) {
    personSelect.innerHTML += '<option value="' + person.id + '">' + person.name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (const loc of allLocations) {
    locationSelect.innerHTML += '<option value="' + loc.id + '">' + loc.id + "</option>";
  }

  const types: string[] = [];
  for (const evt of allTimeline) {
    if (types.indexOf(evt.type) === -1) types.push(evt.type);
  }
  typeSelect.innerHTML = '<option value="">All event types</option>';
  for (const type of types) {
    typeSelect.innerHTML += '<option value="' + type + '">' + type + "</option>";
  }
}

export function renderTimeline(): void {
  const container = document.getElementById("timelineContainer");
  if (!container) return;

  const orderSelect = document.getElementById("timelineOrder") as HTMLSelectElement | null;
  const personSelect = document.getElementById("timelinePersonFilter") as HTMLSelectElement | null;
  const locationSelect = document.getElementById(
    "timelineLocationFilter",
  ) as HTMLSelectElement | null;
  const typeSelect = document.getElementById("timelineTypeFilter") as HTMLSelectElement | null;
  if (!orderSelect || !personSelect || !locationSelect || !typeSelect) return;

  const order = orderSelect.value;
  const personFilter = personSelect.value;
  const locationFilter = locationSelect.value;
  const typeFilter = typeSelect.value;

  let events = [];
  for (const evt of allTimeline) {
    if (personFilter && evt.personIds.indexOf(personFilter) === -1) continue;
    if (locationFilter && evt.locationIds.indexOf(locationFilter) === -1) continue;
    if (typeFilter && evt.type !== typeFilter) continue;
    events.push(evt);
  }

  events = events.slice().sort((a, b) => {
    const diff = new Date(a.time).getTime() - new Date(b.time).getTime();
    return order === "desc" ? -diff : diff;
  });

  let html = "";
  for (const item of events) {
    html += '<div class="timeline-event certainty-' + item.certainty + '">';
    html +=
      '<div class="timeline-time">' +
      formatDate(item.time) +
      '&nbsp;&middot;&nbsp;<span class="badge badge-' +
      certaintyBadgeClass(item.certainty) +
      '">' +
      item.certainty +
      "</span></div>";
    html += "<h3>" + item.title + "</h3>";
    html += "<p>" + item.description + "</p>";

    const eventLocationNames: string[] = [];
    for (const locationId of item.locationIds) {
      const evtLoc = findLocationById(locationId);
      eventLocationNames.push(evtLoc ? evtLoc.id + " - " + evtLoc.name : locationId);
    }
    if (eventLocationNames.length > 0) {
      html += '<p class="evidence-meta">Location: ' + eventLocationNames.join(", ") + "</p>";
    }

    for (const evidenceId of item.evidenceIds) {
      html +=
        '<button type="button" class="evidence-link-btn" data-evidence-id="' +
        evidenceId +
        '">View ' +
        evidenceId +
        "</button>";
    }
    html += "</div>";
  }
  if (events.length === 0) {
    html = "<p>No timeline events match the current filters.</p>";
  }
  container.innerHTML = html;

  const linkButtons = container.querySelectorAll(".evidence-link-btn");
  for (let b = 0; b < linkButtons.length; b++) {
    linkButtons[b]?.addEventListener("click", (e) => {
      const id = (e.target as HTMLElement).getAttribute("data-evidence-id");
      if (id) openEvidenceModal(id);
    });
  }
}

function certaintyBadgeClass(certainty: string): string {
  if (certainty === "confirmed") return "reviewed";
  if (certainty === "contradictory") return "critical";
  if (certainty === "reported") return "flagged";
  return "unreviewed";
}

function openEvidenceModal(evidenceId: string): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  let modal = document.getElementById("quickViewModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "quickViewModal";
    document.body.appendChild(modal);
    // The modal element is reused, so its listener is registered once, here.
    modal.addEventListener("click", handleModalClick);
  }

  modal.innerHTML =
    '<div class="modal-backdrop"><div class="modal-box">' +
    '<button type="button" class="modal-close-btn" aria-label="Close">&times;</button>' +
    "<h3>" +
    ev.title +
    "</h3>" +
    '<p class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</p>" +
    "<p>" +
    ev.summary +
    "</p>" +
    '<button type="button" class="btn btn-primary btn-small" data-open-full="' +
    ev.id +
    '">Open full evidence</button>' +
    "</div></div>";
}

function handleModalClick(e: Event): void {
  const modal = e.currentTarget as HTMLElement;
  const target = e.target as HTMLElement;
  if (target.classList.contains("modal-close-btn") || target.classList.contains("modal-backdrop")) {
    modal.innerHTML = "";
  }
  const openId = target.getAttribute("data-open-full");
  if (openId) {
    modal.innerHTML = "";
    navigateTo("evidence");
    setTimeout(() => openEvidenceDetail(openId), 0);
  }
}
