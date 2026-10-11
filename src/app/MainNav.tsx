import type { ReactElement } from "react";
import { NavLink } from "react-router";
import { VIEWS } from "./routes.js";

export function MainNav(): ReactElement {
  return (
    <nav className="main-nav" aria-label="Main navigation">
      {VIEWS.map((view) => (
        <NavLink key={view.path} to={view.path} end={view.path === "/"} className="nav-btn">
          {view.label}
        </NavLink>
      ))}
    </nav>
  );
}
