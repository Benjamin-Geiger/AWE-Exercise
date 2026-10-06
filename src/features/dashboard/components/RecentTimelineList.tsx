import type { ReactElement } from "react";
import { MiniListItem } from "../../../shared/components/MiniListItem.js";
import { formatDate } from "../../../shared/format/dates.js";
import type { TimelineEvent } from "../../../types.js";

interface RecentTimelineListProps {
  events: TimelineEvent[];
}

export function RecentTimelineList({ events }: RecentTimelineListProps): ReactElement {
  return (
    <div className="dashboard-panel">
      <h3>Recent timeline events</h3>
      {events.length === 0 && <p>No timeline events loaded yet.</p>}
      {events.map((evt) => (
        <MiniListItem key={evt.id}>
          <strong>{formatDate(evt.time)}</strong>
          <br />
          {evt.title}
        </MiniListItem>
      ))}
    </div>
  );
}
