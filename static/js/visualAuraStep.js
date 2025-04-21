document.addEventListener("DOMContentLoaded", () => {
  const otherInput = document.getElementById("visualOtherText");
  const charCountDisplay = document.getElementById("visualCharCount");

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
  const form = document.getElementById("visualAuraForm");
  const otherBox = form.querySelector('input[value="other"]');
  const otherWrapper = document.getElementById("visualOtherWrapper");
  const otherText = document.getElementById("visualOtherText");
  const charCount = document.getElementById("visualCharCount");
  const nextBtn = document.getElementById("nextVisualBtn");

  if (otherBox) {
    otherBox.addEventListener("change", () => {
      otherWrapper.style.display = otherBox.checked ? "block" : "none";
      if (!otherBox.checked) {
        charCount.style.display = "none";
        otherText.value = "";
      }
    });
  }

  if (otherText && charCount) {
    otherText.addEventListener("input", () => {
      const len = otherText.value.length;
      charCount.style.display = len > 0 ? "block" : "none";
      charCount.textContent = `${len} / 80 characters`;
    });
  }

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
});
