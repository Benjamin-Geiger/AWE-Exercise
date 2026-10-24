import { useState, type ReactElement } from "react";
import { useSearchParams } from "react-router";
import { readBookmarks, readNotes, saveBookmarks, saveNotes } from "../../shared/storage.js";
import type { CaseDataset, EvidenceId } from "../../types.js";
import { EvidenceCard } from "./components/EvidenceCard.js";
import { EvidenceDetail } from "./components/EvidenceDetail.js";
import { EvidenceToolbar } from "./components/EvidenceToolbar.js";

interface EvidencePageProps {
  data: CaseDataset;
}

export function EvidencePage({ data }: EvidencePageProps): ReactElement {
  const { evidence, people, locations } = data;

  // from storage --> the page remounts on every visit
  const [bookmarks, setBookmarks] = useState(readBookmarks);
  const [notes, setNotes] = useState(readNotes);
  const [searchTerm, setSearchTerm] = useState("");

  // ?evidence=<id> opens detail, workspace links use it too
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = evidence.find((ev) => ev.id === searchParams.get("evidence"));

  function handleToggleBookmark(id: EvidenceId): void {
    const next = bookmarks.includes(id) ? bookmarks.filter((b) => b !== id) : [...bookmarks, id];
    setBookmarks(next);
    saveBookmarks(next);
  }

  function handleSaveNote(id: EvidenceId, text: string): void {
    const next = { ...notes, [id]: text };
    setNotes(next);
    saveNotes(next);
  }

  // filter() returns new array --> so sort() never reorders data.evidence
  const term = searchTerm.toLowerCase().trim();
  const visibleEvidence = evidence
    .filter((ev) => `${ev.title} ${ev.summary} ${ev.tags.join(" ")}`.toLowerCase().includes(term))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const evidenceTypes = [...new Set(evidence.map((ev) => ev.type.toLowerCase()))];

  return (
    <section>
      <h2>Evidence Catalogue</h2>
      <EvidenceToolbar
        evidenceTypes={evidenceTypes}
        people={people}
        locations={locations}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <div className="evidence-grid">
        {visibleEvidence.length === 0 && <p>No evidence matches the current filters.</p>}
        {visibleEvidence.map((ev) => (
          <EvidenceCard
            key={ev.id}
            item={ev}
            isBookmarked={bookmarks.includes(ev.id)}
            onOpen={(id) => setSearchParams({ evidence: id })}
            onToggleBookmark={handleToggleBookmark}
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
        />
      )}
    </section>
  );
}
