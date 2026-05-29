import { flowRunner, store, MODULE_ID } from "/js/modules/aura-symptom-check/index.js";
import { t } from "/js/decision-flow/i18n.js";

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
      alert(t("flow.alerts.fillAllFields"));
      return;
    }

    if (diagnosisYear < 1900 || diagnosisYear > 2025) {
      alert(t("flow.alerts.yearRange"));
      return;
    }

    if (headacheDays < 0 || headacheDays > 31) {
      alert(t("flow.alerts.daysRange"));
      return;
    }

    store.set(MODULE_ID, "userInfo", { name, gender, diagnosisYear, headacheDays });

    // ▶️ Navigate to next step
    flowRunner.goNext("demographic-information");
  });
});
