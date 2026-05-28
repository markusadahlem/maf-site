import {
  setModalityAnswer,
  addSelectedModality,
} from "/js/aura-symptom-check/lib/storage.js";
import {
  bindExclusiveCheckboxGroup,
  bindOtherTextarea,
  bindContinueButton,
} from "/js/aura-symptom-check/lib/form-controls.js";
import { flowRunner } from "/js/modules/aura-symptom-check/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("sensoryAuraForm");
  const checkboxes = form.querySelectorAll('input[name="sensorySymptom"]');
  const otherBox = form.querySelector('input[value="other"]');
  const noneBox = form.querySelector('input[value="none"]');
  const otherLabel = document.getElementById("sensoryOtherLabel");
  const otherText = document.getElementById("sensoryOtherText");
  const charCount = document.getElementById("sensoryCharCount");
  const nextBtn = document.getElementById("nextSensoryBtn");

  const refreshContinue = bindContinueButton({
    button: nextBtn,
    isReady: () => Array.from(checkboxes).some((cb) => cb.checked),
  });

  bindOtherTextarea({
    trigger: otherBox,
    showWhenChecked: [otherLabel, otherText],
    hideWhenChecked: [noneBox.parentElement],
    textarea: otherText,
    counter: charCount,
    onChange: refreshContinue,
  });

  bindExclusiveCheckboxGroup({
    checkboxes,
    exclusiveValue: "none",
    onChange: refreshContinue,
  });

  nextBtn.addEventListener("click", () => {
    const selected = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    const description = otherBox.checked ? otherText.value.trim() : "";

    setModalityAnswer("sensory", { selected, description });
    addSelectedModality("sensory");

    flowRunner.goNext("sensory-aura");
  });
});
