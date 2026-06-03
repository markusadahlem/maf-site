// steps.ts — the questionnaire step registry.
//
// One entry per rendered step. The dynamic route (pages/.../[...step].astro)
// emits a page per entry × locale and renders the right input component. Option
// VALUES and storage shapes are ported verbatim from the Hugo step JS so the
// clinical narrative (lib/engine/narrative.ts) keeps matching.
//
// Labels/headings are i18n KEYS resolved per-locale at build time via t().

export type StepType = "checkbox" | "radio" | "motor" | "demographic" | "criterionC";

export interface StepOption {
  /** stored value — must match what narrative.ts expects */
  value: string;
  labelKey: string;
  /** optional bold lead line above the label (reason-for-visit) */
  titleKey?: string;
  /** info popover body (Field Guide blurb) */
  infoKey?: string;
  infoHref?: string;
  /** reveals the free-text "Other" textarea */
  other?: boolean;
  /** exclusive "None of the above" */
  exclusive?: boolean;
}

/** Where a step writes its answer, and in what shape. */
export type Persist =
  | { kind: "modality"; modality: string } // criterionBAnswers[modality] = { selected, description }
  | { kind: "acuteChronic"; field: "reason" } // acuteChronic.reason
  | { kind: "acuteChronicAnswers"; field: string } // acuteChronicAnswers[field]
  | { kind: "userInfo" }
  | { kind: "auraCharacteristics" };

export interface StepDef {
  /** URL subpath after /aura-symptom-check/ (no leading/trailing slash) */
  path: string;
  /** engine stepId in the flow graph (flowRunner.goNext) */
  stepId: string;
  type: StepType;
  /** progress section 1–3 */
  section: 1 | 2 | 3;
  /** optional sub-step counter within the section */
  substep?: { current: number; total: number };
  headingKey: string;
  promptKey?: string;
  /** input name attribute (kept stable; the engine/storage reads it) */
  name: string;
  options?: StepOption[];
  /** value of the exclusive "None" option, if any */
  noneValue?: string;
  noneLabelKey?: string;
  persist: Persist;
  /** URL subpath for the Back link */
  backPath?: string;
}

const READ_FULL = "flow.common.info.readFullEntry";
const NONE_ABOVE = "flow.common.option.noneAbove";

// ── Modality cascade (Section 2 — "Symptoms") ───────────────────────────────

const visual: StepDef = {
  path: "modality/visual-aura",
  stepId: "visual-aura",
  type: "checkbox",
  section: 2,
  substep: { current: 1, total: 5 },
  headingKey: "flow.pages.modality.visual.heading",
  promptKey: "flow.pages.modality.visual.prompt",
  name: "visualSymptom",
  noneValue: "none",
  noneLabelKey: "flow.modality.visual.option.none",
  persist: { kind: "modality", modality: "visual" },
  options: [
    { value: "flicker", labelKey: "flow.modality.visual.option.flicker", infoKey: "flow.modality.visual.info.flicker", infoHref: "/symptom-guide/transitory_visual-hallucinations/#random-form" },
    { value: "zigzag", labelKey: "flow.modality.visual.option.zigzag", infoKey: "flow.modality.visual.info.zigzag", infoHref: "/symptom-guide/transitory_visual-hallucinations/#line-form" },
    { value: "blurred", labelKey: "flow.modality.visual.option.blurred", infoKey: "flow.modality.visual.info.blurred", infoHref: "/symptom-guide/transitory_visual-loss/#blurred-vision" },
    { value: "scotoma", labelKey: "flow.modality.visual.option.scotoma", infoKey: "flow.modality.visual.info.scotoma", infoHref: "/symptom-guide/transitory_visual-loss/#scotoma" },
    { value: "retinal", labelKey: "flow.modality.visual.option.retinal", infoKey: "flow.modality.visual.info.retinal", infoHref: "/symptom-guide/transitory_visual-loss/" },
    { value: "geometric", labelKey: "flow.modality.visual.option.geometric", infoKey: "flow.modality.visual.info.geometric", infoHref: "/symptom-guide/transitory_visual-hallucinations/#lattice-form" },
    { value: "other", labelKey: "flow.modality.visual.option.other", other: true, infoKey: "flow.modality.visual.info.other", infoHref: "/symptom-guide/" },
  ],
};

const sensory: StepDef = {
  path: "modality/sensory-aura",
  stepId: "sensory-aura",
  type: "checkbox",
  section: 2,
  substep: { current: 2, total: 5 },
  headingKey: "flow.pages.modality.sensory.heading",
  promptKey: "flow.pages.modality.sensory.prompt",
  name: "sensorySymptom",
  noneValue: "none",
  noneLabelKey: NONE_ABOVE,
  persist: { kind: "modality", modality: "sensory" },
  backPath: "modality/visual-aura",
  options: [
    { value: "tingling", labelKey: "flow.modality.sensory.option.tingling", infoKey: "flow.modality.sensory.info.tingling", infoHref: "/symptom-guide/transitory_somatosensory-symptoms/#paraesthesias" },
    { value: "numbness", labelKey: "flow.modality.sensory.option.numbness", infoKey: "flow.modality.sensory.info.numbness", infoHref: "/symptom-guide/transitory_somatosensory-symptoms/#hemihypaesthesia" },
    { value: "burning", labelKey: "flow.modality.sensory.option.burning", infoKey: "flow.modality.sensory.info.burning", infoHref: "/symptom-guide/transitory_somatosensory-symptoms/#paraesthesias" },
    { value: "other", labelKey: "flow.modality.sensory.option.other", other: true, infoKey: "flow.modality.sensory.info.other", infoHref: "/symptom-guide/#transitory-somatosensory" },
  ],
};

const speech: StepDef = {
  path: "modality/speech-aura",
  stepId: "speech-aura",
  type: "checkbox",
  section: 2,
  substep: { current: 3, total: 5 },
  headingKey: "flow.pages.modality.speech.heading",
  promptKey: "flow.pages.modality.speech.prompt",
  name: "speechSymptom",
  noneValue: "none",
  noneLabelKey: NONE_ABOVE,
  persist: { kind: "modality", modality: "speech" },
  backPath: "modality/sensory-aura",
  options: [
    { value: "aphasia", labelKey: "flow.modality.speech.option.aphasia", infoKey: "flow.modality.speech.info.aphasia", infoHref: "/symptom-guide/transitory_language-symptoms/#expressive-aphasia" },
    { value: "slurred", labelKey: "flow.modality.speech.option.slurred", infoKey: "flow.modality.speech.info.slurred", infoHref: "/symptom-guide/transitory_speech-symptoms/#dysarthria" },
    { value: "inability", labelKey: "flow.modality.speech.option.inability", infoKey: "flow.modality.speech.info.inability", infoHref: "/symptom-guide/transitory_speech-symptoms/#mutism" },
    { value: "other", labelKey: "flow.modality.speech.option.other", other: true, infoKey: "flow.modality.speech.info.other", infoHref: "/symptom-guide/#transitory-speech-language" },
  ],
};

const motor: StepDef = {
  path: "modality/motor-aura",
  stepId: "motor-aura",
  type: "motor",
  section: 2,
  substep: { current: 4, total: 5 },
  headingKey: "flow.pages.modality.motor.heading",
  promptKey: "flow.pages.modality.motor.prompt",
  name: "motorWeakness",
  persist: { kind: "modality", modality: "motor" },
  backPath: "modality/speech-aura",
  // Location checkboxes (shown when "Yes"); values are stored verbatim.
  options: [
    { value: "Arm or hand", labelKey: "flow.modality.motor.location.armOrHand", infoKey: "flow.modality.motor.info.armOrHand", infoHref: "/symptom-guide/transitory_motor-symptoms/#hemiplegic-migraine" },
    { value: "Leg or foot", labelKey: "flow.modality.motor.location.legOrFoot", infoKey: "flow.modality.motor.info.legOrFoot", infoHref: "/symptom-guide/transitory_motor-symptoms/#hemiplegic-migraine" },
    { value: "Face", labelKey: "flow.modality.motor.location.face", infoKey: "flow.modality.motor.info.face", infoHref: "/symptom-guide/transitory_motor-symptoms/#facial-weakness" },
    { value: "Other", labelKey: "flow.modality.motor.location.other", other: true, infoKey: "flow.modality.motor.info.other", infoHref: "/symptom-guide/#transitory-motor" },
  ],
};

const brainstem: StepDef = {
  path: "modality/brainstem-aura",
  stepId: "brainstem-aura",
  type: "checkbox",
  section: 2,
  substep: { current: 5, total: 5 },
  headingKey: "flow.pages.modality.brainstem.heading",
  promptKey: "flow.pages.modality.brainstem.prompt",
  name: "brainstemSymptom",
  noneValue: "none",
  noneLabelKey: NONE_ABOVE,
  persist: { kind: "modality", modality: "brainstem" },
  backPath: "modality/motor-aura",
  options: [
    { value: "dysarthria", labelKey: "flow.modality.brainstem.option.dysarthria", infoKey: "flow.modality.brainstem.info.dysarthria", infoHref: "/symptom-guide/transitory_speech-symptoms/#dysarthria" },
    { value: "vertigo", labelKey: "flow.modality.brainstem.option.vertigo", infoKey: "flow.modality.brainstem.info.vertigo", infoHref: "/symptom-guide/#transitory-brainstem" },
    { value: "tinnitus", labelKey: "flow.modality.brainstem.option.tinnitus", infoKey: "flow.modality.brainstem.info.tinnitus", infoHref: "/symptom-guide/transitory_auditory-symptoms/#tinnitus" },
    { value: "hypacusis", labelKey: "flow.modality.brainstem.option.hypacusis", infoKey: "flow.modality.brainstem.info.hypacusis", infoHref: "/symptom-guide/transitory_auditory-symptoms/#decreased-hearing" },
    { value: "diplopia", labelKey: "flow.modality.brainstem.option.diplopia", infoKey: "flow.modality.brainstem.info.diplopia", infoHref: "/symptom-guide/#transitory-brainstem" },
    { value: "ataxia", labelKey: "flow.modality.brainstem.option.ataxia", infoKey: "flow.modality.brainstem.info.ataxia", infoHref: "/symptom-guide/#transitory-brainstem" },
    { value: "consciousness", labelKey: "flow.modality.brainstem.option.consciousness", infoKey: "flow.modality.brainstem.info.consciousness", infoHref: "/symptom-guide/#transitory-brainstem" },
    { value: "other", labelKey: "flow.modality.brainstem.option.other", other: true, infoKey: "flow.modality.brainstem.info.other", infoHref: "/symptom-guide/#transitory-brainstem" },
  ],
};

// ── Acute-chronic intake (Section 1 — "About your visit") ───────────────────

const reasonForVisit: StepDef = {
  path: "acute-chronic/reason-for-visit",
  stepId: "reason-for-visit",
  type: "radio",
  section: 1,
  headingKey: "flow.pages.reasonForVisit.heading",
  promptKey: "flow.pages.reasonForVisit.prompt",
  name: "reasonForVisit",
  persist: { kind: "acuteChronic", field: "reason" },
  options: [
    { value: "acute-chronic-A1", titleKey: "flow.acuteChronic.reason.a1.heading", labelKey: "flow.acuteChronic.reason.a1.label" },
    { value: "acute-chronic-A2", titleKey: "flow.acuteChronic.reason.a2.heading", labelKey: "flow.acuteChronic.reason.a2.label" },
    { value: "acute-chronic-A3", titleKey: "flow.acuteChronic.reason.a3.heading", labelKey: "flow.acuteChronic.reason.a3.label" },
    { value: "acute-chronic-A4", titleKey: "flow.acuteChronic.reason.a4.heading", labelKey: "flow.acuteChronic.reason.a4.label" },
    { value: "acute-chronic-A5", titleKey: "flow.acuteChronic.reason.a5.heading", labelKey: "flow.acuteChronic.reason.a5.label" },
  ],
};

const symptomExperience1: StepDef = {
  path: "acute-chronic/symptom-experience-1",
  stepId: "symptom-experience-1",
  type: "radio",
  section: 1,
  headingKey: "flow.pages.symptomExperience1.heading",
  promptKey: "flow.pages.symptomExperience1.prompt",
  name: "symptomExperience",
  persist: { kind: "acuteChronicAnswers", field: "symptomExperience" },
  backPath: "acute-chronic/reason-for-visit",
  options: [
    { value: "acute-chronic-B1", labelKey: "flow.acuteChronic.symptomExperience1.b1" },
    { value: "acute-chronic-B2", labelKey: "flow.acuteChronic.symptomExperience1.b2" },
    { value: "acute-chronic-B3", labelKey: "flow.acuteChronic.symptomExperience1.b3" },
  ],
};

const symptomExperience2: StepDef = {
  path: "acute-chronic/symptom-experience-2",
  stepId: "symptom-experience-2",
  type: "radio",
  section: 1,
  headingKey: "flow.pages.symptomExperience2.heading",
  promptKey: "flow.pages.symptomExperience2.prompt",
  name: "symptomExperience",
  persist: { kind: "acuteChronicAnswers", field: "symptomExperience" },
  backPath: "acute-chronic/reason-for-visit",
  options: [
    { value: "acute-chronic-B1", labelKey: "flow.acuteChronic.symptomExperience2.b1" },
    { value: "acute-chronic-B2", labelKey: "flow.acuteChronic.symptomExperience2.b2" },
    { value: "acute-chronic-B3", labelKey: "flow.acuteChronic.symptomExperience2.b3" },
  ],
};

const onsetWindow: StepDef = {
  path: "acute-chronic/onset-window",
  stepId: "onset-window",
  type: "radio",
  section: 1,
  headingKey: "flow.pages.onsetWindow.heading",
  promptKey: "flow.pages.onsetWindow.prompt",
  name: "onsetWindow",
  persist: { kind: "acuteChronicAnswers", field: "onsetWindow" },
  options: [
    // C1 is hidden client-side when symptomExperience === "acute-chronic-B3".
    { value: "acute-chronic-C1", labelKey: "flow.acuteChronic.onsetWindow.c1" },
    { value: "acute-chronic-C2", labelKey: "flow.acuteChronic.onsetWindow.c2" },
    { value: "acute-chronic-C3", labelKey: "flow.acuteChronic.onsetWindow.c3" },
    { value: "acute-chronic-C4", labelKey: "flow.acuteChronic.onsetWindow.c4" },
  ],
};

const symptomProgression: StepDef = {
  path: "acute-chronic/symptom-progression",
  stepId: "symptom-progression",
  type: "radio",
  section: 1,
  headingKey: "flow.pages.symptomProgression.heading",
  promptKey: "flow.pages.symptomProgression.prompt",
  name: "symptomProgression",
  persist: { kind: "acuteChronicAnswers", field: "symptomProgression" },
  options: [
    { value: "acute-chronic-D1", labelKey: "flow.acuteChronic.symptomProgression.d1" },
    { value: "acute-chronic-D2", labelKey: "flow.acuteChronic.symptomProgression.d2" },
    { value: "acute-chronic-D3", labelKey: "flow.acuteChronic.symptomProgression.d3" },
  ],
};

const impact: StepDef = {
  path: "acute-chronic/impact-on-daily-life",
  stepId: "impact-on-daily-life",
  type: "radio",
  section: 1,
  headingKey: "flow.pages.impactOnDailyLife.heading",
  promptKey: "flow.pages.impactOnDailyLife.prompt",
  name: "impact",
  persist: { kind: "acuteChronicAnswers", field: "impact" },
  backPath: "acute-chronic/symptom-progression",
  options: [
    { value: "acute-chronic-E1", labelKey: "flow.acuteChronic.impact.e1" },
    { value: "acute-chronic-E2", labelKey: "flow.acuteChronic.impact.e2" },
    { value: "acute-chronic-E3", labelKey: "flow.acuteChronic.impact.e3" },
  ],
};

const remedies: StepDef = {
  path: "acute-chronic/response-to-usual-remedies",
  stepId: "response-to-usual-remedies",
  type: "radio",
  section: 1,
  headingKey: "flow.pages.responseToUsualRemedies.heading",
  promptKey: "flow.pages.responseToUsualRemedies.prompt",
  name: "remedies",
  persist: { kind: "acuteChronicAnswers", field: "remedies" },
  backPath: "acute-chronic/impact-on-daily-life",
  options: [
    { value: "acute-chronic-F4", labelKey: "flow.acuteChronic.remedies.f4" },
    { value: "acute-chronic-F3", labelKey: "flow.acuteChronic.remedies.f3" },
    { value: "acute-chronic-F2", labelKey: "flow.acuteChronic.remedies.f2" },
    { value: "acute-chronic-F1", labelKey: "flow.acuteChronic.remedies.f1" },
  ],
};

const priorMedical: StepDef = {
  path: "acute-chronic/prior-medical-attention",
  stepId: "prior-medical-attention",
  type: "radio",
  section: 1,
  headingKey: "flow.pages.priorMedicalAttention.heading",
  promptKey: "flow.pages.priorMedicalAttention.prompt",
  name: "priorMedical",
  persist: { kind: "acuteChronicAnswers", field: "priorMedical" },
  backPath: "acute-chronic/response-to-usual-remedies",
  options: [
    { value: "acute-chronic-G3", labelKey: "flow.acuteChronic.priorMedical.g3" },
    { value: "acute-chronic-G2", labelKey: "flow.acuteChronic.priorMedical.g2" },
    { value: "acute-chronic-G1", labelKey: "flow.acuteChronic.priorMedical.g1" },
  ],
};

// ── Criterion C quiz (Section 3 — "Characteristics") ────────────────────────

const auraCharacteristics: StepDef = {
  path: "aura-characteristics",
  stepId: "aura-characteristics",
  type: "criterionC",
  section: 3,
  headingKey: "flow.pages.auraCharacteristics.heading",
  name: "auraCharacteristics",
  persist: { kind: "auraCharacteristics" },
  backPath: "modality/brainstem-aura",
};

// ── Demographic (Section 3 — "Characteristics") ─────────────────────────────

const demographic: StepDef = {
  path: "demographic-information",
  stepId: "demographic-information",
  type: "demographic",
  section: 3,
  headingKey: "flow.pages.demographic.heading",
  promptKey: "flow.pages.demographic.prompt",
  name: "demographic",
  persist: { kind: "userInfo" },
};

export const flowSteps: StepDef[] = [
  visual,
  sensory,
  speech,
  motor,
  brainstem,
  reasonForVisit,
  symptomExperience1,
  symptomExperience2,
  onsetWindow,
  symptomProgression,
  impact,
  remedies,
  priorMedical,
  auraCharacteristics,
  demographic,
];

const byPath = new Map(flowSteps.map((s) => [s.path, s]));

export function getStep(path: string): StepDef | undefined {
  return byPath.get(path);
}
