document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("symptomExperienceForm");
  const continueBtn = document.getElementById("onsetContinueBtn");

  // Enable button on selection
  form.addEventListener("change", () => {
    const selected = form.querySelector('input[name="onset"]:checked');
    continueBtn.style.display = selected ? "inline-block" : "none";
  });

  continueBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="onset"]:checked');
    if (!selected) return;

    // Save to localStorage under "acuteChronic"
    const data = JSON.parse(localStorage.getItem("acuteChronic") || "{}");
    data.onset = selected.value;
    localStorage.setItem("acuteChronic", JSON.stringify(data));

    // Navigate to next step
    window.location.href = "/aura-symptom-check/acute-chronic/onset-window/";
  });
});
