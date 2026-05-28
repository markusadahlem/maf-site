import {
  setModalityAnswer,
  addSelectedModality,
} from "/js/aura-symptom-check/lib/storage.js";
import {
  bindOtherTextarea,
  bindContinueButton,
} from "/js/aura-symptom-check/lib/form-controls.js";
import { flowRunner } from "/js/modules/aura-symptom-check/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const yesNoRadios = document.querySelectorAll('input[name="motor-weakness"]');
  const locationCheckboxes = document.querySelectorAll(
    'input[name="motor-location"]',
  );
  const otherCheckbox = document.querySelector(
    'input[name="motor-location"][value="Other"]',
  );
  const otherText = document.getElementById("motor-other");
  const otherLabel = document.getElementById("motorOtherLabel");
  const charCount = document.getElementById("motorCharCount");
  const locationSection = document.getElementById("motorLocationsSection");
  const continueBtn = document.getElementById("continueBtn");

  const selectedRadio = () =>
    Array.from(yesNoRadios).find((r) => r.checked)?.value;

  const refreshContinue = bindContinueButton({
    button: continueBtn,
    isReady: () => {
      const choice = selectedRadio();
      if (choice === "yes") {
        return Array.from(locationCheckboxes).some((cb) => cb.checked);
      }
      return choice === "no" || choice === "unsure";
    },
  });

  const syncLocationSection = () => {
    locationSection.style.display = selectedRadio() === "yes" ? "block" : "none";
    refreshContinue();
  };

  bindOtherTextarea({
    trigger: otherCheckbox,
    showWhenChecked: [otherLabel, otherText],
    textarea: otherText,
    counter: charCount,
    onChange: refreshContinue,
  });

  yesNoRadios.forEach((r) => r.addEventListener("change", syncLocationSection));
  locationCheckboxes.forEach((cb) =>
    cb.addEventListener("change", refreshContinue),
  );

  syncLocationSection();

  continueBtn.addEventListener("click", () => {
    const hasWeakness = selectedRadio() || null;

    const selected =
      hasWeakness === "yes"
        ? Array.from(locationCheckboxes)
            .filter((cb) => cb.checked)
            .map((cb) => cb.value)
        : [hasWeakness];

    const description = otherText.value.trim();

    setModalityAnswer("motor", { selected, description, hasWeakness });
    addSelectedModality("motor");

    flowRunner.goNext("motor-aura");
  });
});
