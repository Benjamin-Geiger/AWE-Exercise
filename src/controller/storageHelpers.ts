// ---------------------------------------------------------------------
// LOCAL STORAGE HELPERS (bookmarks & notes)
// ---------------------------------------------------------------------
import {
  STORAGE_KEY_BOOKMARKS,
  STORAGE_KEY_NOTES,
  bookmarks,
  notesStore,
  setBookmarks,
  setNotesStore,
} from "./state.js";

// notesStore is {} in state.js -> indexing it from ts file needs a shape
type NoteMap = Record<string, string>;

export function saveBookmarksToStorage(): void {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
}

export function loadBookmarksFromStorage(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    // JSON.parse returns any -> pin it to unknown
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    setBookmarks(Array.isArray(parsed) ? parsed : []);
  } catch (err) {
    console.warn("Could not read stored bookmarks, starting empty", err);
    setBookmarks([]);
  }
}

export function saveNoteForEvidence(evidenceId: string, text: string): void {
  (notesStore as NoteMap)[evidenceId] = text;
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notesStore));
}

export function loadNoteForEvidence(evidenceId: string): string {
  return (notesStore as NoteMap)[evidenceId] || "";
}

export function loadNotesFromStorage(): void {
  const raw = localStorage.getItem(STORAGE_KEY_NOTES);
  if (!raw) {
    setNotesStore({});
    return;
  }

  const parsed: unknown = JSON.parse(raw);
  setNotesStore(parsed as NoteMap);
}

export function loadNoteAsync(evidenceId: string): Promise<string> {
  return new Promise((resolve) => resolve((notesStore as NoteMap)[evidenceId] || ""));
}
