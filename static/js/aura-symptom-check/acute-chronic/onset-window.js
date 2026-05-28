import { flowRunner, store, MODULE_ID } from "/js/modules/aura-symptom-check/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("onsetWindowForm");
  const continueBtn = document.getElementById("nextOnsetBtn");
  const backBtn = document.getElementById("backBtn");
  const optionC1 = document.getElementById("optionC1");

  const previousData = store.get(MODULE_ID, "acuteChronicAnswers") || {};

  if (previousData.symptomExperience === "acute-chronic-B3") {
    optionC1.style.display = "none";
  }

  form.addEventListener("change", () => {
    const selected = form.querySelector('input[name="onsetWindow"]:checked');
    continueBtn.style.display = selected ? "inline-block" : "none";
    backBtn.style.display =
      selected && selected.value === "acute-chronic-C1" ? "inline-block" : "none";
  });

  continueBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="onsetWindow"]:checked');
    if (!selected) return;

    const data = store.get(MODULE_ID, "acuteChronicAnswers") || {};
    data.onsetWindow = selected.value;
    store.set(MODULE_ID, "acuteChronicAnswers", data);

    flowRunner.goNext("onset-window");
  });

  backBtn.addEventListener("click", () => {
    window.history.back();
  });
});
