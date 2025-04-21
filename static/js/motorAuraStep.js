document.addEventListener("DOMContentLoaded", () => {
  const yesNoRadios = document.querySelectorAll('input[name="motor-weakness"]');
  const checkboxes = document.querySelectorAll('input[name="motor-location"]');
  const otherText = document.getElementById("motor-other");
  const continueBtn = document.getElementById("continueBtn");

  function saveResponses() {
    const hasWeakness =
      Array.from(yesNoRadios).find((r) => r.checked)?.value || null;

    const selectedLocations = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    const other = otherText?.value.trim() || "";

    // ✅ Save to unified format
    const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
    data.motor = {
      selected: selectedLocations,
      description: other,
      hasWeakness,
    };
    localStorage.setItem("criterionBAnswers", JSON.stringify(data));

    // ✅ Also update selectedModalities
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

    // (Optional) Keep old motorAura object if you want
    localStorage.setItem(
      "motorAura",
      JSON.stringify({
        hasWeakness,
        selectedLocations,
        other,
      }),
    );
  }

  yesNoRadios.forEach((r) => r.addEventListener("change", saveResponses));
  checkboxes.forEach((cb) => cb.addEventListener("change", saveResponses));
  if (otherText) otherText.addEventListener("input", saveResponses);

  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      saveResponses();
      window.location.href = "/aura-symptom-check/modality/brainstem-aura/";
    });
  }
});
