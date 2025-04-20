document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("sensoryAuraForm");
  const nextBtn = document.getElementById("nextSensoryBtn");

  nextBtn.addEventListener("click", () => {
    const checked = Array.from(
      form.querySelectorAll('input[name="sensorySymptom"]:checked'),
    ).map((cb) => cb.value);

    const otherText = document.getElementById("sensoryOtherText").value.trim();

    // ✅ Save to unified object
    const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
    data.sensory = {
      selected: checked,
      description: otherText,
    };
    localStorage.setItem("criterionBAnswers", JSON.stringify(data));

    // ✅ Update selectedModalities
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

    // ▶️ Next step
    window.location.href = "/aura-symptom-check/speech-aura/";
  });
});
