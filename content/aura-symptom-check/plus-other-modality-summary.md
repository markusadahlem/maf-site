---
date: "2025-04-06T12:45:02+02:00"
title: "Combined Modalities"
linkTitle: "Symptoms Check"
toc: false
sidebar:
  exclude: true
---

<!-- Libraries zuerst laden -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="/js/generateAuraReport.js"></script>

<!-- Deine Seite -->
<h2>Review Your Aura Symptoms</h2>

<p><strong>Selected typical modality:</strong> <span id="selectedTypical"></span></p>

<p><strong>Other symptom:</strong></p>
<textarea id="otherDescription" rows="5" style="width: 100%;"></textarea>

<button id="generatePdfBtn" class="btn">Download Combined Aura Report</button>

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

<!-- Kombinierter Script-Block -->
<script>
  document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const modalities = params.getAll("modality");

    const typical = modalities.filter((m) =>
      ["visual", "sensory", "speech", "motor", "brainstem", "retinal"].includes(m)
    );
    const hasOther = modalities.includes("other");

    document.getElementById("selectedTypical").textContent = typical.join(", ") || "[none]";

    if (!hasOther || typical.length === 0) {
      alert("Something went wrong — expected both 'Other' and a typical modality.");
      return;
    }

    const btn = document.getElementById("generatePdfBtn");
    btn.addEventListener("click", async () => {
      const otherText = document.getElementById("otherDescription").value;

      const data = {
        flowType: "plus-other",
        modalities: [...typical, "other"],
        otherDescription: otherText
      };

      if (typeof generateAuraReport !== "function") {
        alert("generateAuraReport() not loaded.");
        return;
      }

      await generateAuraReport(data.flowType, data);
    });
  });
</script>
