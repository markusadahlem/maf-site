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
  const form = document.getElementById("visualAuraForm");
  const checkboxes = form.querySelectorAll('input[name="visualSymptom"]');
  const otherBox = form.querySelector('input[value="other"]');
  const noneBox = form.querySelector('input[value="none"]');
  const otherWrapper = document.getElementById("visualOtherWrapper");
  const otherText = document.getElementById("visualOtherText");
  const charCount = document.getElementById("visualCharCount");
  const nextBtn = document.getElementById("nextVisualBtn");

  const refreshContinue = bindContinueButton({
    button: nextBtn,
    isReady: () => Array.from(checkboxes).some((cb) => cb.checked),
  });

  bindOtherTextarea({
    trigger: otherBox,
    showWhenChecked: [otherWrapper],
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
    const allSelected = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    // Split `retinal` off — it maps to its own modality bucket
    // (folded into this form to remove the standalone retinal-aura page).
    const visualSelected = allSelected.filter((v) => v !== "retinal");
    const retinalSelected = allSelected.includes("retinal");
    const description = otherBox.checked ? otherText.value.trim() : "";

    setModalityAnswer("visual", { selected: visualSelected, description });
    addSelectedModality("visual");

    if (retinalSelected) {
      setModalityAnswer("retinal", { selected: ["yes"], description: "" });
      addSelectedModality("retinal");
    }

    flowRunner.goNext("visual-aura");
  });
});
