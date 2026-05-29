<h2>{{< t "flow.report.page.otherDescribe.heading" >}}</h2>
<p>{{< t "flow.report.page.otherDescribe.promptShort" >}}</p>

<button id="generatePdfBtn" class="btn"></button>

<!-- JS Dependencies -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script type="module" src="/js/generateAuraReport.js?v=3"></script>

<script type="module">
  import { store, MODULE_ID } from "/js/modules/aura-symptom-check/index.js";
  import { t } from "/js/decision-flow/i18n.js";

  const btn = document.getElementById("generatePdfBtn");
  btn.textContent = t("flow.report.button.downloadAuraPdf", "Download Aura Report (PDF)");

  btn.addEventListener("click", async () => {
    const userInfo = store.get(MODULE_ID, "userInfo") || {};
    const selectedModalities = store.get(MODULE_ID, "selectedModalities") || [];
    const acuteChronicData = store.get(MODULE_ID, "acuteChronic") || {};
    const acuteChronicAnswers = store.get(MODULE_ID, "acuteChronicAnswers") || {};
    const auraCharacteristicsAnswers = store.get(MODULE_ID, "auraCharacteristicsAnswers") || [];
    const criterionBAnswers = store.get(MODULE_ID, "criterionBAnswers") || {};

    if (!userInfo || !selectedModalities || !acuteChronicData || !acuteChronicAnswers || !auraCharacteristicsAnswers || !criterionBAnswers) {
      alert(t("flow.report.alert.missingData", "Missing data! Please check your localStorage."));
      return;
    }

    const data = {
      modalities: selectedModalities,
      userInfo,
      acuteChronicData,
      acuteChronicAnswers,
      auraCharacteristicsAnswers,
      criterionBAnswers,
    };

    await window.generateAuraReport(data);
  });
</script>


<style>
  .btn {
    margin-top: 1rem;
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
  }

  .btn:hover {
    background-color: #0056b3;
  }
</style>
