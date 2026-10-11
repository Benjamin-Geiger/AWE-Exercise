import { Fragment, type ReactElement } from "react";
import { Link } from "react-router";
import { Badge, type BadgeTone } from "../../../shared/components/Badge.js";
import { formatDate } from "../../../shared/format/dates.js";
import type { Certainty, Person, TimelineEvent } from "../../../types.js";

const CERTAINTY_TONE: Record<Certainty, BadgeTone> = {
  confirmed: "positive",
  reported: "warning",
  contradictory: "critical",
};

type TimeLineEventCardProps = {
  event: TimelineEvent;
  locationNames: string[];
  people: Person[];
};

export function TimeLineEventCard({
  event,
  locationNames,
  people,
}: TimeLineEventCardProps): ReactElement {
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
      {people.length > 0 && (
        <p className="evidence-meta">
          People: {/* name links to person route /team/people/:personId */}
          {people.map((person, index) => (
            <Fragment key={person.id}>
              {index > 0 && ", "}
              <Link to={`/team/people/${person.id}`}>{person.name}</Link>
            </Fragment>
          ))}
        </p>
      )}
      {event.evidenceIds.map((evidenceId) => (
        <button key={evidenceId} type="button" className="evidence-link-btn">
          View {evidenceId}
        </button>
      ))}
    </div>
  );
}
