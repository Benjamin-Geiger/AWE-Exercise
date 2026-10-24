import type { EvidenceItem } from "../../types.js";

export const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "title-asc", label: "Title (A–Z)" },
  { value: "title-desc", label: "Title (Z–A)" },
] as const;

export type SortOrder = (typeof SORT_OPTIONS)[number]["value"];

export interface EvidenceFilters {
  search: string;
  type: string;
  personId: string;
  locationId: string;
  status: string;
  relevance: string;
  sort: SortOrder;
}

export const EMPTY_FILTERS: EvidenceFilters = {
  search: "",
  type: "",
  personId: "",
  locationId: "",
  status: "",
  relevance: "",
  sort: "date-desc",
};

// select values arrive as plain strings
export function toSortOrder(value: string): SortOrder {
  return SORT_OPTIONS.find((option) => option.value === value)?.value ?? "date-desc";
}

// every field except sort order is plain string filter
export type FilterKey = Exclude<keyof EvidenceFilters, "sort">;

export type FiltersAction =
  | { type: "SET_FILTER"; key: FilterKey; value: string }
  | { type: "SET_SORT"; sort: SortOrder }
  | { type: "CLEAR_FILTERS" };

// every allowed change to the filters in place -> always returns a new object
export function filtersReducer(state: EvidenceFilters, action: FiltersAction): EvidenceFilters {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, [action.key]: action.value };
    case "SET_SORT":
      return { ...state, sort: action.sort };
    case "CLEAR_FILTERS":
      return { ...EMPTY_FILTERS, sort: state.sort };
  }
}

function matches(ev: EvidenceItem, filters: EvidenceFilters, term: string): boolean {
  const haystack = `${ev.title} ${ev.summary} ${ev.tags.join(" ")}`.toLowerCase();
  if (term && !haystack.includes(term)) return false;
  if (filters.type && ev.type.toLowerCase() !== filters.type) return false;
  if (filters.personId && !ev.personIds.includes(filters.personId)) return false;
  if (filters.locationId && !ev.locationIds.includes(filters.locationId)) return false;
  if (filters.status && ev.status !== filters.status) return false;
  if (filters.relevance && ev.relevance !== filters.relevance) return false;
  return true;
}

function time(ev: EvidenceItem): number {
  return new Date(ev.timestamp).getTime();
}

function compare(a: EvidenceItem, b: EvidenceItem, sort: SortOrder): number {
  switch (sort) {
    case "date-desc":
      return time(b) - time(a);
    case "date-asc":
      return time(a) - time(b);
    case "title-asc":
      return a.title.localeCompare(b.title);
    case "title-desc":
      return b.title.localeCompare(a.title);
  }
}

export function selectVisibleEvidence(
  evidence: readonly EvidenceItem[],
  filters: EvidenceFilters,
): EvidenceItem[] {
  const term = filters.search.toLowerCase().trim();
  return evidence
    .filter((ev) => matches(ev, filters, term))
    .sort((a, b) => compare(a, b, filters.sort));
}
