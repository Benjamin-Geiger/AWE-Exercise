// ---------------------------------------------------------------------
// EVIDENCE CATALOGUE
// ---------------------------------------------------------------------
import {
  findEvidenceById,
  findPersonById,
  getRelevanceBadgeClass,
  getStatusBadgeClass,
  formatDate,
  evidenceMentionsPerson,
} from "../controller/lookup-utilities.js";
import { saveBookmarksToStorage } from "../controller/storageHelpers.js";
import { openEvidenceDetail } from "../controller/evidence-detail.js";
import { populateHypothesisDropdowns } from "./workspace.js";
import {
  allEvidence,
  bookmarks,
  currentPage,
  evidenceViewLoading,
  setFilteredEvidence,
  setBookmarks,
  allPeople,
  allLocations,
} from "../controller/state.js";
import { populateTimelineDropdowns } from "./timeline.js";
import type { EvidenceItem } from "../types.js";

export function populateAllDropdowns(): void {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}

function populateEvidenceDropdowns(): void {
  const typeSelect = document.getElementById("filterType");
  const personSelect = document.getElementById("filterPerson");
  const locationSelect = document.getElementById("filterLocation");
  if (!typeSelect || !personSelect || !locationSelect) return;

  const types: string[] = [];
  for (const ev of allEvidence) {
    const t = ev.type.toLowerCase();
    if (types.indexOf(t) === -1) types.push(t);
  }
  typeSelect.innerHTML = '<option value="">All types</option>';
  for (const type of types) {
    typeSelect.innerHTML += '<option value="' + type + '">' + type + "</option>";
  }

  personSelect.innerHTML = '<option value="">All people</option>';
  for (const person of allPeople) {
    personSelect.innerHTML += '<option value="' + person.id + '">' + person.name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (const loc of allLocations) {
    locationSelect.innerHTML +=
      '<option value="' + loc.id + '">' + loc.id + " - " + loc.name + "</option>";
  }
}

function getFilteredEvidence(): EvidenceItem[] {
  const searchBox = document.getElementById("evidenceSearch") as HTMLInputElement | null;
  const searchTerm = searchBox ? searchBox.value.toLowerCase().trim() : "";
  const typeVal = (document.getElementById("filterType") as HTMLSelectElement | null)?.value ?? "";
  const personVal =
    (document.getElementById("filterPerson") as HTMLSelectElement | null)?.value ?? "";
  const locationVal =
    (document.getElementById("filterLocation") as HTMLSelectElement | null)?.value ?? "";
  const statusVal =
    (document.getElementById("filterStatus") as HTMLSelectElement | null)?.value ?? "";
  const relevanceVal =
    (document.getElementById("filterRelevance") as HTMLSelectElement | null)?.value ?? "";

  const results: EvidenceItem[] = [];
  for (const item of allEvidence) {
    let matches = true;

    if (searchTerm) {
      const haystack = (item.title + " " + item.summary + " " + item.tags.join(" ")).toLowerCase();
      if (haystack.indexOf(searchTerm) === -1) matches = false;
    }
    if (matches && typeVal && item.type.toLowerCase() !== typeVal) matches = false;
    if (matches && personVal) {
      const person = findPersonById(personVal);
      if (!person || !evidenceMentionsPerson(item, person)) matches = false;
    }
    if (matches && locationVal && item.locationIds.indexOf(locationVal) === -1) matches = false;
    if (matches && statusVal && (item.status || "").toLowerCase() !== statusVal) matches = false;
    if (matches && relevanceVal && (item.relevance || "").toLowerCase() !== relevanceVal)
      matches = false;

    if (matches) results.push(item);
  }

  setFilteredEvidence(results);
  return results;
}

export function renderEvidenceList(): void {
  const container = document.getElementById("evidenceList");
  if (!container) return;

  const loadingIndicator = document.getElementById("evidenceLoadingIndicator");
  if (evidenceViewLoading) {
    if (loadingIndicator) loadingIndicator.classList.remove("hidden");
    container.innerHTML = "";
    return;
  }
  if (loadingIndicator) loadingIndicator.classList.add("hidden");

  const results = sortResults(getFilteredEvidence());

  let html = "";
  if (results.length === 0) {
    html = "<p>No evidence matches the current filters.</p>";
  }
  for (const result of results) {
    html += renderEvidenceCardHTML(result);
  }
  container.innerHTML = html;

  // Event delegation for card clicks / bookmark button.
  container.addEventListener("click", handleEvidenceListClick);
}

function renderEvidenceCardHTML(ev: EvidenceItem): string {
  const isBookmarked = bookmarks.indexOf(ev.id) !== -1;
  let html = '<div class="evidence-card" data-id="' + ev.id + '">';
  html +=
    '<button class="bookmark-btn ' +
    (isBookmarked ? "active" : "") +
    '" data-action="bookmark" data-id="' +
    ev.id +
    '" aria-label="Toggle bookmark for ' +
    ev.title +
    '"><span class="bookmark-icon">' +
    (isBookmarked ? "★" : "☆") +
    "</span></button>";
  html += "<h3>" + ev.title + "</h3>";
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div>";
  html += '<div class="evidence-summary">' + ev.summary + "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html += '<span class="badge badge-critical">Critical</span>';
  }
  html += '<span class="badge ' + getStatusBadgeClass(ev.status) + '">' + ev.status + "</span>";
  html +=
    '<span class="badge ' + getRelevanceBadgeClass(ev.relevance) + '">' + ev.relevance + "</span>";
  html += "<div>";
  for (const tag of ev.tags) {
    html += '<span class="tag-chip">' + tag + "</span>";
  }
  html += "</div>";
  html += "</div>";
  return html;
}

function handleEvidenceListClick(event: Event): void {
  const target = event.target as HTMLElement;

  if (target.dataset && target.dataset.action === "bookmark") {
    event.stopPropagation();
    const id = target.dataset.id;
    if (id) handleBookmarkClick(id);
    return;
  }

  const card = target.closest(".evidence-card");
  if (card) {
    const id = card.getAttribute("data-id");
    if (id) openEvidenceDetail(id);
  }
}

function handleBookmarkClick(evidenceId: string): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  if (bookmarks.indexOf(evidenceId) === -1) {
    bookmarks.push(evidenceId);
    ev.bookmarked = true;
  } else {
    setBookmarks(bookmarks.filter((id) => id !== evidenceId));
    ev.bookmarked = false;
  }
  saveBookmarksToStorage();
  if (currentPage === "evidence") renderEvidenceList();
}

export function applyStoredBookmarkFlags(): void {
  for (const ev of allEvidence) {
    ev.bookmarked = bookmarks.indexOf(ev.id) !== -1;
  }
}

export function sortResults(items: EvidenceItem[]): EvidenceItem[] {
  const sortSelect = document.getElementById("sortEvidence") as HTMLSelectElement | null;
  const sortValue = sortSelect ? sortSelect.value : "";

  if (sortValue === "title-asc") {
    items.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "title-desc") {
    items.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortValue === "date-asc") {
    // .getTime(): Date objects cannot be subtracted directly in TypeScript
    items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  } else {
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  return items;
}

export function handleSortChange(): void {
  renderEvidenceList();
}

export function clearFilters(): void {
  const ids = [
    "evidenceSearch",
    "filterType",
    "filterPerson",
    "filterLocation",
    "filterStatus",
    "filterRelevance",
  ];
  for (const id of ids) {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
    if (el) el.value = "";
  }
  renderEvidenceList();
}

function simulateAsyncSearch(term: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(term), 300);
  });
}

let latestSearchRequestId = 0;

export function handleSearchInput(event: Event): void {
  const term = (event.target as HTMLInputElement).value;
  const requestId = ++latestSearchRequestId;

  void simulateAsyncSearch(term).then(() => {
    // Only apply this response if nothing newer has been typed meanwhile.
    if (requestId !== latestSearchRequestId) return;
    renderEvidenceList();
  });
}
