import { flowRunner, store, MODULE_ID } from "/js/modules/aura-symptom-check/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("symptomExperienceForm");
  const continueBtn = document.getElementById("symptomExperienceContinueBtn");

  // Show button when selection is made
  form.addEventListener("change", () => {
    const selected = form.querySelector(
      'input[name="symptomExperience"]:checked',
    );
    continueBtn.style.display = selected ? "inline-block" : "none";
  });

  continueBtn.addEventListener("click", () => {
    const selected = form.querySelector(
      'input[name="symptomExperience"]:checked',
    );
    if (!selected) return;

    const acuteChronicAnswers = store.get(MODULE_ID, "acuteChronicAnswers") || {};
    acuteChronicAnswers.symptomExperience = selected.value;
    store.set(MODULE_ID, "acuteChronicAnswers", acuteChronicAnswers);

    flowRunner.goNext("symptom-experience-2");
  });
});
