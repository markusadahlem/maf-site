document.addEventListener("DOMContentLoaded", () => {
  const otherInput = document.getElementById("sensoryOtherText");
  const charCountDisplay = document.getElementById("sensoryCharCount");

  if (otherInput && charCountDisplay) {
    otherInput.addEventListener("input", () => {
      const length = otherInput.value.length;

      // Show label when user starts typing
      if (length > 0) {
        charCountDisplay.style.display = "block";
      } else {
        charCountDisplay.style.display = "none";
      }

      charCountDisplay.textContent = `${length} / 80 characters`;
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("sensoryAuraForm");
  const nextBtn = document.getElementById("nextSensoryBtn");

  const otherCheckbox = form.querySelector('input[value="other"]');
  const otherLabel = document.getElementById("sensoryOtherLabel");
  const otherTextarea = document.getElementById("sensoryOtherText");

  function toggleOtherField() {
    const show = otherCheckbox.checked;
    otherLabel.style.display = show ? "block" : "none";
    otherTextarea.style.display = show ? "block" : "none";
  }

  // 👇 Initial state on page load
  toggleOtherField();

  otherCheckbox.addEventListener("change", toggleOtherField);

  nextBtn.addEventListener("click", () => {
    const checked = Array.from(
      form.querySelectorAll('input[name="sensorySymptom"]:checked'),
    ).map((cb) => cb.value);

    const otherText = otherTextarea.value.trim();

    const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
    data.sensory = {
      selected: checked,
      description: otherText,
    };
    localStorage.setItem("criterionBAnswers", JSON.stringify(data));

    const currentModalities = JSON.parse(
      localStorage.getItem("selectedModalities") || "[]",
    );
    if (!currentModalities.includes("sensory")) {
      currentModalities.push("sensory");
      localStorage.setItem(
        "selectedModalities",
        JSON.stringify(currentModalities),
      );
    }

    window.location.href = "/aura-symptom-check/modality/speech-aura/";
  });
});
