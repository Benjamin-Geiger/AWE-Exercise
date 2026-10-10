import type { ReactElement } from "react";
import type { CaseLocation, TimelineEvent } from "../../../types.js";
import { TimeLineEventCard } from "./TimeLineEventCard.js";

type TimeLineListProps = {
  events: TimelineEvent[];
  locations: CaseLocation[];
};

function locationNamesFor(event: TimelineEvent, locations: CaseLocation[]): string[] {
  return event.locationIds.map((id) => {
    const loc = locations.find((l) => l.id === id);
    return loc ? `${loc.id} - ${loc.name}` : id;
  });
}

export function TimeLineList({ events, locations }: TimeLineListProps): ReactElement {
  if (events.length === 0) {
    return <p>No timeline events match the current filters.</p>;
  }

  return (
    <div className="timeline-container">
      {events.map((event) => (
        <TimeLineEventCard
          key={event.id}
          event={event}
          locationNames={locationNamesFor(event, locations)}
        />
      ))}
    </div>
  );
}
