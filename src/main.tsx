import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App.js";
import { ROUTER_BASENAME } from "./app/routes.js";

// base/react is react app entry point
if (window.location.pathname.endsWith("/react.html")) {
  window.history.replaceState(null, "", `${ROUTER_BASENAME}/${window.location.hash.slice(1)}`);
}

const container = document.getElementById("root");

// explicit mount point check
if (!container) {
  throw new Error("Missing #root mount point");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
