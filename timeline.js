// ---------------------------------------------------------------------
// TIMELINE
// ---------------------------------------------------------------------
import { findEvidenceById, findLocationById, formatDate } from "./lookup-utilities.js";
import { navigateTo } from "./navigation.js";
import { openEvidenceDetail } from "./evidence-detail.js";

export function populateTimelineDropdowns() {
  var personSelect = document.getElementById("timelinePersonFilter");
  var locationSelect = document.getElementById("timelineLocationFilter");
  var typeSelect = document.getElementById("timelineTypeFilter");
  if (!personSelect || !locationSelect || !typeSelect) return;

  personSelect.innerHTML = '<option value="">All people</option>';
  for (var p = 0; p < allPeople.length; p++) {
    personSelect.innerHTML += '<option value="' + allPeople[p].id + '">' + allPeople[p].name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (var l = 0; l < allLocations.length; l++) {
    locationSelect.innerHTML += '<option value="' + allLocations[l].id + '">' + allLocations[l].id + "</option>";
  }

  var types = [];
  for (var i = 0; i < allTimeline.length; i++) {
    if (types.indexOf(allTimeline[i].type) === -1) types.push(allTimeline[i].type);
  }
  typeSelect.innerHTML = '<option value="">All event types</option>';
  for (var t = 0; t < types.length; t++) {
    typeSelect.innerHTML += '<option value="' + types[t] + '">' + types[t] + "</option>";
  }
}

export function renderTimeline() {
  var container = document.getElementById("timelineContainer");
  if (!container) return;

  var order = document.getElementById("timelineOrder").value;
  var personFilter = document.getElementById("timelinePersonFilter").value;
  var locationFilter = document.getElementById("timelineLocationFilter").value;
  var typeFilter = document.getElementById("timelineTypeFilter").value;

  var events = [];
  for (var i = 0; i < allTimeline.length; i++) {
    var evt = allTimeline[i];
    if (personFilter && evt.personIds.indexOf(personFilter) === -1) continue;
    if (locationFilter && evt.locationIds.indexOf(locationFilter) === -1) continue;
    if (typeFilter && evt.type !== typeFilter) continue;
    events.push(evt);
  }

  events = events.slice().sort(function (a, b) {
    var diff = new Date(a.time) - new Date(b.time);
    return order === "desc" ? -diff : diff;
  });

  var html = "";
  for (var e = 0; e < events.length; e++) {
    var item = events[e];
    html += '<div class="timeline-event certainty-' + item.certainty + '">';
    html += '<div class="timeline-time">' + formatDate(item.time) + '&nbsp;&middot;&nbsp;<span class="badge badge-' + certaintyBadgeClass(item.certainty) + '">' + item.certainty + "</span></div>";
    html += "<h3>" + item.title + "</h3>";
    html += "<p>" + item.description + "</p>";

    var eventLocationNames = [];
    for (var el = 0; el < item.locationIds.length; el++) {
      var evtLoc = findLocationById(item.locationIds[el]);
      eventLocationNames.push(evtLoc || item.locationIds[el]);
    }
    if (eventLocationNames.length > 0) {
      html += '<p class="evidence-meta">Location: ' + eventLocationNames.join(", ") + "</p>";
    }

    for (var ev2 = 0; ev2 < item.evidenceIds.length; ev2++) {
      html += '<button type="button" class="evidence-link-btn" data-evidence-id="' + item.evidenceIds[ev2] + '">View ' + item.evidenceIds[ev2] + "</button>";
    }
    html += "</div>";
  }
  if (events.length === 0) {
    html = "<p>No timeline events match the current filters.</p>";
  }
  container.innerHTML = html;

  var linkButtons = container.querySelectorAll(".evidence-link-btn");
  for (var b = 0; b < linkButtons.length; b++) {
    linkButtons[b].addEventListener("click", function (e) {
      openEvidenceModal(e.target.getAttribute("data-evidence-id"));
    });
  }
}

function certaintyBadgeClass(certainty) {
  if (certainty === "confirmed") return "reviewed";
  if (certainty === "contradictory") return "critical";
  if (certainty === "reported") return "flagged";
  return "unreviewed";
}

// --- Quick-view modal (used from the timeline) -------------------------
function openEvidenceModal(evidenceId) {
  var ev = findEvidenceById(evidenceId);
  if (!ev) return;

  var modal = document.getElementById("quickViewModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "quickViewModal";
    document.body.appendChild(modal);
  }

  modal.innerHTML =
    '<div class="modal-backdrop"><div class="modal-box">' +
    '<button type="button" class="modal-close-btn" aria-label="Close">&times;</button>' +
    "<h3>" + ev.title + "</h3>" +
    '<p class="evidence-meta">' + ev.id + " &middot; " + ev.type + " &middot; " + formatDate(ev.timestamp) + "</p>" +
    "<p>" + ev.summary + "</p>" +
    '<button type="button" class="btn btn-primary btn-small" data-open-full="' + ev.id + '">Open full evidence</button>' +
    "</div></div>";

  modalCloseListenerCount++;
  console.log("modal opened, active close listeners:", modalCloseListenerCount);

  modal.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal-close-btn") || e.target.classList.contains("modal-backdrop")) {
      modal.innerHTML = "";
    }
    if (e.target.getAttribute && e.target.getAttribute("data-open-full")) {
      modal.innerHTML = "";
      navigateTo("evidence");
      setTimeout(function () {
        openEvidenceDetail(e.target.getAttribute("data-open-full"));
      }, 0);
    }
  });
}