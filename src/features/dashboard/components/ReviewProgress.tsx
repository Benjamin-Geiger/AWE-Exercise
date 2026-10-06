import type { ReactElement } from "react";

interface ReviewProgressProps {
  reviewed: number;
  total: number;
}

export function ReviewProgress({ reviewed, total }: ReviewProgressProps): ReactElement {
  // derived on every render, never stored
  const percent = total === 0 ? 0 : Math.round((reviewed / total) * 100);

  return (
    <div className="dashboard-panel">
      <h3>Review progress</h3>
      <div
        className="progress-bar-outer"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Evidence reviewed"
      >
        <div className="progress-bar-inner" style={{ width: `${percent}%` }}></div>
      </div>
      <p>{percent}% of evidence reviewed</p>
    </div>
  );
}
