// ---------------------------------------------------------------------
// EVIDENCE CATALOGUE
// ---------------------------------------------------------------------
import { findEvidenceById, findPersonById, getRelevanceBadgeClass, getStatusBadgeClass, formatDate, evidenceMentionsPerson } from "./lookup-utilities.js";
import { saveBookmarksToStorage } from "./storageHelpers.js";
import { openEvidenceDetail } from "./evidence-detail.js";
import { populateHypothesisDropdowns } from "./workspace.js";
import {
  allEvidence, filteredEvidence, bookmarks, currentPage, evidenceViewLoading,
  setFilteredEvidence, setBookmarks, allPeople, allLocations
} from "./state.js";
import { populateTimelineDropdowns } from "./timeline.js";

export function populateAllDropdowns() {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}

function populateEvidenceDropdowns() {
  var typeSelect = document.getElementById("filterType");
  var personSelect = document.getElementById("filterPerson");
  var locationSelect = document.getElementById("filterLocation");
  if (!typeSelect || !personSelect || !locationSelect) return;

  var types = [];
  for (var i = 0; i < allEvidence.length; i++) {
    var t = allEvidence[i].type.toLowerCase();
    if (types.indexOf(t) === -1) types.push(t);
  }
  typeSelect.innerHTML = '<option value="">All types</option>';
  for (var ti = 0; ti < types.length; ti++) {
    typeSelect.innerHTML += '<option value="' + types[ti] + '">' + types[ti] + "</option>";
  }

  personSelect.innerHTML = '<option value="">All people</option>';
  for (var p = 0; p < allPeople.length; p++) {
    personSelect.innerHTML += '<option value="' + allPeople[p].id + '">' + allPeople[p].name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (var l = 0; l < allLocations.length; l++) {
    locationSelect.innerHTML += '<option value="' + allLocations[l].id + '">' + allLocations[l].id + " - " + allLocations[l].name + "</option>";
  }
}

function getFilteredEvidence() {
  var searchBox = document.getElementById("evidenceSearch");
  var searchTerm = searchBox ? searchBox.value.toLowerCase().trim() : "";
  var typeVal = document.getElementById("filterType").value;
  var personVal = document.getElementById("filterPerson").value;
  var locationVal = document.getElementById("filterLocation").value;
  var statusVal = document.getElementById("filterStatus").value;
  var relevanceVal = document.getElementById("filterRelevance").value;

  var results = [];
  for (var i = 0; i < allEvidence.length; i++) {
    var item = allEvidence[i];
    var matches = true;

    if (searchTerm) {
      var haystack = (item.title + " " + item.summary + " " + item.tags.join(" ")).toLowerCase();
      if (haystack.indexOf(searchTerm) === -1) matches = false;
    }
    if (matches && typeVal && item.type.toLowerCase() !== typeVal) matches = false;
    if (matches && personVal) {
      var person = findPersonById(personVal);
      if (!person || !evidenceMentionsPerson(item, person)) matches = false;
    }
    if (matches && locationVal && item.locationIds.indexOf(locationVal) === -1) matches = false;
    if (matches && statusVal && (item.status || "").toLowerCase() !== statusVal) matches = false;
    if (matches && relevanceVal && (item.relevance || "").toLowerCase() !== relevanceVal) matches = false;

    if (matches) results.push(item);
  }

  setFilteredEvidence(results);
  return results;
}

export function renderEvidenceList() {
  var container = document.getElementById("evidenceList");
  if (!container) return;

  var loadingIndicator = document.getElementById("evidenceLoadingIndicator");
  if (evidenceViewLoading) {
    if (loadingIndicator) loadingIndicator.classList.remove("hidden");
    container.innerHTML = "";
    return;
  }
  if (loadingIndicator) loadingIndicator.classList.add("hidden");

  var results = getFilteredEvidence();

  var html = "";
  if (results.length === 0) {
    html = "<p>No evidence matches the current filters.</p>";
  }
  for (var i = 0; i < results.length; i++) {
    html += renderEvidenceCardHTML(results[i]);
  }
  container.innerHTML = html;

  // Event delegation for card clicks / bookmark button.
  container.addEventListener("click", handleEvidenceListClick);
}


function renderEvidenceCardHTML(ev) {
  var isBookmarked = bookmarks.indexOf(ev.id) !== -1;
  var html = '<div class="evidence-card" data-id="' + ev.id + '">';
  html += '<button class="bookmark-btn ' + (isBookmarked ? "active" : "") + '" data-action="bookmark" data-id="' + ev.id + '" aria-label="Toggle bookmark for ' + ev.title + '"><span class="bookmark-icon">' + (isBookmarked ? "★" : "☆") + "</span></button>";
  html += "<h3>" + ev.title + "</h3>";
  html += '<div class="evidence-meta">' + ev.id + " &middot; " + ev.type + " &middot; " + formatDate(ev.timestamp) + "</div>";
  html += '<div class="evidence-summary">' + ev.summary + "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html += '<span class="badge badge-critical">Critical</span>';
  }
  html += '<span class="badge ' + getStatusBadgeClass(ev.status) + '">' + ev.status + "</span>";
  html += '<span class="badge ' + getRelevanceBadgeClass(ev.relevance) + '">' + ev.relevance + "</span>";
  html += "<div>";
  for (var t = 0; t < ev.tags.length; t++) {
    html += '<span class="tag-chip">' + ev.tags[t] + "</span>";
  }
  html += "</div>";
  html += "</div>";
  return html;
}

function handleEvidenceListClick(event) {
  var target = event.target;

  if (target.dataset && target.dataset.action === "bookmark") {
    event.stopPropagation();
    handleBookmarkClick(target.dataset.id);
    return;
  }

  var card = target.closest(".evidence-card");
  if (card) {
    openEvidenceDetail(card.getAttribute("data-id"));
  }
}

function handleBookmarkClick(evidenceId) {
  var ev = findEvidenceById(evidenceId);
  if (!ev) return;

  if (bookmarks.indexOf(evidenceId) === -1) {
    bookmarks.push(evidenceId);
    ev.bookmarked = true;
  } else {
    setBookmarks(bookmarks.filter(function (id) {
      return id !== evidenceId;
    }));
    ev.bookmarked = false;
  }
  saveBookmarksToStorage();
  if (currentPage === "evidence") renderEvidenceList();
}

export function applyStoredBookmarkFlags() {
  for (var i = 0; i < allEvidence.length; i++) {
    allEvidence[i].bookmarked = bookmarks.indexOf(allEvidence[i].id) !== -1;
  }
}

export function handleSortChange() {
  var sortValue = document.getElementById("sortEvidence").value;

  if (sortValue === "title-asc") {
    filteredEvidence.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  } else if (sortValue === "title-desc") {
    filteredEvidence.sort(function (a, b) {
      return b.title.localeCompare(a.title);
    });
  } else if (sortValue === "date-asc") {
    filteredEvidence.sort(function (a, b) {
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
  } else {
    filteredEvidence.sort(function (a, b) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  }
  renderEvidenceList();
}

export function clearFilters() {
  document.getElementById("evidenceSearch").value = "";
  document.getElementById("filterType").value = "";
  document.getElementById("filterPerson").value = "";
  document.getElementById("filterLocation").value = "";
  document.getElementById("filterStatus").value = "";
  document.getElementById("filterRelevance").value = "";
  renderEvidenceList();
}

function simulateAsyncSearch(term) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(term);
    }, 300);
  });
}

var latestSearchRequestId = 0;

export function handleSearchInput(event) {
  var term = event.target.value;
  var requestId = ++latestSearchRequestId;

  simulateAsyncSearch(term).then(function (resolvedTerm) {
    // Only apply this response if nothing newer has been typed meanwhile.
    if (requestId !== latestSearchRequestId) return;
    renderEvidenceList();
  });
}