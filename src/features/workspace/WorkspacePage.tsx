import { useState, type ReactElement } from "react";
import { Link } from "react-router";
import { MiniListItem } from "../../shared/components/MiniListItem.js";
import { readNotes } from "../../shared/storage.js";
import type { CaseDataset, EvidenceId } from "../../types.js";
import { HypothesisForm } from "./components/HypothesisForm.js";

interface WorkspacePageProps {
  data: CaseDataset;
  bookmarks: readonly EvidenceId[];
}

export function WorkspacePage({ data, bookmarks }: WorkspacePageProps): ReactElement {
  const { evidence, people } = data;

  // read once per visit -> evidence page writes notes to storage
  const [notes] = useState(readNotes);

  // derived from the lifted bookmark state, not stored
  const bookmarkedItems = evidence.filter((ev) => bookmarks.includes(ev.id));
  const notedItems = evidence.filter((ev) => notes[ev.id]);

  return (
    <section>
      <h2>Investigator Workspace</h2>

      <div className="workspace-grid">
        <div className="workspace-col">
          <h3>Bookmarked Evidence</h3>
          <div className="bookmarks-list">
            {bookmarkedItems.length === 0 && (
              <p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>
            )}
            {bookmarkedItems.map((ev) => (
              <MiniListItem key={ev.id}>
                <strong>{ev.id}</strong> &mdash; {ev.title}{" "}
                <Link to={`/evidence?evidence=${ev.id}`} className="btn btn-small btn-secondary">
                  Open
                </Link>
              </MiniListItem>
            ))}
          </div>
        </div>

        <div className="workspace-col">
          <h3>Personal Notes</h3>
          <p className="hint-text">
            Notes are attached to whichever evidence item is currently open in the Evidence view.
          </p>
          <div className="notes-list">
            {notedItems.length === 0 && (
              <p>No notes yet. Add one from an evidence item&apos;s detail view.</p>
            )}
            {notedItems.map((ev) => (
              <MiniListItem key={ev.id}>
                <strong>{ev.id}</strong> &mdash; {ev.title}
                <div>{notes[ev.id]}</div>
              </MiniListItem>
            ))}
          </div>
        </div>
      </div>

      <HypothesisForm people={people} evidence={evidence} />
    </section>
  );
}
