import type { ReactElement } from "react";

interface StatCardProps {
  value: number;
  label: string;
}

export function StatCard({ value, label }: StatCardProps): ReactElement {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
