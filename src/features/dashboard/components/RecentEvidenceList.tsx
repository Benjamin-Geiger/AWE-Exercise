import type { ReactElement } from "react";
import { Badge } from "../../../shared/components/Badge.js";
import type { BadgeTone } from "../../../shared/components/Badge.js";
import { MiniListItem } from "../../../shared/components/MiniListItem.js";
import type { EvidenceItem, EvidenceStatus } from "../../../types.js";

const STATUS_TONE: Record<EvidenceStatus, BadgeTone> = {
  unreviewed: "neutral",
  reviewed: "positive",
  flagged: "warning",
};

interface RecentEvidenceListProps {
  items: EvidenceItem[];
}

export function RecentEvidenceList({ items }: RecentEvidenceListProps): ReactElement {
  return (
    <div className="dashboard-panel">
      <h3>Recent evidence</h3>
      {items.length === 0 && <p>No evidence loaded yet.</p>}
      {items.map((ev) => (
        <MiniListItem key={ev.id}>
          <strong>{ev.id}</strong> &mdash; {ev.title}{" "}
          <Badge label={ev.status} tone={STATUS_TONE[ev.status]} />
        </MiniListItem>
      ))}
    </div>
  );
}
