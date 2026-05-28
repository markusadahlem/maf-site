import { flowRunner, store, MODULE_ID } from "/js/modules/aura-symptom-check/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("symptomProgressionForm");
  const continueBtn = document.getElementById("nextProgressionBtn");

  form.addEventListener("change", () => {
    const selected = form.querySelector(
      'input[name="symptomProgression"]:checked',
    );
    continueBtn.style.display = selected ? "inline-block" : "none";
  });

  continueBtn.addEventListener("click", () => {
    const selected = form.querySelector(
      'input[name="symptomProgression"]:checked',
    );
    if (!selected) return;

    const data = store.get(MODULE_ID, "acuteChronicAnswers") || {};
    data.symptomProgression = selected.value;
    store.set(MODULE_ID, "acuteChronicAnswers", data);

    flowRunner.goNext("symptom-progression");
  });
});
