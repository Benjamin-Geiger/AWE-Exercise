import { useEffect, useState } from "react";
import { toEvidenceList } from "../shared/normalize.js";
import { STORAGE_KEY_BOOKMARKS } from "../shared/storageKeys.js";
import type {
  CaseData,
  CaseLocation,
  EvidenceId,
  EvidenceItem,
  Person,
  TimelineEvent,
} from "../types.js";

// data for the pages
export interface CaseDataset {
  caseData: CaseData;
  people: Person[];
  locations: CaseLocation[];
  evidence: EvidenceItem[];
  timeline: TimelineEvent[];
  bookmarks: EvidenceId[];
}

export type CaseDataState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: CaseDataset };

// same files vanilla app fetches
async function fetchJson(file: string): Promise<unknown> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/${file}`);
  if (!res.ok) throw new Error(`${file} could not be loaded (HTTP ${res.status})`);
  return await res.json();
}

function readBookmarks(): EvidenceId[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

async function loadCaseDataset(): Promise<CaseDataset> {
  // fetch filess in parallelr
  const [caseJson, peopleJson, locationsJson, evidenceJson, timelineJson] = await Promise.all([
    fetchJson("case.json"),
    fetchJson("people.json"),
    fetchJson("locations.json"),
    fetchJson("evidence.json"),
    fetchJson("timeline.json"),
  ]);

  const people = peopleJson as Person[];
  return {
    caseData: caseJson as CaseData,
    people,
    locations: locationsJson as CaseLocation[],
    evidence: toEvidenceList(evidenceJson, people),
    timeline: timelineJson as TimelineEvent[],
    bookmarks: readBookmarks(),
  };
}

export function useCaseData(): CaseDataState {
  const [state, setState] = useState<CaseDataState>({ status: "loading" });

  useEffect(() => {
    // ignore a result that arrives after unmount (StrictMode runs effects twice in dev)
    let cancelled = false;
    loadCaseDataset()
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((err: unknown) => {
        if (!cancelled) setState({ status: "error", message: String(err) });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
