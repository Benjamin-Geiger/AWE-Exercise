import type { ReactElement } from "react";
import type { Person } from "../../../types.js";

type PersonCardProps = {
  person: Person;
  evidenceCount: number;
};

export function PersonCard({ person, evidenceCount }: PersonCardProps): ReactElement {
  return (
    <div className="person-card">
      <div className="person-card-header">
        {/* avatar path is relative -> prefix with base */}
        <img
          className="person-avatar"
          src={`${import.meta.env.BASE_URL}${person.avatar}`}
          alt={`Portrait of ${person.name}`}
        />
        <div>
          <h3>{person.name}</h3>
          <div className="person-role">{person.role}</div>
        </div>
      </div>
      <p>
        <strong>Speciality:</strong> {person.speciality}
      </p>
      <ul>
        {/* static strings without ids, never reordered or filtered, so index is a safe key */}
        {person.responsibilities.map((responsibility, index) => (
          <li key={index}>{responsibility}</li>
        ))}
      </ul>
      <div className="person-statement">&ldquo;{person.statement}&rdquo;</div>
      <p>
        {evidenceCount} related evidence item{evidenceCount !== 1 ? "s" : ""} &mdash;{" "}
        <button type="button" className="evidence-count-link">
          view
        </button>
      </p>
    </div>
  );
}
