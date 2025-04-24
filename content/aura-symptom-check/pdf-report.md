---
date: "2025-04-06T12:45:02+02:00"
title: "Other Aura Symptom"
linkTitle: "Other Symptom"
toc: false
sidebar:
  exclude: true
---

<h2>Describe your other aura symptom</h2>
<p>You selected “Other” as your only aura symptom. Please describe what you experienced.</p>


<button id="generatePdfBtn" class="btn">Download Aura Report (PDF)</button>

<!-- JS Dependencies -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script type="module" src="/js/generateAuraReport.js?v=3"></script>

<script type="module">
  document.getElementById("generatePdfBtn").addEventListener("click", async () => {

    const data = {
      modalities: JSON.parse(localStorage.getItem("selectedModalities") || '["other"]'),
      userInfo: JSON.parse(localStorage.getItem("userInfo") || "{}"),
      acuteChronicData: JSON.parse(localStorage.getItem("acuteChronic") || "{}"),
      acuteChronicAnswers: JSON.parse(localStorage.getItem("acuteChronicAnswers") || "{}"),
      auraCharacteristicsAnswers: JSON.parse(localStorage.getItem("auraCharacteristicsAnswers") || "[]")
    };

    await window.generateAuraReport("other-only", data);
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
