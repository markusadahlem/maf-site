document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("onsetWindowForm");
  const continueBtn = document.getElementById("nextOnsetBtn");
  const backBtn = document.getElementById("backBtn");
  const optionC1 = document.getElementById("optionC1");

  // Check for inconsistency and hide the option if necessary
  const previousData = JSON.parse(
    localStorage.getItem("acuteChronicAnswers") || "{}",
  );
  console.log("Previous Data:", previousData); // Debugging line

  if (previousData.symptomExperience === "acute-chronic-B3") {
    optionC1.style.display = "none";
  }

  // Enable button only if one option is selected
  form.addEventListener("change", () => {
    const selected = form.querySelector('input[name="onsetWindow"]:checked');
    if (selected) {
      continueBtn.style.display = "inline-block";
    } else {
      continueBtn.style.display = "none";
    }

    // Show the back button if the critical option is selected
    if (selected && selected.value === "acute-chronic-C1") {
      backBtn.style.display = "inline-block";
    } else {
      backBtn.style.display = "none";
    }
  });

  continueBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="onsetWindow"]:checked');
    if (!selected) return;

    let data = JSON.parse(localStorage.getItem("acuteChronicAnswers") || "{}");
    data.onsetWindow = selected.value;
    localStorage.setItem("acuteChronicAnswers", JSON.stringify(data));

    // Update the navigation link based on the user's path
    const acuteChronicData = JSON.parse(
      localStorage.getItem("acuteChronic") || "{}",
    );
    const reason = acuteChronicData.reason;

    let nextPage = "";
    switch (reason) {
      case "acute-chronic-A1":
      case "acute-chronic-A2":
        nextPage = "/aura-symptom-check/acute-chronic/symptom-progression/";
        break;
      case "acute-chronic-A3":
      case "acute-chronic-A4":
      case "acute-chronic-A5":
        nextPage = "/aura-symptom-check/acute-chronic/this-cannot-happen/";
        break;
      default:
        nextPage = "/aura-symptom-check/acute-chronic/this-cannot-happen/";
    }

    window.location.href = nextPage;
  });

  backBtn.addEventListener("click", () => {
    // Navigate to the previous page or section
    window.location.href =
      "/aura-symptom-check/acute-chronic/symptom-experience/";
  });
});
