document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("onsetWindowForm");
  const continueBtn = document.getElementById("nextOnsetBtn");
  const backBtn = document.getElementById("backBtn");
  const inconsistencyNote = document.getElementById("inconsistencyNote");

  // Enable button only if one option is selected
  form.addEventListener("change", () => {
    const selected = form.querySelector('input[name="onsetWindow"]:checked');
    if (selected) {
      continueBtn.style.display = "inline-block";
    } else {
      continueBtn.style.display = "none";
    }

    // Check for inconsistency and show/hide the back button
    const previousData = JSON.parse(
      localStorage.getItem("acuteChronicAnswers") || "{}",
    );
    console.log("Previous Data:", previousData); // Debugging line

    if (
      selected &&
      selected.value === "acute-chronic-C1" &&
      previousData.symptomExperience === "acute-chronic-B3"
    ) {
      inconsistencyNote.style.display = "block";
      backBtn.style.display = "inline-block";
    } else {
      inconsistencyNote.style.display = "none";
      backBtn.style.display = "none";
    }
  });

  continueBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="onsetWindow"]:checked');
    if (!selected) return;

    let data = JSON.parse(localStorage.getItem("acuteChronicAnswers") || "{}");
    data.onsetWindow = selected.value;
    localStorage.setItem("acuteChronicAnswers", JSON.stringify(data));

    window.location.href =
      "/aura-symptom-check/acute-chronic/symptom-progression/";
  });

  backBtn.addEventListener("click", () => {
    // Navigate to the previous page or section
    window.location.href =
      "/aura-symptom-check/acute-chronic/symptom-experience/";
  });
});
