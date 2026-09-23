// ---------------------------------------------------------------------
// WORKSPACE
// ---------------------------------------------------------------------
import { navigateTo } from "../controller/navigation.js";
import { openEvidenceDetail } from "../controller/evidence-detail.js";
import { escapeHtml } from "../controller/lookup-utilities.js";
import { allEvidence, allPeople, notesStore, STORAGE_KEY_HYPOTHESIS } from "../controller/state.js";

// shape written to localStorage by saveHypothesis()
interface HypothesisDraft {
  suspectId: string;
  nature: string;
  evidenceIds: string[];
  confidence: string;
  explanation: string;
  alternative: string;
  savedAt: string;
}

export function renderWorkspace(): void {
  renderBookmarksList();
  renderNotesList();
  populateHypothesisDropdowns();
  loadHypothesisFromStorage();
}

function renderBookmarksList(): void {
  const container = document.getElementById("bookmarksList");
  if (!container) return;

  const bookmarkedItems = allEvidence.filter((ev) => ev.bookmarked);

  if (bookmarkedItems.length === 0) {
    container.innerHTML =
      "<p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>";
    return;
  }

  let html = "";
  for (const ev of bookmarkedItems) {
    html +=
      '<div class="mini-list-item"><strong>' +
      ev.id +
      "</strong> &mdash; " +
      ev.title +
      ' <button type="button" class="btn btn-small btn-secondary" data-open-evidence="' +
      ev.id +
      '">Open</button></div>';
  }
  container.innerHTML = html;

  const openButtons = container.querySelectorAll("[data-open-evidence]");
  for (let b = 0; b < openButtons.length; b++) {
    openButtons[b]?.addEventListener("click", (e) => {
      navigateTo("evidence");
      const id = (e.target as HTMLElement).getAttribute("data-open-evidence");
      if (id) setTimeout(() => openEvidenceDetail(id), 0);
    });
  }
}

function renderNotesList(): void {
  const container = document.getElementById("notesList");
  if (!container) return;

  const noteEntries = [];
  for (let i = 0; i < allEvidence.length; i++) {
    const ev = allEvidence[i];
    if (!ev) continue;
    const note = notesStore[ev.id];
    if (note) {
      noteEntries.push({ index: i, evidenceId: ev.id, title: ev.title, text: note });
    }
  }

  if (noteEntries.length === 0) {
    container.innerHTML = "<p>No notes yet. Add one from an evidence item's detail view.</p>";
    return;
  }

  let html = "";
  for (const entry of noteEntries) {
    html +=
      '<div class="mini-list-item"><strong>' +
      entry.evidenceId +
      "</strong> &mdash; " +
      entry.title;
    html += '<div id="noteText-' + entry.index + '">' + escapeHtml(entry.text) + "</div></div>";
  }
  container.innerHTML = html;
}

export function populateHypothesisDropdowns(): void {
  const suspectSelect = document.getElementById("hypSuspect") as HTMLSelectElement | null;
  const evidenceSelect = document.getElementById("hypEvidence") as HTMLSelectElement | null;
  if (!suspectSelect || !evidenceSelect) return;

  const currentSuspect = suspectSelect.value;
  suspectSelect.innerHTML = '<option value="">Select a person…</option>';
  for (const person of allPeople) {
    suspectSelect.innerHTML += '<option value="' + person.id + '">' + person.name + "</option>";
  }
  suspectSelect.value = currentSuspect;

  evidenceSelect.innerHTML = "";
  for (const ev of allEvidence) {
    evidenceSelect.innerHTML +=
      '<option value="' + ev.id + '">' + ev.id + " - " + ev.title + "</option>";
  }
}

export function saveHypothesis(): void {
  const suspect = document.getElementById("hypSuspect") as HTMLSelectElement | null;
  const nature = document.getElementById("hypNature") as HTMLSelectElement | null;
  const evidence = document.getElementById("hypEvidence") as HTMLSelectElement | null;
  const confidence = document.getElementById("hypConfidence") as HTMLInputElement | null;
  const explanation = document.getElementById("hypExplanation") as HTMLTextAreaElement | null;
  const alternative = document.getElementById("hypAlternative") as HTMLTextAreaElement | null;
  if (!suspect || !nature || !evidence || !confidence || !explanation || !alternative) return;

  const draft: HypothesisDraft = {
    suspectId: suspect.value,
    nature: nature.value,
    evidenceIds: getSelectedOptions(evidence),
    confidence: confidence.value,
    explanation: explanation.value,
    alternative: alternative.value,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
  } catch (err) {
    console.error("Could not save hypothesis draft", err);
    alert("Your hypothesis could not be saved to local storage.");
    return;
  }

  const msg = document.getElementById("hypothesisSavedMsg");
  if (!msg) return;
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), 2000);
}

function getSelectedOptions(selectEl: HTMLSelectElement): string[] {
  const result: string[] = [];
  for (let i = 0; i < selectEl.options.length; i++) {
    const option = selectEl.options[i];
    if (option?.selected) result.push(option.value);
  }
  return result;
}

function loadHypothesisFromStorage(): void {
  const raw = localStorage.getItem(STORAGE_KEY_HYPOTHESIS);
  if (!raw) return;

  // JSON.parse returns any -> unknown at the boundary, then a documented cast
  const parsed: unknown = JSON.parse(raw);
  const draft = parsed as Partial<HypothesisDraft>;

  const suspect = document.getElementById("hypSuspect") as HTMLSelectElement | null;
  const nature = document.getElementById("hypNature") as HTMLSelectElement | null;
  const confidence = document.getElementById("hypConfidence") as HTMLInputElement | null;
  const confidenceValue = document.getElementById("hypConfidenceValue");
  const explanation = document.getElementById("hypExplanation") as HTMLTextAreaElement | null;
  const alternative = document.getElementById("hypAlternative") as HTMLTextAreaElement | null;
  const evidenceSelect = document.getElementById("hypEvidence") as HTMLSelectElement | null;

  if (suspect) suspect.value = draft.suspectId || "";
  if (nature) nature.value = draft.nature || "";
  if (confidence) confidence.value = draft.confidence || "50";
  if (confidenceValue) confidenceValue.textContent = draft.confidence || "50";
  if (explanation) explanation.value = draft.explanation || "";
  if (alternative) alternative.value = draft.alternative || "";

  if (!evidenceSelect) return;
  const savedIds = draft.evidenceIds || [];
  for (let i = 0; i < evidenceSelect.options.length; i++) {
    const option = evidenceSelect.options[i];
    if (option) option.selected = savedIds.indexOf(option.value) !== -1;
  }
}
