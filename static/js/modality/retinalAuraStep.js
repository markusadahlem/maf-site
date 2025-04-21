document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("retinalAuraForm");
  const nextBtn = document.getElementById("nextRetinalBtn");
  const radios = form.querySelectorAll('input[name="retinalAura"]');

  function updateContinueVisibility() {
    const isSelected = form.querySelector('input[name="retinalAura"]:checked');
    nextBtn.style.display = isSelected ? "inline-block" : "none";
  }

  // Check on load in case of pre-selection
  updateContinueVisibility();

  // Add event listeners to all radio buttons
  radios.forEach((radio) =>
    radio.addEventListener("change", updateContinueVisibility),
  );

  nextBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="retinalAura"]:checked');

    if (!selected) {
      alert("Please select an answer.");
      return;
    }

    const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
    data.retinal = {
      selected: [selected.value],
      description: "",
    };
    localStorage.setItem("criterionBAnswers", JSON.stringify(data));

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

    window.location.href = "/aura-symptom-check/modality/sensory-aura/";
  });
});
