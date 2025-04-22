document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("onsetWindowForm");
  const continueBtn = document.getElementById("nextOnsetBtn");

  // Enable button only if one option is selected
  form.addEventListener("change", () => {
    const selected = form.querySelector('input[name="onsetWindow"]:checked');
    continueBtn.style.display = selected ? "inline-block" : "none";
  });

  continueBtn.addEventListener("click", () => {
    const selected = form.querySelector('input[name="onsetWindow"]:checked');
    if (!selected) return;

    const data = JSON.parse(
      localStorage.getItem("acuteChronicAnswers") || "{}",
    );
    data.onsetWindow = selected.value;
    localStorage.setItem("acuteChronicAnswers", JSON.stringify(data));

    window.location.href =
      "/aura-symptom-check/acute-chronic/symptom-progression/";
  });
});
