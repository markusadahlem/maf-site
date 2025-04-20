document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("retinalAuraForm");
  const nextBtn = document.getElementById("nextRetinalBtn");

  nextBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="retinalAura"]:checked');

    if (!selected) {
      alert("Please select an answer.");
      return;
    }

    // ✅ Store answer in unified structure
    const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
    data.retinal = {
      selected: [selected.value],
      description: "", // Not applicable for this step
    };
    localStorage.setItem("criterionBAnswers", JSON.stringify(data));

    // ✅ Update selectedModalities
    const currentModalities = JSON.parse(
      localStorage.getItem("selectedModalities") || "[]",
    );
    if (!currentModalities.includes("retinal")) {
      currentModalities.push("retinal");
      localStorage.setItem(
        "selectedModalities",
        JSON.stringify(currentModalities),
      );
    }

    // ▶️ Navigate to next step
    window.location.href = "/aura-symptom-check/sensory-aura/";
  });
});
