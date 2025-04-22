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

    // Navigate to next section
    window.location.href =
      "/aura-symptom-check/acute-chronic/symptom-experience/";
  });
});
