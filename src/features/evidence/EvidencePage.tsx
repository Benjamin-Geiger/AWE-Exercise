import { useReducer, useState, type ReactElement } from "react";
import { useSearchParams } from "react-router";
import { useBookmarks } from "../../shared/BookmarkContext.js";
import { readNotes, saveNotes } from "../../shared/storage.js";
import type { CaseDataset, EvidenceId, EvidenceReview } from "../../types.js";
import { EvidenceCard } from "./components/EvidenceCard.js";
import { EvidenceDetail } from "./components/EvidenceDetail.js";
import { EvidenceToolbar } from "./components/EvidenceToolbar.js";
import { EMPTY_FILTERS, filtersReducer, selectVisibleEvidence } from "./evidenceFilters.js";

interface EvidencePageProps {
  data: CaseDataset;
  onReviewChange: (id: EvidenceId, review: EvidenceReview) => void;
}

export function EvidencePage({ data, onReviewChange }: EvidencePageProps): ReactElement {
  const { evidence, people, locations } = data;
  // the page reads the context -> cards stay props only components
  const { bookmarks, toggleBookmark } = useBookmarks();

  // from storage --> the page remounts on every visit
  const [notes, setNotes] = useState(readNotes);
  const [filters, dispatch] = useReducer(filtersReducer, EMPTY_FILTERS);

  // ?evidence=<id> opens detail, workspace links use it too
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = evidence.find((ev) => ev.id === searchParams.get("evidence"));

  function handleSaveNote(id: EvidenceId, text: string): void {
    const next = { ...notes, [id]: text };
    setNotes(next);
    saveNotes(next);
  }

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
            onToggleBookmark={toggleBookmark}
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
          onSaveNote={handleSaveNote}
          onReviewChange={onReviewChange}
        />
      )}
    </section>
  );
}
