document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("startForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent full-page reload

    const name = document.getElementById("name").value.trim();
    const gender = document.getElementById("gender").value;
    const diagnosisYear = parseInt(
      document.getElementById("diagnosisYear").value,
      10,
    );
    const headacheDays = parseInt(
      document.getElementById("headacheDays").value,
      10,
    );

    if (!name || !gender || isNaN(diagnosisYear) || isNaN(headacheDays)) {
      alert("Please fill in all fields.");
      return;
    }

    if (diagnosisYear < 1900 || diagnosisYear > 2025) {
      alert("Please enter a valid year between 1900 and 2025.");
      return;
    }

    if (headacheDays < 0 || headacheDays > 31) {
      alert("Please enter a valid number of headache days (0–31).");
      return;
    }

    // ✅ Store data
    localStorage.setItem(
      "userInfo",
      JSON.stringify({ name, gender, diagnosisYear, headacheDays }),
    );

    // ▶️ Navigate to next step
    window.location.href = "/aura-symptom-check/modality/visual-aura/";
  });
});
