import type { ReactElement } from "react";

export type BadgeTone = "neutral" | "positive" | "warning" | "critical";

// tones map existing badge tones fron stylesheet
const TONE_CLASS: Record<BadgeTone, string> = {
  neutral: "badge-unreviewed",
  positive: "badge-reviewed",
  warning: "badge-flagged",
  critical: "badge-critical",
};

interface BadgeProps {
  label: string;
  tone: BadgeTone;
}

export function Badge({ label, tone }: BadgeProps): ReactElement {
  return <span className={`badge ${TONE_CLASS[tone]}`}>{label}</span>;
}
