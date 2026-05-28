// index.js — module entry for aura-symptom-check.
//
// Configures and exports the FlowRunner that step JS uses to navigate.
// Provides a getState() that collects the module's localStorage keys
// for rules evaluation (used by Phase 2+ branching).

import { FlowRunner } from "/js/decision-flow/flow-runner.js";
import * as store from "/js/decision-flow/state-store.js";
import { flow } from "/js/modules/aura-symptom-check/flow.js";

export const MODULE_ID = "aura-symptom-check";

function getState() {
    return {
        userInfo: store.get(MODULE_ID, "userInfo"),
        criterionBAnswers: store.get(MODULE_ID, "criterionBAnswers"),
        selectedModalities: store.get(MODULE_ID, "selectedModalities"),
        acuteChronic: store.get(MODULE_ID, "acuteChronic"),
        acuteChronicAnswers: store.get(MODULE_ID, "acuteChronicAnswers"),
        auraCharacteristicsAnswers: store.get(MODULE_ID, "auraCharacteristicsAnswers"),
    };
}

export const flowRunner = new FlowRunner(flow, getState);

export { store };
