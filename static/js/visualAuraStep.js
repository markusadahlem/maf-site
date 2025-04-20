document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("visualAuraForm");
  const otherBox = form.querySelector('input[value="other"]');
  const otherText = document.getElementById("visualOtherDescription");
  const nextBtn = document.getElementById("nextVisualBtn");

  otherBox.addEventListener("change", () => {
    otherText.style.display = otherBox.checked ? "block" : "none";
  });

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

    // Also merge into criterionBAnswers for summary page
    const allAnswers = JSON.parse(
      localStorage.getItem("criterionBAnswers") || "{}",
    );
    allAnswers.visual = visualAura;
    localStorage.setItem("criterionBAnswers", JSON.stringify(allAnswers));

    window.location.href = "/aura-symptom-check/retinal-aura/";
  });
});
