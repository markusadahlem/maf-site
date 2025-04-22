document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("impactForm");
  const nextBtn = document.getElementById("impactContinueBtn");

  nextBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="impact"]:checked');
    if (!selected) {
      alert("Please select an answer.");
      return;
    }

    const data = JSON.parse(
      localStorage.getItem("acuteChronicAnswers") || "{}",
    );
    data.impact = selected.value;
    localStorage.setItem("acuteChronicAnswers", JSON.stringify(data));

    window.location.href = "/aura-symptom-check/response-to-usual-remedies";
  });
});
