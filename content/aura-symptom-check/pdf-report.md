<h2>Describe your other aura symptom</h2>
<p>You selected “Other” as your only aura symptom. Please describe what you experienced.</p>

<button id="generatePdfBtn" class="btn">Download Aura Report (PDF)</button>

<!-- JS Dependencies -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script type="module" src="/js/generateAuraReport.js?v=3"></script>

<script type="module">
  document.getElementById("generatePdfBtn").addEventListener("click", async () => {
    // Retrieve and parse the data from localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
    const selectedModalities = JSON.parse(localStorage.getItem("selectedModalities") || '[]');
    const acuteChronicData = JSON.parse(localStorage.getItem("acuteChronic") || '{}');
    const acuteChronicAnswers = JSON.parse(localStorage.getItem("acuteChronicAnswers") || '{}');
    const auraCharacteristicsAnswers = JSON.parse(localStorage.getItem("auraCharacteristicsAnswers") || '[]');
    const criterionBAnswers = JSON.parse(localStorage.getItem("criterionBAnswers") || '{}');

    // Debugging logs to make sure data is being retrieved correctly
    console.log("userInfo:", userInfo);
    console.log("selectedModalities:", selectedModalities);
    console.log("acuteChronicData:", acuteChronicData);
    console.log("acuteChronicAnswers:", acuteChronicAnswers);
    console.log("auraCharacteristicsAnswers:", auraCharacteristicsAnswers);
    console.log("criterionBAnswers:", criterionBAnswers);

    // Check if required data is available
    if (!userInfo || !selectedModalities || !acuteChronicData || !acuteChronicAnswers || !auraCharacteristicsAnswers || !criterionBAnswers) {
      alert("Missing data! Please check your localStorage.");
      return; // Stop if data is missing
    }

    const data = {
      modalities: selectedModalities,
      userInfo: userInfo,
      acuteChronicData: acuteChronicData,
      acuteChronicAnswers: acuteChronicAnswers,
      auraCharacteristicsAnswers: auraCharacteristicsAnswers,
      criterionBAnswers: criterionBAnswers,
    };

    // Ensure data is correct and log it
    console.log("Final data being passed to report:", data);

document.getElementById("generatePdfBtn").addEventListener("click", async () => {
  // Retrieve and parse the data from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
  const selectedModalities = JSON.parse(localStorage.getItem("selectedModalities") || '[]');
  const acuteChronicData = JSON.parse(localStorage.getItem("acuteChronic") || '{}');
  const acuteChronicAnswers = JSON.parse(localStorage.getItem("acuteChronicAnswers") || '{}');
  const auraCharacteristicsAnswers = JSON.parse(localStorage.getItem("auraCharacteristicsAnswers") || '[]');
  const criterionBAnswers = JSON.parse(localStorage.getItem("criterionBAnswers") || '{}');

  // Debugging logs to make sure data is being retrieved correctly
  console.log("userInfo:", userInfo);
  console.log("selectedModalities:", selectedModalities);
  console.log("acuteChronicData:", acuteChronicData);
  console.log("acuteChronicAnswers:", acuteChronicAnswers);
  console.log("auraCharacteristicsAnswers:", auraCharacteristicsAnswers);
  console.log("criterionBAnswers:", criterionBAnswers);

  // Check if required data is available
  if (!userInfo || !selectedModalities || !acuteChronicData || !acuteChronicAnswers || !auraCharacteristicsAnswers || !criterionBAnswers) {
    alert("Missing data! Please check your localStorage.");
    return; // Stop if data is missing
  }

  const data = {
    modalities: selectedModalities,
    userInfo: userInfo,
    acuteChronicData: acuteChronicData,
    acuteChronicAnswers: acuteChronicAnswers,
    auraCharacteristicsAnswers: auraCharacteristicsAnswers,
    criterionBAnswers: criterionBAnswers,
  };

  // Ensure data is correct and log it
  console.log("Final data being passed to report:", data);

  // Call the function to generate the PDF
  await window.generateAuraReport(data); // Pass the data to the report generation function
});


    // Call the function to generate the PDF
    await window.generateAuraReport(data); // Pass the data to the report generation function
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
