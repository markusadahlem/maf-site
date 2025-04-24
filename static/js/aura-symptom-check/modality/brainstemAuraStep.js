document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("brainstemAuraForm");

  const checkboxes = form.querySelectorAll('input[name="brainstemSymptoms"]');
  const otherBox = form.querySelector('input[value="other"]');
  const noneBox = form.querySelector('input[value="none"]');

  const otherText = document.getElementById("brainstemOtherText");
  const otherLabel = document.getElementById("brainstemOtherTextLabel");
  const charCount = document.getElementById("brainstemCharCount");
  const nextBtn = document.getElementById("nextBrainstemBtn");

  // Show/hide "Other" textarea and toggle visibility of "None"
  function toggleOtherField() {
    const show = otherBox.checked;

    otherText.style.display = show ? "block" : "none";
    otherLabel.style.display = show ? "block" : "none";
    charCount.style.display =
      show && otherText.value.length > 0 ? "block" : "none";

    // Only hide "none" if "other" is selected
    noneBox.parentElement.style.display = show ? "none" : "block";
    if (show) noneBox.checked = false;
  }

  // Live character count
  otherText.addEventListener("input", () => {
    const len = otherText.value.length;
    charCount.textContent = `${len} / 80 characters`;
    charCount.style.display = len > 0 ? "block" : "none";
  });

  // Checkbox change logic
  checkboxes.forEach((cb) =>
    cb.addEventListener("change", () => {
      if (cb.value === "none" && cb.checked) {
        // Deselect all other checkboxes
        checkboxes.forEach((el) => {
          if (el !== cb) el.checked = false;
        });
        toggleOtherField();
      } else if (cb.value !== "none" && cb.checked) {
        noneBox.checked = false;
        toggleOtherField();
      } else if (cb === otherBox && !cb.checked) {
        toggleOtherField(); // specifically handle unchecking "other"
      }

      updateContinueButton();
    }),
  );

  function updateContinueButton() {
    const anyChecked = Array.from(checkboxes).some((cb) => cb.checked);
    nextBtn.style.display = anyChecked ? "inline-block" : "none";
  }

  nextBtn.addEventListener("click", () => {
    const selected = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    const otherDesc = otherBox.checked ? otherText.value.trim() : "";

    const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
    data.brainstem = {
      selected,
      description: otherDesc,
    };
    localStorage.setItem("criterionBAnswers", JSON.stringify(data));

    const currentModalities = JSON.parse(
      localStorage.getItem("selectedModalities") || "[]",
    );
    if (!currentModalities.includes("brainstem")) {
      currentModalities.push("brainstem");
      localStorage.setItem(
        "selectedModalities",
        JSON.stringify(currentModalities),
      );
    }

    window.location.href = "/aura-symptom-check/aura-characteristics/";
  });

  // On load
  toggleOtherField();
  updateContinueButton();
});
