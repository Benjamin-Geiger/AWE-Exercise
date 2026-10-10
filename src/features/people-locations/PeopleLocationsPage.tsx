import type { ReactElement } from "react";
import type { CaseDataset } from "../../app/useCaseData.js";
import { PersonCard } from "./components/PersonCard.js";

interface PeopleLocationsPageProps {
  data: CaseDataset;
}

export function PeopleLocationsPage({ data }: PeopleLocationsPageProps): ReactElement {
  const { people, evidence } = data;

  return (
    <section>
      <h2>People &amp; Locations</h2>
      {people.map((person) => (
        <PersonCard
          key={person.id}
          person={person}
          evidenceCount={evidence.filter((ev) => ev.personIds.includes(person.id)).length}
        />
      ))}
    </section>
  );
}
