document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("visualAuraForm");
  const otherBox = form.querySelector('input[value="other"]');
  const otherWrapper = document.getElementById("visualOtherWrapper");
  const otherText = document.getElementById("visualOtherText");
  const charCount = document.getElementById("visualCharCount");
  const noneBox = form.querySelector('input[value="none"]');
  const nextBtn = document.getElementById("nextVisualBtn");
  const allBoxes = form.querySelectorAll('input[name="visualSymptom"]');

  // 👉 Toggle textarea + "None" visibility
  otherBox.addEventListener("change", () => {
    const show = otherBox.checked;
    otherWrapper.style.display = show ? "block" : "none";
    charCount.style.display = show ? "block" : "none";

    if (show) {
      noneBox.checked = false;
      noneBox.parentElement.style.display = "none";
    } else {
      noneBox.parentElement.style.display = "block";
    }

    updateContinueVisibility();
  });

  // 👉 Character counter
  otherText.addEventListener("input", () => {
    charCount.textContent = `${otherText.value.length} / 80 characters`;
  });

  // 👉 Exclusive selection logic for "None"
  allBoxes.forEach((box) => {
    box.addEventListener("change", () => {
      if (box.value === "none" && box.checked) {
        allBoxes.forEach((cb) => {
          if (cb !== box) cb.checked = false;
        });
        otherWrapper.style.display = "none";
        otherText.value = "";
        charCount.style.display = "none";
      } else if (box.value !== "none" && box.checked) {
        noneBox.checked = false;
      }

      updateContinueVisibility();
    });
  });

  // 👉 Show/hide Continue button depending on selection
  function updateContinueVisibility() {
    const isAnyChecked = Array.from(allBoxes).some((cb) => cb.checked);
    nextBtn.style.display = isAnyChecked ? "inline-block" : "none";
  }

  // 👉 Save and continue
  nextBtn.addEventListener("click", () => {
    const selected = Array.from(
      form.querySelectorAll('input[name="visualSymptom"]:checked'),
    ).map((cb) => cb.value);

    const otherDesc = otherBox.checked ? otherText.value.trim() : "";

    const visualAura = {
      symptoms: selected,
      otherDescription: otherDesc,
    };

    localStorage.setItem("visualAura", JSON.stringify(visualAura));

    const currentModalities = JSON.parse(
      localStorage.getItem("selectedModalities") || "[]",
    );
    if (!currentModalities.includes("visual")) {
      currentModalities.push("visual");
    }
    localStorage.setItem(
      "selectedModalities",
      JSON.stringify(currentModalities),
    );

    const allAnswers = JSON.parse(
      localStorage.getItem("criterionBAnswers") || "{}",
    );
    allAnswers.visual = visualAura;
    localStorage.setItem("criterionBAnswers", JSON.stringify(allAnswers));

    window.location.href = "/aura-symptom-check/modality/retinal-aura/";
  });

  // ✅ Initial state setup
  if (otherBox.checked) {
    noneBox.parentElement.style.display = "none";
    otherWrapper.style.display = "block";
    charCount.style.display = "block";
  }

  updateContinueVisibility();
});
