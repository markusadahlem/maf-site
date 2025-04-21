document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("brainstemAuraForm");
  const otherBox = form.querySelector(
    'input[name="brainstemSymptoms"][value="other"]',
  );
  const otherText = document.getElementById("brainstemOtherText");
  const otherLabel = document.getElementById("brainstemOtherTextLabel");
  const charCount = document.getElementById("brainstemCharCount");
  const nextBtn = document.getElementById("nextBrainstemBtn");

  otherBox.addEventListener("change", () => {
    const show = otherBox.checked;
    otherText.style.display = show ? "block" : "none";
    otherLabel.style.display = show ? "block" : "none";
    charCount.style.display = show ? "block" : "none";
  });

  otherText.addEventListener("input", () => {
    charCount.textContent = `${otherText.value.length} / 80 characters`;
  });

  nextBtn.addEventListener("click", () => {
    const checked = Array.from(
      form.querySelectorAll('input[name="brainstemSymptoms"]:checked'),
    ).map((cb) => cb.value);

    const otherDesc = otherBox.checked ? otherText.value.trim() : "";

    const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
    data.brainstem = {
      selected: checked,
      description: otherDesc,
    };
    localStorage.setItem("criterionBAnswers", JSON.stringify(data));

    const currentModalities = JSON.parse(
      localStorage.getItem("selectedModalities") || "[]",
    );
    if (!currentModalities.includes("brainstem")) {
      currentModalities.push("brainstem");
      localStorage.setItem(
        "selectedModalities",
        JSON.stringify(currentModalities),
      );
    }

    window.location.href = "/aura-symptom-check/modality-summary/";
  });
});
