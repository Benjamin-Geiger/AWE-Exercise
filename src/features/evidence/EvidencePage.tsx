import { useReducer, type ReactElement } from "react";
import { useSearchParams } from "react-router";
import type { CaseDataset, EvidenceId, EvidenceReview } from "../../types.js";
import { EvidenceCard } from "./components/EvidenceCard.js";
import { EvidenceDetail } from "./components/EvidenceDetail.js";
import { EvidenceToolbar } from "./components/EvidenceToolbar.js";
import { EMPTY_FILTERS, filtersReducer, selectVisibleEvidence } from "./evidenceFilters.js";

interface EvidencePageProps {
  data: CaseDataset;
  bookmarks: readonly EvidenceId[];
  notes: Record<EvidenceId, string>;
  onToggleBookmark: (id: EvidenceId) => void;
  onSaveNote: (id: EvidenceId, text: string) => void;
  onReviewChange: (id: EvidenceId, review: EvidenceReview) => void;
}

export function EvidencePage({
  data,
  bookmarks,
  notes,
  onToggleBookmark,
  onSaveNote,
  onReviewChange,
}: EvidencePageProps): ReactElement {
  const { evidence, people, locations } = data;
  const [filters, dispatch] = useReducer(filtersReducer, EMPTY_FILTERS);

  // ?evidence=<id> opens detail, workspace links use it too
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = evidence.find((ev) => ev.id === searchParams.get("evidence"));

  const visibleEvidence = selectVisibleEvidence(evidence, filters);
  const evidenceTypes = [...new Set(evidence.map((ev) => ev.type.toLowerCase()))];

  return (
    <section>
      <h2>Evidence Catalogue</h2>
      <EvidenceToolbar
        evidenceTypes={evidenceTypes}
        people={people}
        locations={locations}
        filters={filters}
        dispatch={dispatch}
      />
      <div className="evidence-grid">
        {visibleEvidence.length === 0 && <p>No evidence matches the current filters.</p>}
        {visibleEvidence.map((ev) => (
          <EvidenceCard
            key={ev.id}
            item={ev}
            isBookmarked={bookmarks.includes(ev.id)}
            onOpen={(id) => setSearchParams({ evidence: id })}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>
      {selected && (
        <EvidenceDetail
          key={selected.id}
          item={selected}
          people={people}
          locations={locations}
          savedNote={notes[selected.id] ?? ""}
          onClose={() => setSearchParams({})}
          onSaveNote={onSaveNote}
          onReviewChange={onReviewChange}
        />
      )}
    </section>
  );
}
