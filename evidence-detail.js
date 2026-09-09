// ---------------------------------------------------------------------
// EVIDENCE DETAIL
// ---------------------------------------------------------------------
import { findEvidenceById, findLocationById, findPersonById, formatDate } from "./lookup-utilities.js";
import { loadNoteForEvidence, saveNoteForEvidence } from "./storageHelpers.js";
import { renderEvidenceList } from "./evidence-catalogue.js";
import { setSelectedEvidence, selectedEvidence, viewRendered } from "./data.js";

export function openEvidenceDetail(evidenceId) {
  var ev = findEvidenceById(evidenceId);
  if (!ev) return;
  setSelectedEvidence(ev);

  var section = document.getElementById("evidenceDetailSection");
  section.classList.remove("hidden");

  renderEvidenceDetail(ev);
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function closeEvidenceDetail() {
  var section = document.getElementById("evidenceDetailSection");
  section.classList.add("hidden");
  section.innerHTML = "";
  setSelectedEvidence(null);
}

function renderEvidenceDetail(ev) {
  var section = document.getElementById("evidenceDetailSection");

  var personNames = [];
  for (var p = 0; p < ev.personIds.length; p++) {
    var person = findPersonById(ev.personIds[p]);
    personNames.push(person ? person.name : ev.personIds[p]);
  }

  var locationNames = [];
  for (var l = 0; l < ev.locationIds.length; l++) {
    var loc = findLocationById(ev.locationIds[l]);
    locationNames.push(loc ? loc.id + " - " + loc.name : ev.locationIds[l]);
  }

  var tagsHtml = "";
  for (var t = 0; t < ev.tags.length; t++) {
    tagsHtml += '<span class="tag-chip">' + ev.tags[t] + "</span>";
  }

  var storedNote = loadNoteForEvidence(ev.id);

  var html = "";
  html += '<div class="evidence-detail-header">';
  html += "<div><h2>" + ev.title + "</h2>";
  html += '<div class="evidence-meta">' + ev.id + " &middot; " + ev.type + " &middot; " + formatDate(ev.timestamp) + "</div></div>";
  html += '<button type="button" class="btn btn-secondary btn-small" onclick="closeEvidenceDetail()">Close</button>';
  html += "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html += '<div class="warning-banner">This item is tagged as critical evidence.</div>';
  }

  html += '<div class="detail-field"><strong>Summary</strong>' + ev.summary + "</div>";
  html += '<div class="evidence-detail-content">' + ev.content + "</div>";
  html += '<div class="detail-field"><strong>Related people</strong>' + personNames.join(", ") + "</div>";
  html += '<div class="detail-field"><strong>Related locations</strong>' + locationNames.join(", ") + "</div>";
  html += '<div class="detail-field"><strong>Tags</strong>' + tagsHtml + "</div>";

  html += '<div class="detail-field"><strong>Review status</strong>';
  html += '<select id="detailStatusSelect">';
  html += statusOptionHTML(ev.status, "unreviewed", "Unreviewed");
  html += statusOptionHTML(ev.status, "reviewed", "Reviewed");
  html += statusOptionHTML(ev.status, "flagged", "Flagged");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Relevance</strong>';
  html += '<select id="detailRelevanceSelect">';
  html += statusOptionHTML(ev.relevance, "unknown", "Unknown");
  html += statusOptionHTML(ev.relevance, "relevant", "Relevant");
  html += statusOptionHTML(ev.relevance, "irrelevant", "Irrelevant");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Investigator note</strong>';
  html += '<textarea id="evidenceNoteInput" class="note-textarea" rows="3" data-evidence-id="' + ev.id + '" placeholder="Add a private note about this evidence...">' + storedNote + "</textarea>";
  html += '<button type="button" class="btn btn-primary btn-small" style="margin-top:6px;" onclick="saveCurrentNote()">Save note</button>';
  html += "</div>";

  html += '<div class="detail-field"><strong>Note preview</strong><div id="notePreview">' + storedNote + "</div></div>";

  section.innerHTML = html;

  document.getElementById("detailStatusSelect").addEventListener("change", function (e) {
    ev.status = e.target.value; // direct mutation of the loaded evidence object
    renderEvidenceDetail(ev);
    if (viewRendered.evidence) renderEvidenceList();
  });
  document.getElementById("detailRelevanceSelect").addEventListener("change", function (e) {
    ev.relevance = e.target.value;
    renderEvidenceDetail(ev);
    if (viewRendered.evidence) renderEvidenceList();
  });
}

function statusOptionHTML(current, value, label) {
  var currentLower = (current || "").toLowerCase();
  var selected = currentLower === value ? " selected" : "";
  return '<option value="' + value + '"' + selected + ">" + label + "</option>";
}

export function saveCurrentNote() {
  var textarea = document.getElementById("evidenceNoteInput");
  if (!textarea) return;
  var evidenceId = textarea.getAttribute("data-evidence-id"); // note id is read back off the DOM
  var text = textarea.value;
  saveNoteForEvidence(evidenceId, text);
  var preview = document.getElementById("notePreview");
  if (preview) preview.innerHTML = text; // unsafe on purpose, see above
}
