import type { ReactElement } from "react";
import { useBookmarks } from "../../shared/BookmarkContext.js";
import type { CaseDataset } from "../../types.js";
import { CaseSummaryCard } from "./components/CaseSummaryCard.js";
import { HowToGuide } from "./components/HowToGuide.js";
import { RecentEvidenceList } from "./components/RecentEvidenceList.js";
import { RecentTimelineList } from "./components/RecentTimelineList.js";
import { ReviewProgress } from "./components/ReviewProgress.js";
import { StatCard } from "./components/StatCard.js";

interface DashboardPageProps {
  data: CaseDataset;
}

export function DashboardPage({ data }: DashboardPageProps): ReactElement {
  const { caseData, evidence, people, locations, timeline } = data;
  const { bookmarks } = useBookmarks();

  // derived values: recalculated from the current data on every render
  const reviewedCount = evidence.filter((ev) => ev.status === "reviewed").length;
  const recentEvidence = evidence.slice(-5).reverse();
  const recentTimeline = timeline.slice(-5).reverse();

  return (
    <section>
      <h2>Case Dashboard</h2>
      <HowToGuide />
      <CaseSummaryCard caseData={caseData} />
      <div className="stat-grid">
        <StatCard value={evidence.length} label="Evidence items" />
        <StatCard value={people.length} label="People" />
        <StatCard value={locations.length} label="Locations" />
        <StatCard value={bookmarks.length} label="Bookmarked" />
        <StatCard value={reviewedCount} label="Reviewed" />
      </div>
      <ReviewProgress reviewed={reviewedCount} total={evidence.length} />
      <div className="dashboard-columns">
        <RecentEvidenceList items={recentEvidence} />
        <RecentTimelineList events={recentTimeline} />
      </div>
    </section>
  );
}
