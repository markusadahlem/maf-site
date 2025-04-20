document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("speechAuraForm");
  const nextBtn = document.getElementById("nextSpeechBtn");

  const otherCheckbox = form.querySelector('input[value="other"]');
  const otherTextInput = document.getElementById("speechOtherText");

  if (otherCheckbox) {
    otherCheckbox.addEventListener("change", () => {
      otherTextInput.style.display = otherCheckbox.checked ? "block" : "none";
    });
  }

  nextBtn.addEventListener("click", () => {
    const checked = Array.from(
      form.querySelectorAll('input[name="speechSymptom"]:checked'),
    ).map((cb) => cb.value);

    const otherText =
      otherCheckbox && otherCheckbox.checked ? otherTextInput.value.trim() : "";

    const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
    data.speech = {
      selected: checked,
      description: otherText,
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

    window.location.href = "/aura-symptom-check/motor-aura/";
  });
});
