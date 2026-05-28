import { flowRunner, store, MODULE_ID } from "/js/modules/aura-symptom-check/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("impactForm");
  const nextBtn = document.getElementById("impactContinueBtn");

  // 🔒 Hide button initially
  nextBtn.style.display = "none";

  // 👂 Show button when a radio option is selected
  form.addEventListener("change", () => {
    const selected = form.querySelector('input[name="impact"]:checked');
    nextBtn.style.display = selected ? "inline-block" : "none";
  });

  nextBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="impact"]:checked');
    if (!selected) return;

    const data = store.get(MODULE_ID, "acuteChronicAnswers") || {};
    data.impact = selected.value;
    store.set(MODULE_ID, "acuteChronicAnswers", data);

    flowRunner.goNext("impact-on-daily-life");
  });
});
