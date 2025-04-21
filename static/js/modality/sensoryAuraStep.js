document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("sensoryAuraForm");
  const nextBtn = document.getElementById("nextSensoryBtn");

  const checkboxes = form.querySelectorAll('input[name="sensorySymptom"]');
  const otherCheckbox = form.querySelector('input[value="other"]');
  const noneCheckbox = form.querySelector('input[value="none"]');

  const otherLabel = document.getElementById("sensoryOtherLabel");
  const otherTextarea = document.getElementById("sensoryOtherText");
  const charCountDisplay = document.getElementById("sensoryCharCount");

  function toggleOtherField() {
    const show = otherCheckbox.checked;
    otherLabel.style.display = show ? "block" : "none";
    otherTextarea.style.display = show ? "block" : "none";
    noneCheckbox.parentElement.style.display = show ? "none" : "block";

    if (!show) {
      otherTextarea.value = "";
      charCountDisplay.style.display = "none";
    }
  }

  otherTextarea.addEventListener("input", () => {
    const len = otherTextarea.value.length;
    charCountDisplay.style.display = len > 0 ? "block" : "none";
    charCountDisplay.textContent = `${len} / 80 characters`;
  });

  checkboxes.forEach((cb) =>
    cb.addEventListener("change", () => {
      if (cb.value === "none" && cb.checked) {
        // If "none" is selected, uncheck all others
        checkboxes.forEach((el) => {
          if (el !== cb) el.checked = false;
        });
      } else if (cb.value !== "none" && cb.checked) {
        // If any other is selected, uncheck "none"
        noneCheckbox.checked = false;
      }

      toggleOtherField();
      updateContinueButton();
    }),
  );

  function updateContinueButton() {
    const isAnyChecked = Array.from(checkboxes).some((cb) => cb.checked);
    nextBtn.style.display = isAnyChecked ? "inline-block" : "none";
  }

  // Initialize state
  toggleOtherField();
  updateContinueButton();

  nextBtn.addEventListener("click", () => {
    const selected = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    const otherText = otherTextarea.value.trim();

    const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
    data.sensory = {
      selected,
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
