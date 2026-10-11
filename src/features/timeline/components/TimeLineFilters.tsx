import type { ReactElement } from "react";
import type { CaseLocation, Person } from "../../../types.js";

type TimeLineFiltersProps = {
  people: Person[];
  locations: CaseLocation[];
  eventTypes: string[];
  selectedPersonId: string;
};

export function TimeLineFilters({
  people,
  locations,
  eventTypes,
  selectedPersonId,
}: TimeLineFiltersProps): ReactElement {
  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <label htmlFor="timelineOrder" className="visually-hidden">
          Order
        </label>
        <select id="timelineOrder" defaultValue="asc">
          <option value="asc">Oldest first</option>
          <option value="desc">Newest first</option>
        </select>

        <label htmlFor="timelinePersonFilter" className="visually-hidden">
          Filter by person
        </label>
        <select id="timelinePersonFilter" defaultValue={selectedPersonId}>
          <option value="">All people</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>

        <label htmlFor="timelineLocationFilter" className="visually-hidden">
          Filter by location
        </label>
        <select id="timelineLocationFilter" defaultValue="">
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.id}
            </option>
          ))}
        </select>

        <label htmlFor="timelineTypeFilter" className="visually-hidden">
          Filter by event type
        </label>
        <select id="timelineTypeFilter" defaultValue="">
          <option value="">All event types</option>
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
