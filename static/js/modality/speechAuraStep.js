document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("speechAuraForm");
  const nextBtn = document.getElementById("nextSpeechBtn");

  const checkboxes = form.querySelectorAll('input[name="speechSymptom"]');
  const otherCheckbox = form.querySelector('input[value="other"]');
  const noneCheckbox = form.querySelector('input[value="none"]');

  const otherText = document.getElementById("speechOtherText");
  const charCount = document.getElementById("speechCharCount");
  const otherLabel = document.getElementById("speechTextLabel");

  // Initial visibility
  otherText.style.display = "none";
  charCount.style.display = "none";
  otherLabel.style.display = "none";

  function toggleOtherFields() {
    const show = otherCheckbox.checked;
    otherText.style.display = show ? "block" : "none";
    otherLabel.style.display = show ? "block" : "none";
    charCount.style.display = show ? "block" : "none";
    noneCheckbox.parentElement.style.display = show ? "none" : "block";

    if (!show) {
      otherText.value = "";
      charCount.textContent = "0 / 80 characters";
      charCount.style.display = "none";
    }
  }

  function updateContinueButton() {
    const anyChecked = Array.from(checkboxes).some((cb) => cb.checked);
    nextBtn.style.display = anyChecked ? "inline-block" : "none";
  }

  checkboxes.forEach((cb) =>
    cb.addEventListener("change", () => {
      if (cb.value === "none" && cb.checked) {
        checkboxes.forEach((el) => {
          if (el !== cb) el.checked = false;
        });
      } else if (cb.value !== "none" && cb.checked) {
        noneCheckbox.checked = false;
      }

      toggleOtherFields();
      updateContinueButton();
    }),
  );

  otherText.addEventListener("input", () => {
    const len = otherText.value.length;
    charCount.textContent = `${len} / 80 characters`;
  });

  // Initial state
  toggleOtherFields();
  updateContinueButton();

  nextBtn.addEventListener("click", () => {
    const checked = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    const otherTextValue =
      otherCheckbox.checked && otherText.value.trim()
        ? otherText.value.trim()
        : "";

    const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
    data.speech = {
      selected: checked,
      description: otherTextValue,
    };
    localStorage.setItem("criterionBAnswers", JSON.stringify(data));

    const currentModalities = JSON.parse(
      localStorage.getItem("selectedModalities") || "[]",
    );
    if (!currentModalities.includes("speech")) {
      currentModalities.push("speech");
      localStorage.setItem(
        "selectedModalities",
        JSON.stringify(currentModalities),
      );
    }

    window.location.href = "/aura-symptom-check/modality/motor-aura/";
  });
});
