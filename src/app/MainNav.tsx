import type { ReactElement } from "react";
import { VIEWS } from "./routes.js";
import type { ViewName } from "./routes.js";
import { navigateTo } from "./useHashRoute.js";

interface MainNavProps {
  currentView: ViewName;
}

export function MainNav({ currentView }: MainNavProps): ReactElement {
  return (
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
  );
}
