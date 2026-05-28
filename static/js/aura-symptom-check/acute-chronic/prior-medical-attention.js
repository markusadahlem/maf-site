import { flowRunner, store, MODULE_ID } from "/js/modules/aura-symptom-check/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("priorMedicalForm");
  const nextBtn = document.getElementById("priorMedicalContinueBtn");

  // 🔒 Initially hide the continue button
  nextBtn.style.display = "none";

  // 👂 Show button when an answer is selected
  form.addEventListener("change", () => {
    const selected = form.querySelector('input[name="priorMedical"]:checked');
    nextBtn.style.display = selected ? "inline-block" : "none";
  });

  // ✅ Save and continue
  nextBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="priorMedical"]:checked');
    if (!selected) {
      alert("Please select an answer.");
      return;
    }

    const data = store.get(MODULE_ID, "acuteChronicAnswers") || {};
    data.priorMedical = selected.value;
    store.set(MODULE_ID, "acuteChronicAnswers", data);

    flowRunner.goNext("prior-medical-attention");
  });
});
