import type { ReactElement } from "react";
import { Badge, type BadgeTone } from "../../../shared/components/Badge.js";
import { formatDate } from "../../../shared/format/dates.js";
import type { Certainty, TimelineEvent } from "../../../types.js";

// replaces the vanilla certaintyBadgeClass() if-chain
const CERTAINTY_TONE: Record<Certainty, BadgeTone> = {
  confirmed: "positive",
  reported: "warning",
  contradictory: "critical",
};

type TimeLineEventCardProps = {
  event: TimelineEvent;
  locationNames: string[];
};

export function TimeLineEventCard({ event, locationNames }: TimeLineEventCardProps): ReactElement {
  return (
    <div className={`timeline-event certainty-${event.certainty}`}>
      <div className="timeline-time">
        {formatDate(event.time)}&nbsp;&middot;&nbsp;
        <Badge label={event.certainty} tone={CERTAINTY_TONE[event.certainty]} />
      </div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      {locationNames.length > 0 && (
        <p className="evidence-meta">Location: {locationNames.join(", ")}</p>
      )}
      {event.evidenceIds.map((evidenceId) => (
        <button key={evidenceId} type="button" className="evidence-link-btn">
          View {evidenceId}
        </button>
      ))}
    </div>
  );
}
