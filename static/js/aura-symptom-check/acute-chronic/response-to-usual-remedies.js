document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("remediesForm");
  const nextBtn = document.getElementById("remediesContinueBtn");

  // 🔒 Hide continue button initially
  nextBtn.style.display = "none";

  // 👂 Show continue button once a selection is made
  form.addEventListener("change", () => {
    const selected = form.querySelector('input[name="remedies"]:checked');
    nextBtn.style.display = selected ? "inline-block" : "none";
  });

  nextBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="remedies"]:checked');
    if (!selected) {
      alert("Please select an answer.");
      return;
    }

    const data = JSON.parse(
      localStorage.getItem("acuteChronicAnswers") || "{}",
    );
    data.remedies = selected.value;
    localStorage.setItem("acuteChronicAnswers", JSON.stringify(data));

    // ▶️ Go to next step
    window.location.href =
      "/aura-symptom-check/acute-chronic/prior-medical-attention/";
  });
});
