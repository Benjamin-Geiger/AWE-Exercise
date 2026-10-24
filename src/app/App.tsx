import { useState, type ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AppHeader } from "./AppHeader.js";
import { LoadingOverlay } from "./LoadingOverlay.js";
import { useCaseData } from "./useCaseData.js";
import { readBookmarks, saveBookmarks } from "../shared/storage.js";
import type { CaseDataset, EvidenceId, EvidenceReview } from "../types.js";
import { ROUTER_BASENAME } from "./routes.js";
import { DashboardPage } from "../features/dashboard/DashboardPage.js";
import { EvidencePage } from "../features/evidence/EvidencePage.js";
import { PeopleLocationsPage } from "../features/people-locations/PeopleLocationsPage.js";
import { TimeLinePage } from "../features/timeline/TimeLinePage.js";
import { WorkspacePage } from "../features/workspace/WorkspacePage.js";

interface AppRoutesProps {
  data: CaseDataset;
  onReviewChange: (id: EvidenceId, review: EvidenceReview) => void;
}

// returns new array on add and remove
// vanilla version did -> bookmarks.push(id) + ev.bookmarked = true)
function toggleBookmark(ids: readonly EvidenceId[], id: EvidenceId): readonly EvidenceId[] {
  return ids.includes(id) ? ids.filter((b) => b !== id) : [...ids, id];
}

function AppRoutes({ data, onReviewChange }: AppRoutesProps): ReactElement {
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
    <Routes>
      <Route index element={<DashboardPage data={data} bookmarks={bookmarks} />} />
      <Route
        path="evidence"
        element={
          <EvidencePage
            data={data}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onReviewChange={onReviewChange}
          />
        }
      />
      {/* team/* -> page defines its own tab routes */}
      <Route path="team/*" element={<PeopleLocationsPage data={data} />} />
      <Route path="timeline" element={<TimeLinePage data={data} />} />
      <Route path="workspace" element={<WorkspacePage data={data} bookmarks={bookmarks} />} />
      {/* unknown url -> dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App(): ReactElement {
  // loaded  here to survives navigation
  const [caseState, updateEvidenceReview] = useCaseData();

  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      {caseState.status === "loading" && <LoadingOverlay />}
      <AppHeader />
      <main className="app-main">
        {caseState.status === "error" && (
          <p role="alert">The case file could not be loaded: {caseState.message}</p>
        )}
        {caseState.status === "ready" && (
          <AppRoutes data={caseState.data} onReviewChange={updateEvidenceReview} />
        )}
      </main>
      <footer className="app-footer">
        <p>Project ReMotion Investigation Portal</p>
      </footer>
    </BrowserRouter>
  );
}
