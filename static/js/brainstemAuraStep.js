document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll(
    'input[name="brainstemSymptoms"]',
  );
  const textArea = document.getElementById("brainstemOtherDescription");
  const continueBtn = document.getElementById("continueBtn");

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      if (cb.value.includes("Other")) {
        textArea.style.display = cb.checked ? "block" : "none";
      }
    });
  });

  continueBtn.addEventListener("click", () => {
    const selected = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    const description = textArea?.value.trim() || "";

    const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
    data.brainstem = {
      selected,
      description,
    };
    localStorage.setItem("criterionBAnswers", JSON.stringify(data));

    const modalities = JSON.parse(
      localStorage.getItem("selectedModalities") || "[]",
    );
    if (!modalities.includes("brainstem")) {
      modalities.push("brainstem");
      localStorage.setItem("selectedModalities", JSON.stringify(modalities));
    }

    window.location.href = "/aura-symptom-check/modality-summary/";
  });
});
