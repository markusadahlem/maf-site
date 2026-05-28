// flow.js — declarative step graph for the aura-symptom-check module.
//
// Each step's `next` is either a static URL (Phase 1) or a branching rule
// (Phase 2). The two branching steps (reason-for-visit, onset-window) are
// declared here with `next: null` for now; their hardcoded switch statements
// stay in the step JS until Phase 2 moves them into this file as functions.
//
// modality-summary is also `next: null` because it reads the next URL from
// a DOM `data-next` attribute set per-page; that pattern will be addressed
// later in the refactor (Phase 3 or 4).
//
// URLs preserve exact trailing-slash quirks from the original step files
// for behavior-preserving migration.

export const flow = {
    id: "aura-symptom-check",
    steps: {
        // ── Entry ────────────────────────────────────────────────────────
        "start": {
            next: "/aura-symptom-check/modality/visual-aura/",
        },

        // ── Modality cascade ─────────────────────────────────────────────
        "visual-aura": {
            next: "/aura-symptom-check/modality/retinal-aura/",
        },
        "retinal-aura": {
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
                    when: (s) => ["acute-chronic-A3", "acute-chronic-A4", "acute-chronic-A5"].includes(s.acuteChronic?.reason),
                    goto: "/aura-symptom-check/acute-chronic/symptom-progression",
                },
            ],
        },
        "onset-window": {
            // No default arm: onset-window is only reachable from A1/A2; any
            // other reason here indicates corrupt state and should surface.
            next: [
                {
                    when: (s) => ["acute-chronic-A1", "acute-chronic-A2"].includes(s.acuteChronic?.reason),
                    goto: "/aura-symptom-check/acute-chronic/symptom-progression/",
                },
            ],
        },

        // ── Terminal node — flow ends here ───────────────────────────────
        // The live modality-summary page is a self-contained PDF generator
        // with no continue button; nothing calls flowRunner.goNext for it.
        "modality-summary": {
            next: null,
        },
    },
};
