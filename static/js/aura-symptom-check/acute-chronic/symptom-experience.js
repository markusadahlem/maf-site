document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("symptomExperienceForm");
  const nextBtn = document.getElementById("symptomExperienceContinueBtn");

  // 🔒 Hide button initially
  nextBtn.style.display = "none";

  // 👂 Show button when an option is selected
  form.addEventListener("change", () => {
    const selected = form.querySelector(
      'input[name="symptomExperience"]:checked',
    );
    nextBtn.style.display = selected ? "inline-block" : "none";
  });

  // ✅ Save answer and continue
  nextBtn.addEventListener("click", () => {
    const selected = form.querySelector(
      'input[name="symptomExperience"]:checked',
    );
    if (!selected) {
      alert("Please select an answer.");
      return;
    }

    const data = JSON.parse(
      localStorage.getItem("acuteChronicAnswers") || "{}",
    );
    data.symptomExperience = selected.value;
    localStorage.setItem("acuteChronicAnswers", JSON.stringify(data));

    // ▶️ Go to next step
    window.location.href = "/aura-symptom-check/acute-chronic/onset-window/";
  });
});
