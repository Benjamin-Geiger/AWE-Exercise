import type { ReactElement } from "react";
import { AppHeader } from "./AppHeader.js";
import { LoadingOverlay } from "./LoadingOverlay.js";
import { PlaceholderPage } from "./PlaceholderPage.js";
import { useCaseData } from "./useCaseData.js";
import type { CaseDataset } from "./useCaseData.js";
import { useHashRoute } from "./useHashRoute.js";
import type { ViewName } from "./routes.js";
import { DashboardPage } from "../features/dashboard/DashboardPage.js";

function renderPage(view: ViewName, data: CaseDataset): ReactElement {
  switch (view) {
    case "dashboard":
      return <DashboardPage data={data} />;
    case "evidence":
      return <PlaceholderPage title="Evidence Catalogue" />;
    case "people":
      return <PlaceholderPage title="People & Locations" />;
    case "timeline":
      return <PlaceholderPage title="Investigation Timeline" />;
    case "workspace":
      return <PlaceholderPage title="Investigator Workspace" />;
  }
}

export function App(): ReactElement {
  const currentView = useHashRoute();
  // loaded  here to survives navigation
  const caseState = useCaseData();

  return (
    <>
      {caseState.status === "loading" && <LoadingOverlay />}
      <AppHeader currentView={currentView} />
      <main className="app-main">
        {caseState.status === "error" && (
          <p role="alert">The case file could not be loaded: {caseState.message}</p>
        )}
        {caseState.status === "ready" && renderPage(currentView, caseState.data)}
      </main>
      <footer className="app-footer">
        <p>Project ReMotion Investigation Portal</p>
      </footer>
    </>
  );
}
