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
  const form = document.getElementById("speechAuraForm");
  const checkboxes = form.querySelectorAll('input[name="speechSymptom"]');
  const otherBox = form.querySelector('input[value="other"]');
  const noneBox = form.querySelector('input[value="none"]');
  const otherLabel = document.getElementById("speechTextLabel");
  const otherText = document.getElementById("speechOtherText");
  const charCount = document.getElementById("speechCharCount");
  const nextBtn = document.getElementById("nextSpeechBtn");

  const refreshContinue = bindContinueButton({
    button: nextBtn,
    isReady: () => Array.from(checkboxes).some((cb) => cb.checked),
  });

  bindOtherTextarea({
    trigger: otherBox,
    showWhenChecked: [otherLabel, otherText, charCount],
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
    const description =
      otherBox.checked && otherText.value.trim() ? otherText.value.trim() : "";

    setModalityAnswer("speech", { selected, description });
    addSelectedModality("speech");

    flowRunner.goNext("speech-aura");
  });
});
