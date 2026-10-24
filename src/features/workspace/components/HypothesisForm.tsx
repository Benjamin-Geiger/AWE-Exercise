import { useState, type FormEvent, type ReactElement } from "react";
import { readHypothesis, saveHypothesis, type HypothesisDraft } from "../../../shared/storage.js";
import type { EvidenceItem, Person } from "../../../types.js";

interface HypothesisFormProps {
  people: Person[];
  evidence: EvidenceItem[];
}

export function HypothesisForm({ people, evidence }: HypothesisFormProps): ReactElement {
  // stored draft read once -> fills the initial values
  const [stored] = useState(readHypothesis);
  const [confidence, setConfidence] = useState(stored.confidence ?? "50");
  const [showSaved, setShowSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const draft: HypothesisDraft = {
      suspectId: String(form.get("suspectId") ?? ""),
      nature: String(form.get("nature") ?? ""),
      evidenceIds: form.getAll("evidenceIds").map(String),
      confidence,
      explanation: String(form.get("explanation") ?? ""),
      alternative: String(form.get("alternative") ?? ""),
      savedAt: new Date().toISOString(),
    };

    try {
      saveHypothesis(draft);
    } catch (err) {
      console.error("Could not save hypothesis draft", err);
      alert("Your hypothesis could not be saved to local storage.");
      return;
    }
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  }

  return (
    <div className="hypothesis-card">
      <h3>Hypothesis Draft</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="hypSuspect">Suspected responsible person</label>
          <select id="hypSuspect" name="suspectId" defaultValue={stored.suspectId ?? ""}>
            <option value="">Select a person…</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypNature">Accidental or deliberate incident</label>
          <select id="hypNature" name="nature" defaultValue={stored.nature ?? ""}>
            <option value="">Select…</option>
            <option value="accidental">Accidental</option>
            <option value="deliberate">Deliberate</option>
            <option value="unclear">Unclear</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypEvidence">Selected supporting evidence</label>
          <select
            id="hypEvidence"
            name="evidenceIds"
            multiple
            size={6}
            defaultValue={stored.evidenceIds ?? []}
          >
            {evidence.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.id} - {ev.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypConfidence">Confidence (0–100)</label>
          <input
            type="range"
            id="hypConfidence"
            min={0}
            max={100}
            value={confidence}
            onChange={(event) => setConfidence(event.target.value)}
          />
          <output htmlFor="hypConfidence">{confidence}</output>
        </div>

        <div className="form-row">
          <label htmlFor="hypExplanation">Written explanation</label>
          <textarea
            id="hypExplanation"
            name="explanation"
            rows={4}
            placeholder="Explain your reasoning…"
            defaultValue={stored.explanation ?? ""}
          />
        </div>

        <div className="form-row">
          <label htmlFor="hypAlternative">Alternative explanation</label>
          <textarea
            id="hypAlternative"
            name="alternative"
            rows={3}
            placeholder="What else could explain the evidence?"
            defaultValue={stored.alternative ?? ""}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save hypothesis draft
          </button>
          {showSaved && <span className="saved-msg">Saved</span>}
        </div>
      </form>
    </div>
  );
}
