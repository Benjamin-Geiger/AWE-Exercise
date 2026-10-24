import type { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AppHeader } from "./AppHeader.js";
import { LoadingOverlay } from "./LoadingOverlay.js";
import { useCaseData } from "./useCaseData.js";
import { BookmarkProvider } from "../shared/BookmarkContext.js";
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

function AppRoutes({ data, onReviewChange }: AppRoutesProps): ReactElement {
  // provider sits where the bookmark state lived -> mounted once, survives navigation
  return (
    <BookmarkProvider>
      <Routes>
        <Route index element={<DashboardPage data={data} />} />
        <Route
          path="evidence"
          element={<EvidencePage data={data} onReviewChange={onReviewChange} />}
        />
        {/* team/* -> page defines its own tab routes */}
        <Route path="team/*" element={<PeopleLocationsPage data={data} />} />
        <Route path="timeline" element={<TimeLinePage data={data} />} />
        <Route path="workspace" element={<WorkspacePage data={data} />} />
        {/* unknown url -> dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BookmarkProvider>
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
