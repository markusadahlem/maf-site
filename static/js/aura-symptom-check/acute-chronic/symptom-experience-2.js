document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("symptomExperienceForm");
  const continueBtn = document.getElementById("symptomExperienceContinueBtn");

  // Show button when selection is made
  form.addEventListener("change", () => {
    const selected = form.querySelector(
      'input[name="symptomExperience"]:checked',
    );
    continueBtn.style.display = selected ? "inline-block" : "none";
  });

  continueBtn.addEventListener("click", () => {
    const selected = form.querySelector(
      'input[name="symptomExperience"]:checked',
    );
    if (!selected) return;

    // Retrieve existing data from localStorage
    let acuteChronicAnswers = JSON.parse(
      localStorage.getItem("acuteChronicAnswers") || "{}",
    );

    // Update the specific key with the new value
    acuteChronicAnswers.symptomExperience = selected.value;

    // Save updated data to localStorage
    localStorage.setItem(
      "acuteChronicAnswers",
      JSON.stringify(acuteChronicAnswers),
    );

    // Debugging: Log the saved data
    console.log("Saved acuteChronicAnswers data:", acuteChronicAnswers);

    // Navigate to the next page
    window.location.href = "/aura-symptom-check/acute-chronic/onset-window";
  });
});
