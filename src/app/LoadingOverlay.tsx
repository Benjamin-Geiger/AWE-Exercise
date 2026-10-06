import type { ReactElement } from "react";

export function LoadingOverlay(): ReactElement {
  return (
    <div className="loading-overlay">
      <div className="loading-box">
        <div className="spinner"></div>
        <p>Loading case file&hellip;</p>
      </div>
    </div>
  );
}
