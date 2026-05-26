const CRITERION_B_KEY = "criterionBAnswers";
const SELECTED_MODALITIES_KEY = "selectedModalities";

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || fallback);
  } catch {
    return JSON.parse(fallback);
  }
}

export function getCriterionBAnswers() {
  return readJSON(CRITERION_B_KEY, "{}");
}

export function setModalityAnswer(modality, answer) {
  const answers = getCriterionBAnswers();
  answers[modality] = answer;
  localStorage.setItem(CRITERION_B_KEY, JSON.stringify(answers));
}

export function getSelectedModalities() {
  return readJSON(SELECTED_MODALITIES_KEY, "[]");
}

export function addSelectedModality(modality) {
  const list = getSelectedModalities();
  if (!list.includes(modality)) {
    list.push(modality);
    localStorage.setItem(SELECTED_MODALITIES_KEY, JSON.stringify(list));
  }
}
