import type { ReactElement, ReactNode } from "react";

interface PanelProps {
  title: string;
  children: ReactNode;
}

// the panel owns the frame and heading, the caller supplies the content
export function Panel({ title, children }: PanelProps): ReactElement {
  return (
    <div className="dashboard-panel">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
