import { createContext, useContext, useState, type ReactElement, type ReactNode } from "react";
import { readBookmarks, saveBookmarks } from "./storage.js";
import type { EvidenceId } from "../types.js";

interface BookmarkContextValue {
  bookmarks: readonly EvidenceId[];
  toggleBookmark: (id: EvidenceId) => void;
}

// null default: a consumer outside the provider is a bug, not "no bookmarks"
const BookmarkContext = createContext<BookmarkContextValue | null>(null);

// returns new array on add and remove
// vanilla version did -> bookmarks.push(id) + ev.bookmarked = true)
function toggleBookmark(ids: readonly EvidenceId[], id: EvidenceId): readonly EvidenceId[] {
  return ids.includes(id) ? ids.filter((b) => b !== id) : [...ids, id];
}

// the provider still owns the state; context only distributes it
export function BookmarkProvider({ children }: { children: ReactNode }): ReactElement {
  // single source of truth for bookmarks
  const [bookmarks, setBookmarks] = useState<readonly EvidenceId[]>(readBookmarks);

  function handleToggleBookmark(id: EvidenceId): void {
    const next = toggleBookmark(bookmarks, id);
    // React stops render if it gets same array -> star wouldnt update
    if (import.meta.env.DEV) {
      console.assert(next !== bookmarks, "toggleBookmark must return new array");
    }
    setBookmarks(next);
    saveBookmarks(next);
  }

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark: handleToggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks(): BookmarkContextValue {
  const value = useContext(BookmarkContext);
  if (!value) throw new Error("useBookmarks requires BookmarkProvider");
  return value;
}
