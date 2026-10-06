import type { ReactElement } from "react";
import { Badge } from "../../../shared/components/Badge.js";
import type { CaseData } from "../../../types.js";

interface CaseSummaryCardProps {
  caseData: CaseData;
}

export function CaseSummaryCard({ caseData }: CaseSummaryCardProps): ReactElement {
  return (
    <div className="case-summary-card">
      <h3>{caseData.title || "Case"}</h3>
      <p>
        <Badge label={(caseData.status || "unknown").toUpperCase()} tone="warning" />
      </p>
      <p>{caseData.summary}</p>
    </div>
  );
}
