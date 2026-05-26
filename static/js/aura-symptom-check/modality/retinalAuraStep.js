import {
  setModalityAnswer,
  addSelectedModality,
} from "/js/aura-symptom-check/lib/storage.js";
import { bindContinueButton } from "/js/aura-symptom-check/lib/form-controls.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("retinalAuraForm");
  const radios = form.querySelectorAll('input[name="retinalAura"]');
  const nextBtn = document.getElementById("nextRetinalBtn");

  const refreshContinue = bindContinueButton({
    button: nextBtn,
    isReady: () => !!form.querySelector('input[name="retinalAura"]:checked'),
  });

  radios.forEach((r) => r.addEventListener("change", refreshContinue));

  nextBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="retinalAura"]:checked');
    if (!selected) return;

    setModalityAnswer("retinal", {
      selected: [selected.value],
      description: "",
    });
    addSelectedModality("retinal");

    window.location.href = "/aura-symptom-check/modality/sensory-aura/";
  });
});
