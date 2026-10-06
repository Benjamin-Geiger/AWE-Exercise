import type { ReactElement } from "react";
import { VIEWS } from "./routes.js";
import type { ViewName } from "./routes.js";
import { navigateTo } from "./useHashRoute.js";

interface AppHeaderProps {
  currentView: ViewName;
}

export function AppHeader({ currentView }: AppHeaderProps): ReactElement {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand">
          <img
            src={`${import.meta.env.BASE_URL}assets/logo/logo.svg`}
            alt="Project ReMotion logo"
            className="brand-logo"
          />
          <div>
            <h1>Project ReMotion</h1>
            <p className="subtitle">
              Investigate the failure of an AI-assisted rehabilitation robot.
            </p>
          </div>
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          {VIEWS.map((view) => (
            <button
              key={view.id}
              type="button"
              className={view.id === currentView ? "nav-btn active" : "nav-btn"}
              aria-current={view.id === currentView ? "page" : undefined}
              onClick={() => navigateTo(view.id)}
            >
              {view.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
