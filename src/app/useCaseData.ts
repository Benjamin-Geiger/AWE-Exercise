import { useEffect, useState } from "react";
import { toEvidenceList } from "../shared/normalize.js";
import type {
  CaseData,
  CaseDataset,
  CaseLocation,
  EvidenceId,
  EvidenceReview,
  Person,
  TimelineEvent,
} from "../types.js";

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
  };
}

export function useCaseData(): readonly [
  CaseDataState,
  (id: EvidenceId, review: EvidenceReview) => void,
] {
  const [state, setState] = useState<CaseDataState>({ status: "loading" });

  // only the owner changes loaded evidence: new array, new object for the changed item
  // (vanilla did ev.status = value on the shared object)
  function updateEvidenceReview(id: EvidenceId, review: EvidenceReview): void {
    setState((current) => {
      if (current.status !== "ready") return current;
      const evidence = current.data.evidence.map((ev) =>
        ev.id === id ? { ...ev, ...review } : ev,
      );
      return { ...current, data: { ...current.data, evidence } };
    });
  }

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

  return [state, updateEvidenceReview];
}
