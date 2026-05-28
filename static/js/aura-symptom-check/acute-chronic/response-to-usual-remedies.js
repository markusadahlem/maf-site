import { flowRunner, store, MODULE_ID } from "/js/modules/aura-symptom-check/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("remediesForm");
  const nextBtn = document.getElementById("remediesContinueBtn");

  // 🔒 Hide continue button initially
  nextBtn.style.display = "none";

  // 👂 Show continue button once a selection is made
  form.addEventListener("change", () => {
    const selected = form.querySelector('input[name="remedies"]:checked');
    nextBtn.style.display = selected ? "inline-block" : "none";
  });

  nextBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="remedies"]:checked');
    if (!selected) {
      alert("Please select an answer.");
      return;
    }

    const data = store.get(MODULE_ID, "acuteChronicAnswers") || {};
    data.remedies = selected.value;
    store.set(MODULE_ID, "acuteChronicAnswers", data);

    // ▶️ Go to next step
    flowRunner.goNext("response-to-usual-remedies");
  });
});
