// ---------------------------------------------------------------------
// LOCAL STORAGE HELPERS (bookmarks & notes)
// ---------------------------------------------------------------------

export function saveBookmarksToStorage() {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
}

export function loadBookmarksFromStorage() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    var parsed = raw ? JSON.parse(raw) : [];
    bookmarks = Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Could not read stored bookmarks, starting empty", err);
    bookmarks = [];
  }
}

export function saveNoteForEvidence(evidenceId, text) {
  notesStore[evidenceId] = text;
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notesStore));
}

export function loadNoteForEvidence(evidenceId) {
  return notesStore[evidenceId] || "";
}

export function loadNotesFromStorage() {
  var raw = localStorage.getItem(STORAGE_KEY_NOTES);
  if (!raw) {
    notesStore = {};
    return;
  }

  notesStore = JSON.parse(raw);
}

export function loadNoteAsync(evidenceId) {
  return new Promise(function (resolve) {
    resolve(notesStore[evidenceId] || "");
  });
}