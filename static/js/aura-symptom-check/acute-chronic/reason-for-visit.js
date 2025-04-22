document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reasonForm");
  const continueBtn = document.getElementById("reasonContinueBtn");

  // Show button when selection is made
  form.addEventListener("change", () => {
    const selected = form.querySelector('input[name="reason"]:checked');
    continueBtn.style.display = selected ? "inline-block" : "none";
  });

  continueBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="reason"]:checked');
    if (!selected) return;

    // Save to localStorage
    const data = JSON.parse(localStorage.getItem("acuteChronic") || "{}");
    data.reason = selected.value;
    localStorage.setItem("acuteChronic", JSON.stringify(data));

    // Navigate to different pages based on the selected radio button
    switch (selected.value) {
      case "acute-chronic-A1":
        window.location.href =
          "/aura-symptom-check/acute-chronic/symptom-experience-1";
        break;
      case "acute-chronic-A2":
        window.location.href =
          "/aura-symptom-check/acute-chronic/symptom-experience-2";
        break;
      case "acute-chronic-A3":
        window.location.href =
          "/aura-symptom-check/acute-chronic/symptom-progression";
        break;
      case "acute-chronic-A4":
        window.location.href =
          "/aura-symptom-check/acute-chronic/symptom-progression";
        break;
      case "acute-chronic-A5":
        window.location.href =
          "/aura-symptom-check/acute-chronic/symptom-progression";
        break;
      default:
        window.location.href =
          "/aura-symptom-check/acute-chronic/something-went-wrong";
    }
  });
});
