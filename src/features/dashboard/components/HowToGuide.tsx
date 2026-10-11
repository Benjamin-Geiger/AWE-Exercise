import type { ReactElement } from "react";
import { Link } from "react-router";

interface HowToStep {
  to: string;
  title: string;
  text: string;
  button: string;
}

const STEPS: HowToStep[] = [
  {
    to: "/evidence",
    title: "1. Evidence Catalogue",
    text: "Search, filter, and sort every evidence item. Open one for full details, related people and locations, and to add a private note.",
    button: "Go to Evidence",
  },
  {
    to: "/people",
    title: "2. People & Locations",
    text: "Read profiles and statements from the six team members involved, and look up the six key locations in the investigation.",
    button: "Go to People & Locations",
  },
  {
    to: "/timeline",
    title: "3. Timeline",
    text: "Walk through events in chronological order, filter by person, location, or type, and jump straight to the evidence behind any event.",
    button: "Go to Timeline",
  },
  {
    to: "/workspace",
    title: "4. Investigator Workspace",
    text: "Your bookmarked evidence and notes collect here. Draft a hypothesis — who you suspect, why, and how confident you are — it's saved automatically in your browser.",
    button: "Go to Workspace",
  },
];

export function HowToGuide(): ReactElement {
  return (
    <div className="intro-card">
      <h3>How to use this portal</h3>
      <p>
        Everything gathered on the case so far is organised into four working views. Use the
        navigation bar at the top to move between them at any time.
      </p>
      <div className="howto-grid">
        {STEPS.map((step) => (
          <div key={step.to} className="howto-item">
            <h4>{step.title}</h4>
            <p>{step.text}</p>
            <Link to={step.to} className="btn btn-secondary btn-small">
              {step.button}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
