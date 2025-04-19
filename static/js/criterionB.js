document.addEventListener("DOMContentLoaded", function () {
  const formB = document.getElementById("criterionBForm");
  const resultB = document.getElementById("resultB");
  const nextLinkB = document.getElementById("nextLinkB");

  const allBoxes = formB.querySelectorAll('input[name="symptom"]');

  allBoxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      const isNone = cb.value === "none";

      if (isNone && cb.checked) {
        allBoxes.forEach((other) => {
          if (other !== cb) other.checked = false;
        });
      } else if (!isNone && cb.checked) {
        const noneBox = formB.querySelector('input[value="none"]');
        noneBox.checked = false;
      }

      evaluateCriterionB();
    });
  });

  function evaluateCriterionB() {
    const selected = Array.from(allBoxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    localStorage.setItem("selectedModalities", JSON.stringify(selected));

    const hasCoreAura = selected.some((v) =>
      ["visual", "sensory", "speech", "motor", "brainstem", "retinal"].includes(
        v,
      ),
    );
    const hasOther = selected.includes("other");
    const hasNone = selected.includes("none");

    const onlyOther = selected.length === 1 && hasOther;
    const onlyNone = selected.length === 1 && hasNone;

    if (hasCoreAura && hasOther) {
      const queryParams = new URLSearchParams();
      selected.forEach((val) => queryParams.append("modality", val));

      resultB.textContent =
        "ℹ️ You selected a known aura modality along with an “Other” symptom. Let’s clarify the additional symptom to make sure it fits your aura experience.";
      resultB.style.color = "darkorange";

      nextLinkB.href =
        "/aura-symptom-check/plus-other-modality-summary/?" +
        queryParams.toString();
      nextLinkB.style.display = "inline-block";
      nextLinkB.textContent = "Clarify “Other” Symptoms";
    } else if (hasCoreAura) {
      resultB.textContent =
        "✅ Step 1 in progress. Select all that apply, then continue when you're ready.";
      resultB.style.color = "green";
      nextLinkB.href = "/aura-symptom-check/aura-characteristics/";
      nextLinkB.style.display = "inline-block";
      nextLinkB.textContent = "Next (Step 2): Describe Auras";
    } else if (onlyOther) {
      resultB.textContent = "ℹ️ Unclassified aura modality selected.";
      resultB.style.color = "darkorange";
      nextLinkB.href = "/aura-symptom-check/other-modality/";
      nextLinkB.style.display = "inline-block";
      nextLinkB.textContent = "Clarify Other Symptoms";
    } else if (onlyNone) {
      resultB.textContent = "❌ No aura symptoms reported.";
      resultB.style.color = "red";
      nextLinkB.href = "/aura-symptom-check/no-aura/";
      nextLinkB.style.display = "inline-block";
      nextLinkB.textContent = "Next: Continue Without Aura";
    } else {
      resultB.textContent = "";
      nextLinkB.style.display = "none";
    }
  }

  window.toggleExplanation = function (symptomKey) {
    const el = document.getElementById("explain-" + symptomKey);
    el.style.display = el.style.display === "block" ? "none" : "block";
  };
});
