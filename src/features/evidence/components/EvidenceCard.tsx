import type { MouseEvent, ReactElement } from "react";
import { Badge, type BadgeTone } from "../../../shared/components/Badge.js";
import { formatDate } from "../../../shared/format/dates.js";
import type {
  EvidenceId,
  EvidenceItem,
  EvidenceRelevance,
  EvidenceStatus,
} from "../../../types.js";

const STATUS_TONE: Record<EvidenceStatus, BadgeTone> = {
  unreviewed: "neutral",
  reviewed: "positive",
  flagged: "warning",
};

const RELEVANCE_TONE: Record<EvidenceRelevance, BadgeTone> = {
  unknown: "neutral",
  relevant: "info",
  irrelevant: "neutral",
};

interface EvidenceCardProps {
  item: EvidenceItem;
  isBookmarked: boolean;
  onOpen: (id: EvidenceId) => void;
  onToggleBookmark: (id: EvidenceId) => void;
}

export function EvidenceCard({
  item,
  isBookmarked,
  onOpen,
  onToggleBookmark,
}: EvidenceCardProps): ReactElement {
  function handleBookmarkClick(event: MouseEvent<HTMLButtonElement>): void {
    // button sits inside card
    event.stopPropagation();
    onToggleBookmark(item.id);
  }

  return (
    <div className="evidence-card" onClick={() => onOpen(item.id)}>
      <button
        type="button"
        className={isBookmarked ? "bookmark-btn active" : "bookmark-btn"}
        aria-label={`Toggle bookmark for ${item.title}`}
        aria-pressed={isBookmarked}
        onClick={handleBookmarkClick}
      >
        <span className="bookmark-icon">{isBookmarked ? "★" : "☆"}</span>
      </button>
      <h3>{item.title}</h3>
      <div className="evidence-meta">
        {item.id} &middot; {item.type} &middot; {formatDate(item.timestamp)}
      </div>
      <div className="evidence-summary">{item.summary}</div>
      {item.tags.includes("critical") && <Badge label="Critical" tone="critical" />}
      <Badge label={item.status} tone={STATUS_TONE[item.status]} />
      <Badge label={item.relevance} tone={RELEVANCE_TONE[item.relevance]} />
      <div>
        {item.tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
