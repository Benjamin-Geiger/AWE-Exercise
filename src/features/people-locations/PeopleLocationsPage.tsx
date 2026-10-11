import type { ReactElement } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router";
import type { CaseDataset } from "../../types.js";
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
      {/* url decides which list is shown */}
      <div className="tab-bar">
        <NavLink to="/team/people" className="tab-btn">
          People
        </NavLink>
        <NavLink to="/team/locations" className="tab-btn">
          Locations
        </NavLink>
      </div>
      <Routes>
        <Route
          path="people"
          element={
            <div className="people-grid">
              {people.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  evidenceCount={evidence.filter((ev) => ev.personIds.includes(person.id)).length}
                />
              ))}
            </div>
          }
        />
        <Route
          path="locations"
          element={
            <div className="locations-grid">
              {locations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          }
        />
        {/* /team and unknown tabs -> people */}
        <Route path="*" element={<Navigate to="/team/people" replace />} />
      </Routes>
    </section>
  );
}
