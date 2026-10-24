import { useState, type ReactElement, type SubmitEvent } from "react";
import { readHypothesis, saveHypothesis, type HypothesisDraft } from "../../../shared/storage.js";
import type { EvidenceItem, Person } from "../../../types.js";

interface HypothesisFormProps {
  people: Person[];
  evidence: EvidenceItem[];
}

type HypothesisFields = Omit<HypothesisDraft, "savedAt">;

const EMPTY_FIELDS: HypothesisFields = {
  suspectId: "",
  nature: "",
  evidenceIds: [],
  confidence: "50",
  explanation: "",
  alternative: "",
};

function readInitialFields(): HypothesisFields {
  return { ...EMPTY_FIELDS, ...readHypothesis() };
}

export function HypothesisForm({ people, evidence }: HypothesisFormProps): ReactElement {
  const [fields, setFields] = useState(readInitialFields);
  const [showSaved, setShowSaved] = useState(false);

  function updateField<K extends keyof HypothesisFields>(key: K, value: HypothesisFields[K]): void {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();
    const draft: HypothesisDraft = { ...fields, savedAt: new Date().toISOString() };

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
          <select
            id="hypSuspect"
            value={fields.suspectId}
            onChange={(event) => updateField("suspectId", event.target.value)}
          >
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
          <select
            id="hypNature"
            value={fields.nature}
            onChange={(event) => updateField("nature", event.target.value)}
          >
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
            multiple
            size={6}
            value={fields.evidenceIds}
            onChange={(event) =>
              updateField(
                "evidenceIds",
                Array.from(event.target.selectedOptions, (option) => option.value),
              )
            }
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
            value={fields.confidence}
            onChange={(event) => updateField("confidence", event.target.value)}
          />
          <output htmlFor="hypConfidence">{fields.confidence}</output>
        </div>

        <div className="form-row">
          <label htmlFor="hypExplanation">Written explanation</label>
          <textarea
            id="hypExplanation"
            rows={4}
            placeholder="Explain your reasoning…"
            value={fields.explanation}
            onChange={(event) => updateField("explanation", event.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="hypAlternative">Alternative explanation</label>
          <textarea
            id="hypAlternative"
            rows={3}
            placeholder="What else could explain the evidence?"
            value={fields.alternative}
            onChange={(event) => updateField("alternative", event.target.value)}
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
