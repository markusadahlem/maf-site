// storage.ts — domain-meaningful wrappers around the state-store for the
// aura-symptom-check module (criterionBAnswers, selectedModalities).

import * as store from "./state-store";
import { MODULE_ID } from "../rules/aura-symptom-check";
import type { CriterionBAnswers, ModalityEntry } from "./types";

export function getCriterionBAnswers(): CriterionBAnswers {
  return store.get<CriterionBAnswers>(MODULE_ID, "criterionBAnswers") || {};
}

export function setModalityAnswer(
  modality: string,
  answer: ModalityEntry,
): void {
  const answers = getCriterionBAnswers();
  answers[modality] = answer;
  store.set(MODULE_ID, "criterionBAnswers", answers);
}

export function getSelectedModalities(): string[] {
  return store.get<string[]>(MODULE_ID, "selectedModalities") || [];
}

export function addSelectedModality(modality: string): void {
  const list = getSelectedModalities();
  if (!list.includes(modality)) {
    list.push(modality);
    store.set(MODULE_ID, "selectedModalities", list);
  }
}
