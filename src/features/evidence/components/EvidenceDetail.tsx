import { useState, type ReactElement } from "react";
import { formatDate } from "../../../shared/format/dates.js";
import type { CaseLocation, EvidenceId, EvidenceItem, Person } from "../../../types.js";

interface EvidenceDetailProps {
  item: EvidenceItem;
  people: Person[];
  locations: CaseLocation[];
  savedNote: string;
  onClose: () => void;
  onSaveNote: (id: EvidenceId, text: string) => void;
}

export function EvidenceDetail({
  item,
  people,
  locations,
  savedNote,
  onClose,
  onSaveNote,
}: EvidenceDetailProps): ReactElement {
  // starts from saved note & parent passes item.id, resets per item
  const [draft, setDraft] = useState(savedNote);

  const personNames = item.personIds.map((id) => people.find((p) => p.id === id)?.name ?? id);
  const locationNames = item.locationIds.map((id) => {
    const location = locations.find((l) => l.id === id);
    return location ? `${location.id} - ${location.name}` : id;
  });

  return (
    <div className="evidence-detail">
      <div className="evidence-detail-header">
        <div>
          <h2>{item.title}</h2>
          <div className="evidence-meta">
            {item.id} &middot; {item.type} &middot; {formatDate(item.timestamp)}
          </div>
        </div>
        <button type="button" className="btn btn-secondary btn-small" onClick={onClose}>
          Close
        </button>
      </div>

      {item.tags.includes("critical") && (
        <div className="warning-banner">This item is tagged as critical evidence.</div>
      )}

      <div className="detail-field">
        <strong>Summary</strong>
        {item.summary}
      </div>
      <div className="evidence-detail-content">{item.content}</div>
      <div className="detail-field">
        <strong>Related people</strong>
        {personNames.join(", ")}
      </div>
      <div className="detail-field">
        <strong>Related locations</strong>
        {locationNames.join(", ")}
      </div>
      <div className="detail-field">
        <strong>Tags</strong>
        {item.tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
          </span>
        ))}
      </div>

      <div className="detail-field">
        <strong>Review status</strong>
        <select defaultValue={item.status}>
          <option value="unreviewed">Unreviewed</option>
          <option value="reviewed">Reviewed</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>
      <div className="detail-field">
        <strong>Relevance</strong>
        <select defaultValue={item.relevance}>
          <option value="unknown">Unknown</option>
          <option value="relevant">Relevant</option>
          <option value="irrelevant">Irrelevant</option>
        </select>
      </div>

      <div className="detail-field">
        <strong>Investigator note</strong>
        <textarea
          className="note-textarea"
          rows={3}
          placeholder="Add a private note about this evidence..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="button"
          className="btn btn-primary btn-small"
          style={{ marginTop: 6 }}
          onClick={() => onSaveNote(item.id, draft)}
        >
          Save note
        </button>
      </div>
      <div className="detail-field">
        <strong>Note preview</strong>
        <div>{savedNote}</div>
      </div>
    </div>
  );
}
