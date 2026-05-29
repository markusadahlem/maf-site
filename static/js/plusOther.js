import { store, MODULE_ID } from "/js/modules/aura-symptom-check/index.js";
import { langURL } from "/js/decision-flow/i18n.js";

document.addEventListener("DOMContentLoaded", async () => {
  const modalities = store.get(MODULE_ID, "selectedModalities") || [];

  const typical = modalities.filter((m) =>
    ["visual", "sensory", "speech", "motor", "brainstem", "retinal"].includes(
      m,
    ),
  );

  document.getElementById("selectedTypical").textContent =
    typical.join(", ") || "[none]";

  const btn = document.getElementById("generatePdfBtn");

  btn.addEventListener("click", () => {
    const otherText = document.getElementById("otherDescription").value;

    store.set(MODULE_ID, "selectedModalities", [...typical, "other"]);
    store.set(MODULE_ID, "otherDescription", otherText);

    window.location.href = langURL("/aura-symptom-check/aura-characteristics/");
  });
});
