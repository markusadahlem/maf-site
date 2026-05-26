import {
  setModalityAnswer,
  addSelectedModality,
} from "/js/aura-symptom-check/lib/storage.js";
import {
  bindExclusiveCheckboxGroup,
  bindOtherTextarea,
  bindContinueButton,
} from "/js/aura-symptom-check/lib/form-controls.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("brainstemAuraForm");
  const checkboxes = form.querySelectorAll('input[name="brainstemSymptoms"]');
  const otherBox = form.querySelector('input[value="other"]');
  const noneBox = form.querySelector('input[value="none"]');
  const otherLabel = document.getElementById("brainstemOtherTextLabel");
  const otherText = document.getElementById("brainstemOtherText");
  const charCount = document.getElementById("brainstemCharCount");
  const nextBtn = document.getElementById("nextBrainstemBtn");

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

    setModalityAnswer("brainstem", { selected, description });
    addSelectedModality("brainstem");

    window.location.href = "/aura-symptom-check/aura-characteristics/";
  });
});
