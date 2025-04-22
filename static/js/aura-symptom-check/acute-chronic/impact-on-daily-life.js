document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("impactForm");
  const nextBtn = document.getElementById("impactContinueBtn");

  // 🔒 Hide button initially
  nextBtn.style.display = "none";

  // 👂 Show button when a radio option is selected
  form.addEventListener("change", () => {
    const selected = form.querySelector('input[name="impact"]:checked');
    nextBtn.style.display = selected ? "inline-block" : "none";
  });

  nextBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="impact"]:checked');
    if (!selected) return;

    const data = JSON.parse(
      localStorage.getItem("acuteChronicAnswers") || "{}",
    );
    data.impact = selected.value;
    localStorage.setItem("acuteChronicAnswers", JSON.stringify(data));

    window.location.href =
      "/aura-symptom-check/acute-chronic/response-to-usual-remedies/";
  });
});
