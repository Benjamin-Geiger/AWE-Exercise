import type { ReactElement } from "react";
import { useParams } from "react-router";
import type { EvidenceItem, Person } from "../../types.js";
import { PersonCard } from "./components/PersonCard.js";

interface PersonDetailPageProps {
  people: Person[];
  evidence: EvidenceItem[];
}

export function PersonDetailPage({ people, evidence }: PersonDetailPageProps): ReactElement {
  // url text, may be missing or name no real person
  const { personId } = useParams<{ personId: string }>();
  const person = people.find((p) => p.id === personId);

  if (!person) {
    return <p>Person not found.</p>;
  }

  return (
    <div className="people-grid">
      <PersonCard
        person={person}
        evidenceCount={evidence.filter((ev) => ev.personIds.includes(person.id)).length}
      />
    </div>
  );
}
