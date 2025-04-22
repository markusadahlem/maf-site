document.addEventListener("DOMContentLoaded", () => {
  const yesNoRadios = document.querySelectorAll('input[name="motor-weakness"]');
  const locationSection = document.getElementById("motorLocationsSection");

  const locationCheckboxes = document.querySelectorAll(
    'input[name="motor-location"]',
  );
  const otherCheckbox = document.querySelector(
    'input[name="motor-location"][value="Other"]',
  );
  const otherText = document.getElementById("motor-other");
  const otherLabel = document.getElementById("motorOtherLabel");
  const charCount = document.getElementById("motorCharCount");

  const continueBtn = document.getElementById("continueBtn");

  function updateVisibility() {
    const selected = Array.from(yesNoRadios).find((r) => r.checked)?.value;
    locationSection.style.display = selected === "yes" ? "block" : "none";

    updateContinueButton(); // Always recheck button visibility
  }

  function updateOtherField() {
    const show = otherCheckbox.checked;
    otherText.style.display = show ? "block" : "none";
    otherLabel.style.display = show ? "block" : "none";
    charCount.style.display =
      show && otherText.value.length > 0 ? "block" : "none";

    if (!show) {
      otherText.value = "";
      charCount.textContent = "0 / 80 characters";
    }
  }

  function updateCharCount() {
    charCount.textContent = `${otherText.value.length} / 80 characters`;
    charCount.style.display = otherText.value.length > 0 ? "block" : "none";
  }

  function updateContinueButton() {
    const selected = Array.from(yesNoRadios).find((r) => r.checked)?.value;

    if (selected === "yes") {
      const anyChecked = Array.from(locationCheckboxes).some(
        (cb) => cb.checked,
      );
      continueBtn.style.display = anyChecked ? "inline-block" : "none";
    } else if (selected === "no" || selected === "unsure") {
      continueBtn.style.display = "inline-block";
    } else {
      continueBtn.style.display = "none";
    }
  }

  // 👉 Event bindings
  yesNoRadios.forEach((r) => r.addEventListener("change", updateVisibility));
  locationCheckboxes.forEach((cb) =>
    cb.addEventListener("change", () => {
      updateOtherField();
      updateContinueButton();
    }),
  );

  if (otherText) {
    otherText.addEventListener("input", () => {
      updateCharCount();
      updateContinueButton();
    });
  }

  // Initial state on page load
  updateVisibility();
  updateOtherField();
  updateCharCount();

  continueBtn.addEventListener("click", () => {
    const hasWeakness =
      Array.from(yesNoRadios).find((r) => r.checked)?.value || null;

    let selectedLocations = [];

    if (hasWeakness === "yes") {
      selectedLocations = Array.from(locationCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);
    } else {
      selectedLocations = [hasWeakness]; // will be "no" or "unsure"
    }

    const other = otherText?.value.trim() || "";

    // ✅ Save to localStorage
    const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
    data.motor = {
      selected: selectedLocations,
      description: other,
      hasWeakness,
    };
    localStorage.setItem("criterionBAnswers", JSON.stringify(data));

    const currentModalities = JSON.parse(
      localStorage.getItem("selectedModalities") || "[]",
    );
    if (!currentModalities.includes("motor")) {
      currentModalities.push("motor");
      localStorage.setItem(
        "selectedModalities",
        JSON.stringify(currentModalities),
      );
    }

    window.location.href = "/aura-symptom-check/modality/brainstem-aura/";
  });
});
