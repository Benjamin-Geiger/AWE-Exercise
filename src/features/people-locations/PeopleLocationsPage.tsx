import type { ReactElement } from "react";
import type { CaseDataset } from "../../app/useCaseData.js";
import { LocationCard } from "./components/LocationCard.js";
import { PersonCard } from "./components/PersonCard.js";

interface PeopleLocationsPageProps {
  data: CaseDataset;
}

export function PeopleLocationsPage({ data }: PeopleLocationsPageProps): ReactElement {
  const { people, locations, evidence } = data;

  return (
    <section>
      <h2>People &amp; Locations</h2>
      <h3>People</h3>
      <div className="people-grid">
        {people.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            evidenceCount={evidence.filter((ev) => ev.personIds.includes(person.id)).length}
          />
        ))}
      </div>
      <h3>Locations</h3>
      <div className="locations-grid">
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </section>
  );
}
