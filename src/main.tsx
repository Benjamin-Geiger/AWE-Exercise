import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";

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
