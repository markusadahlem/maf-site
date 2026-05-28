// storage.js — domain-meaningful wrappers around the state-store for
// modality answers (criterionBAnswers, selectedModalities).

import * as store from "/js/decision-flow/state-store.js";
import { MODULE_ID } from "/js/modules/aura-symptom-check/index.js";

export function getCriterionBAnswers() {
    return store.get(MODULE_ID, "criterionBAnswers") || {};
}

export function setModalityAnswer(modality, answer) {
    const answers = getCriterionBAnswers();
    answers[modality] = answer;
    store.set(MODULE_ID, "criterionBAnswers", answers);
}

export function getSelectedModalities() {
    return store.get(MODULE_ID, "selectedModalities") || [];
}

export function addSelectedModality(modality) {
    const list = getSelectedModalities();
    if (!list.includes(modality)) {
        list.push(modality);
        store.set(MODULE_ID, "selectedModalities", list);
    }
}
