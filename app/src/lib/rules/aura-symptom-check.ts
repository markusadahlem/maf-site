// aura-symptom-check.ts — declarative step graph for the aura-symptom-check
// module. Ported from the Hugo flow.js. Each step's `next` is a static URL or
// a branching rule (resolved by the rules-engine). URLs preserve the exact
// trailing-slash quirks of the original step files for behaviour-preserving
// migration.

import type {
  AcuteChronicAnswers,
  AcuteChronicData,
  AuraCharacteristicsAnswers,
  CriterionBAnswers,
  Flow,
  UserInfo,
} from "../engine/types";

export const MODULE_ID = "aura-symptom-check";

/** The state shape the flow's branch rules read (collected from the store). */
export interface FlowState {
  userInfo?: UserInfo;
  criterionBAnswers?: CriterionBAnswers;
  selectedModalities?: string[];
  acuteChronic?: AcuteChronicData;
  acuteChronicAnswers?: AcuteChronicAnswers;
  auraCharacteristicsAnswers?: AuraCharacteristicsAnswers;
}

export const flow: Flow<FlowState> = {
  id: MODULE_ID,
  steps: {
    // ── Entry ────────────────────────────────────────────────────────
    "start": {
      next: "/aura-symptom-check/modality/visual-aura/",
    },

    // ── Modality cascade ─────────────────────────────────────────────
    // Retinal aura was a standalone step; its single yes/no/unsure
    // question is now a checkbox option inside the visual-aura form.
    "visual-aura": {
      next: "/aura-symptom-check/modality/sensory-aura/",
    },
    "sensory-aura": {
      next: "/aura-symptom-check/modality/speech-aura/",
    },
    "speech-aura": {
      next: "/aura-symptom-check/modality/motor-aura/",
    },
    "motor-aura": {
      next: "/aura-symptom-check/modality/brainstem-aura/",
    },
    "brainstem-aura": {
      next: "/aura-symptom-check/aura-characteristics/",
    },

    // ── Criterion C quiz ─────────────────────────────────────────────
    // In the legacy flow this lived outside flow.js (criterionC.js routed on a
    // localStorage flag). The redesigned linear flow always continues to the
    // demographic form; the C-criterion verdict is stated in the final report.
    "aura-characteristics": {
      next: "/aura-symptom-check/demographic-information/",
    },

    // ── Acute-chronic linear segment ─────────────────────────────────
    "symptom-experience": {
      next: "/aura-symptom-check/acute-chronic/onset-window/",
    },
    "symptom-experience-1": {
      next: "/aura-symptom-check/acute-chronic/onset-window",
    },
    "symptom-experience-2": {
      next: "/aura-symptom-check/acute-chronic/onset-window",
    },
    "symptom-progression": {
      next: "/aura-symptom-check/acute-chronic/impact-on-daily-life/",
    },
    "impact-on-daily-life": {
      next: "/aura-symptom-check/acute-chronic/response-to-usual-remedies/",
    },
    "response-to-usual-remedies": {
      next: "/aura-symptom-check/acute-chronic/prior-medical-attention/",
    },
    "prior-medical-attention": {
      next: "/aura-symptom-check/modality/visual-aura/",
    },

    // ── Demographic ──────────────────────────────────────────────────
    "demographic-information": {
      next: "/aura-symptom-check/modality-summary/",
    },

    // ── Branching steps ──────────────────────────────────────────────
    "reason-for-visit": {
      // No default arm: rules-engine throws if reason is unset/unknown.
      // All five A-values are covered; any miss indicates corrupt state.
      next: [
        {
          when: (s) => s.acuteChronic?.reason === "acute-chronic-A1",
          goto: "/aura-symptom-check/acute-chronic/symptom-experience-1",
        },
        {
          when: (s) => s.acuteChronic?.reason === "acute-chronic-A2",
          goto: "/aura-symptom-check/acute-chronic/symptom-experience-2",
        },
        {
          when: (s) =>
            ["acute-chronic-A3", "acute-chronic-A4", "acute-chronic-A5"].includes(
              s.acuteChronic?.reason ?? "",
            ),
          goto: "/aura-symptom-check/acute-chronic/symptom-progression",
        },
      ],
    },
    "onset-window": {
      // No default arm: onset-window is only reachable from A1/A2; any
      // other reason here indicates corrupt state and should surface.
      next: [
        {
          when: (s) =>
            ["acute-chronic-A1", "acute-chronic-A2"].includes(
              s.acuteChronic?.reason ?? "",
            ),
          goto: "/aura-symptom-check/acute-chronic/symptom-progression/",
        },
      ],
    },

    // ── Terminal node — flow ends here ───────────────────────────────
    // The modality-summary page is a self-contained PDF generator with no
    // continue button; nothing calls flowRunner.goNext for it.
    "modality-summary": {
      next: null,
    },
  },
};
