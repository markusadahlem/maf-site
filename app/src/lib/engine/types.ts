// Shared types for the decision-flow engine and the aura-symptom-check rules.

export type Lang = "en" | "de" | (string & {});

export type Gender = "male" | "female" | "other" | (string & {});

export interface Pronouns {
  subj: string;
  poss: string;
  label: string;
}

// ── Rules / flow ────────────────────────────────────────────────────────────

/** One arm of a branch array: either a guarded `goto` or a `default`. */
export interface Branch<S> {
  when?: (state: S) => boolean;
  goto?: string;
  default?: string;
}

/**
 * A step's `next` declaration. Resolved by the rules-engine:
 *   - string:    a static URL
 *   - function:  computes the URL from state
 *   - Branch[]:  first matching `when` (or a `default`) wins
 *   - null:      terminal node (no forward navigation)
 */
export type NextDecl<S> =
  | string
  | ((state: S) => string)
  | Branch<S>[]
  | null;

export interface Step<S> {
  next: NextDecl<S>;
}

export interface Flow<S> {
  id: string;
  steps: Record<string, Step<S>>;
}

// ── i18n ────────────────────────────────────────────────────────────────────

/** Flat catalog of dotted message keys → template strings. */
export type Catalog = Record<string, string>;

export type Params = Record<string, string | number>;

// ── Narrative input shapes (the localStorage answer payloads) ───────────────

export interface UserInfo {
  gender?: Gender;
  name?: string;
  diagnosisYear?: string | number;
  headacheDays?: number;
}

/** A single modality's answers (criterionBAnswers[modality]). */
export interface ModalityEntry {
  selected?: string[];
  symptoms?: string[];
  description?: string;
  /** motor-aura only: the yes/no/unsure gate value */
  hasWeakness?: string;
}

/** criterionBAnswers — keyed by modality (visual, retinal, sensory, …). */
export type CriterionBAnswers = Record<string, ModalityEntry>;

export interface AcuteChronicData {
  reason?: string;
}

export interface AcuteChronicAnswers {
  symptomExperience?: string;
  onsetWindow?: string;
  symptomProgression?: string;
  impact?: string;
  remedies?: string;
  priorMedical?: string;
}

export type AuraCharacteristicsAnswers = boolean[];
