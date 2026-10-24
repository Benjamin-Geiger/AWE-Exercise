import type { ReactElement } from "react";
import type { CaseLocation, Person } from "../../../types.js";
import { SORT_OPTIONS, toSortOrder, type EvidenceFilters } from "../evidenceFilters.js";

interface EvidenceToolbarProps {
  evidenceTypes: string[];
  people: Person[];
  locations: CaseLocation[];
  filters: EvidenceFilters;
  onFilterChange: <K extends keyof EvidenceFilters>(key: K, value: EvidenceFilters[K]) => void;
  onClear: () => void;
}

export function EvidenceToolbar({
  evidenceTypes,
  people,
  locations,
  filters,
  onFilterChange,
  onClear,
}: EvidenceToolbarProps): ReactElement {
  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <label htmlFor="evidenceSearch" className="visually-hidden">
          Search evidence
        </label>
        <input
          type="text"
          id="evidenceSearch"
          placeholder="Search evidence by title, summary, or tag…"
          autoComplete="off"
          value={filters.search}
          onChange={(event) => onFilterChange("search", event.target.value)}
        />

        <label htmlFor="filterType" className="visually-hidden">
          Filter by type
        </label>
        <select
          id="filterType"
          value={filters.type}
          onChange={(event) => onFilterChange("type", event.target.value)}
        >
          <option value="">All types</option>
          {evidenceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label htmlFor="filterPerson" className="visually-hidden">
          Filter by person
        </label>
        <select
          id="filterPerson"
          value={filters.personId}
          onChange={(event) => onFilterChange("personId", event.target.value)}
        >
          <option value="">All people</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>

        <label htmlFor="filterLocation" className="visually-hidden">
          Filter by location
        </label>
        <select
          id="filterLocation"
          value={filters.locationId}
          onChange={(event) => onFilterChange("locationId", event.target.value)}
        >
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.id} - {location.name}
            </option>
          ))}
        </select>
      </div>
      <div className="toolbar-row">
        <label htmlFor="filterStatus" className="visually-hidden">
          Filter by status
        </label>
        <select
          id="filterStatus"
          value={filters.status}
          onChange={(event) => onFilterChange("status", event.target.value)}
        >
          <option value="">All statuses</option>
          <option value="unreviewed">Unreviewed</option>
          <option value="reviewed">Reviewed</option>
          <option value="flagged">Flagged</option>
        </select>

        <label htmlFor="filterRelevance" className="visually-hidden">
          Filter by relevance
        </label>
        <select
          id="filterRelevance"
          value={filters.relevance}
          onChange={(event) => onFilterChange("relevance", event.target.value)}
        >
          <option value="">All relevance</option>
          <option value="unknown">Unknown</option>
          <option value="relevant">Relevant</option>
          <option value="irrelevant">Irrelevant</option>
        </select>

        <label htmlFor="sortEvidence" className="visually-hidden">
          Sort evidence
        </label>
        <select
          id="sortEvidence"
          value={filters.sort}
          onChange={(event) => onFilterChange("sort", toSortOrder(event.target.value))}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button type="button" className="btn btn-secondary" onClick={onClear}>
          Clear filters
        </button>
      </div>
    </div>
  );
}
