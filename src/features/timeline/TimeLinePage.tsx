import type { ReactElement } from "react";
import { useSearchParams } from "react-router";
import type { CaseDataset } from "../../types.js";
import { TimeLineFilters } from "./components/TimeLineFilters.js";
import { TimeLineList } from "./components/TimeLineList.js";

interface TimeLinePageProps {
  data: CaseDataset;
}

export function TimeLinePage({ data }: TimeLinePageProps): ReactElement {
  const { timeline, locations, people } = data;

  // ?person=<id> decides the initial list; unknown ids are ignored -> all events
  const [searchParams] = useSearchParams();
  const selectedPerson = people.find((p) => p.id === searchParams.get("person"));

  const sortedEvents = [...timeline].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  );
  const visibleEvents = selectedPerson
    ? sortedEvents.filter((event) => event.personIds.includes(selectedPerson.id))
    : sortedEvents;

  const eventTypes = [...new Set(timeline.map((event) => event.type))];
  const selectedPersonId = selectedPerson?.id ?? "";

  return (
    <section>
      <h2>Investigation Timeline</h2>
      {/* key: remount when the url person changes, defaultValue only applies on mount */}
      <TimeLineFilters
        key={selectedPersonId}
        people={people}
        locations={locations}
        eventTypes={eventTypes}
        selectedPersonId={selectedPersonId}
      />
      <TimeLineList events={visibleEvents} locations={locations} people={people} />
    </section>
  );
}
