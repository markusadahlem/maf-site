document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("symptomProgressionForm");
  const continueBtn = document.getElementById("nextProgressionBtn");

  form.addEventListener("change", () => {
    const selected = form.querySelector(
      'input[name="symptomProgression"]:checked',
    );
    continueBtn.style.display = selected ? "inline-block" : "none";
  });

  continueBtn.addEventListener("click", () => {
    const selected = form.querySelector(
      'input[name="symptomProgression"]:checked',
    );
    if (!selected) return;

    const data = JSON.parse(
      localStorage.getItem("acuteChronicAnswers") || "{}",
    );
    data.symptomProgression = selected.value;
    localStorage.setItem("acuteChronicAnswers", JSON.stringify(data));

    window.location.href = "/aura-symptom-check/impact-on-daily-life/";
  });
});
