import { flowRunner, store, MODULE_ID } from "/js/modules/aura-symptom-check/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reasonForm");
  const continueBtn = document.getElementById("reasonContinueBtn");

  // Show button when selection is made
  form.addEventListener("change", () => {
    const selected = form.querySelector('input[name="reason"]:checked');
    continueBtn.style.display = selected ? "inline-block" : "none";
  });

  continueBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="reason"]:checked');
    if (!selected) return;

    const data = store.get(MODULE_ID, "acuteChronic") || {};
    data.reason = selected.value;
    store.set(MODULE_ID, "acuteChronic", data);

    flowRunner.goNext("reason-for-visit");
  });
});
