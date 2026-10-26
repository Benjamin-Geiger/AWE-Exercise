# Demo 9

## Duplicated state --> Investigator Notes

EvidencePage.tsx:22 --> Can read/write notes
WorkspacePage.tsx:18 --> only read

Both hold their own copy of the notes, they are only linked by localStorage.

It only works because the router unmounts one page before mounting the other. If both were ever on screen together, Workspace would show old notes.

### Issue

issue: two components each kept their own copy of the notes, filled from localStorage

EvidencePage had useState(readNotes). It updated that copy and wrote to localStorage on save.
WorkspacePage had a second useState(readNotes), read once when it mounted.

localStorage was the only thing keeping the two copies in sync. They only matched because the router never shows both pages at once.

Both views on screen at once. For example, a notes sidebar next to the Evidence view, or a nested route. Workspace would keep showing the notes it read at mount and never update

### Fix

Moved notes state and handleSaveNote up into AppRoutes in App.tsx. That's the lowest component above both pages, and it stays mounted across navigation.

EvidencePage now receives notes and onSaveNote as props
WorkspacePage now receives notes as a prop

localStorage is now only read once at startup and written on each save. Both pages render from the same React value, so they can't disagree.


## Unnecessary global state --> scope of BookmarkProvider

App.tsx:23-37: the provider wraps every route but only the Dashboard, Evidence and Workspace pages use it

The three Pages are all one level below AppRoutes, so plain props would reach them with no drilling at all.

### Issue

The issue: BookmarkProvider wrapped every route, including People & Locations and Timeline, which never use bookmarks. The three pages that do use them sit directly under AppRoutes, so Context wasn't saving any prop drilling.

Every component calling useBookmarks() had a hidden dependency that its props didn't show.
Any of them would throw if rendered without the provider.
Bookmarks looked "global" when they actually belong to one owner and three readers.

### Fix

Moved the bookmark useState, the immutable toggleBookmark helper and the dev-mode new-array check (your Demo 3 code) unchanged from BookmarkContext.tsx into AppRoutes.

DashboardPage now gets bookmarks as a prop. EvidencePage gets bookmarks and onToggleBookmark. WorkspacePage gets bookmarks.

Team and Timeline get nothing bookmark-related.

### Sonstiges

Why not just make the provider's scope smaller: react-router can only wrap a subset of routes with a layout route. That layout route unmounts when you go to Team or Timeline. Bookmarks would then be thrown away and re-read from localStorage on return, which is the same weakness Fix 1 removes.


What would trigger it: honestly, nothing the user would see. This is a design flaw, not a runtime bug. It becomes a real cost when the code changes: someone uses useBookmarks somewhere new without noticing the dependency, or a page gets reused outside the provider.

## Q1

### Notes -> duplicated state

Neither issue showed up as a visible bug in normal use -> both found by a code-review

""
Review method -> §17.9: "What is the smallest source of truth? Which component owns it?" Went through every useState / useReducer / useContext call in the Evidence, Workspace and Dashboard code and asked, for each one, who else holds the same fact.
""

- Noticed: the same "useState(readNotes)" line showed up in two components. Two owners for one fact.

### BookmarkProvider -> unnecessary global state

- Noticed: compared where the provider sits (around all routes) with who calls useBookmarks (3 pages, all one level below AppRoutes). The provider spanned more of the tree than its consumers needed, and the "drilling" it avoided was zero levels.

No runtime symptom -> just architectural

Duplicated state -> the Exercise 1 bugs are mostly the same fact stored in more than one place, kept in sync by hand.

- Bookmarks stored twice: the bookmarks id array AND an ev.bookmarked flag on each evidence object (evidence-catalogue.ts:187-201). handleBookmarkClick had to update both, and applyStoredBookmarkFlags existed only to copy one into the other. Every new code path is a chance to forget one of them.
- allEvidence vs filteredEvidence (Ex1 Demo 2): the filtered list was stored as its own variable instead of derived. Because it was literally the same array, sorting it reordered the master list -> the Workspace evidence select changed order. Mutation was the mechanism, but the root cause is a second stored copy of derivable data. Matches Table 17.1 "two views disagree about the same fact".
- Sort didn't work (Ex1 Demo 5 Bug 2): sort wrote into filteredEvidence, then renderEvidenceList rebuilt it from allEvidence and overwrote the result. Two code paths writing the same duplicated value -> the last write won.
- Stale dashboard count (Ex1 Demo 5 Bug 1, viewRendered): the rendered DOM was a stored copy of "number of bookmarks", only refreshed on first visit. Matches Table 17.1 "filtered list or count becomes stale".

Stale state and mutation were the symptoms, duplicated state the cause -> once a fact exists twice, one copy will eventually go stale or get changed behind the other's back.

React version: one owner per fact (bookmarks + notes in AppRoutes, evidence in useCaseData). Everything else (visibleEvidence, bookmarkedItems, bookmarks.length) is derived during render -> no second copy left to drift. The notes fix in this demo was the last remaining instance of exactly that Exercise 1 pattern.
