import type { ReactElement } from "react";
import { AppHeader } from "./AppHeader.js";
import { PlaceholderPage } from "./PlaceholderPage.js";
import { useHashRoute } from "./useHashRoute.js";
import type { ViewName } from "./routes.js";
import { DashboardPage } from "../features/dashboard/DashboardPage.js";

function renderPage(view: ViewName): ReactElement {
  switch (view) {
    case "dashboard":
      return <DashboardPage />;
    case "evidence":
      return <PlaceholderPage title="Evidence Catalogue" view={view} />;
    case "people":
      return <PlaceholderPage title="People & Locations" view={view} />;
    case "timeline":
      return <PlaceholderPage title="Investigation Timeline" view={view} />;
    case "workspace":
      return <PlaceholderPage title="Investigator Workspace" view={view} />;
  }
}

export function App(): ReactElement {
  const currentView = useHashRoute();

  return (
    <>
      <AppHeader currentView={currentView} />
      <main className="app-main">{renderPage(currentView)}</main>
      <footer className="app-footer">
        <p>
          Project ReMotion Investigation Portal &mdash; Research Center AI, Software and IT-Security
          of HCW (fictional case study)
        </p>
      </footer>
    </>
  );
}
