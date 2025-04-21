document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("speechAuraForm");
  const nextBtn = document.getElementById("nextSpeechBtn");

  const otherCheckbox = form.querySelector('input[value="other"]');
  const otherText = document.getElementById("speechOtherText");
  const charCount = document.getElementById("speechCharCount");
  const otherLabel = document.getElementById("speechTextLabel");

  // Standardmäßig ausblenden
  otherText.style.display = "none";
  charCount.style.display = "none";
  otherLabel.style.display = "none";

  // Checkbox-Verhalten steuern
  otherCheckbox.addEventListener("change", () => {
    const show = otherCheckbox.checked;
    otherText.style.display = show ? "block" : "none";
    charCount.style.display = show ? "block" : "none";
    otherLabel.style.display = show ? "block" : "none";
  });

  // Zeichenzähler aktualisieren
  otherText.addEventListener("input", () => {
    const len = otherText.value.length;
    charCount.textContent = `${len} / 80 characters`;
  });

  nextBtn.addEventListener("click", () => {
    const checked = Array.from(
      form.querySelectorAll('input[name="speechSymptom"]:checked'),
    ).map((cb) => cb.value);

    const otherTextValue =
      otherCheckbox.checked && otherText.value.trim()
        ? otherText.value.trim()
        : "";

    // ✅ Save to unified object
    const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
    data.speech = {
      selected: checked,
      description: otherTextValue,
    };
    localStorage.setItem("criterionBAnswers", JSON.stringify(data));

    // ✅ Update selectedModalities
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

    // ▶️ Next step
    window.location.href = "/aura-symptom-check/modality/motor-aura/";
  });
});
