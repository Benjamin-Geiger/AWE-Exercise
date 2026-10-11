import type { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AppHeader } from "./AppHeader.js";
import { LoadingOverlay } from "./LoadingOverlay.js";
import { PlaceholderPage } from "./PlaceholderPage.js";
import { useCaseData } from "./useCaseData.js";
import type { CaseDataset } from "../types.js";
import { ROUTER_BASENAME } from "./routes.js";
import { DashboardPage } from "../features/dashboard/DashboardPage.js";
import { PeopleLocationsPage } from "../features/people-locations/PeopleLocationsPage.js";
import { TimeLinePage } from "../features/timeline/TimeLinePage.js";

interface AppRoutesProps {
  data: CaseDataset;
}

function AppRoutes({ data }: AppRoutesProps): ReactElement {
  return (
    <Routes>
      <Route index element={<DashboardPage data={data} />} />
      <Route path="evidence" element={<PlaceholderPage title="Evidence Catalogue" />} />
      <Route path="people" element={<PeopleLocationsPage data={data} />} />
      <Route path="timeline" element={<TimeLinePage data={data} />} />
      <Route path="workspace" element={<PlaceholderPage title="Investigator Workspace" />} />
      {/* unknown url -> dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App(): ReactElement {
  // loaded  here to survives navigation
  const caseState = useCaseData();

  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      {caseState.status === "loading" && <LoadingOverlay />}
      <AppHeader />
      <main className="app-main">
        {caseState.status === "error" && (
          <p role="alert">The case file could not be loaded: {caseState.message}</p>
        )}
        {caseState.status === "ready" && <AppRoutes data={caseState.data} />}
      </main>
      <footer className="app-footer">
        <p>Project ReMotion Investigation Portal</p>
      </footer>
    </BrowserRouter>
  );
}
