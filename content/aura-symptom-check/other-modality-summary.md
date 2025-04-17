---
date: "2025-04-06T12:45:02+02:00"
title: "Other"
linkTitle: "Symptoms Check"
toc: false
sidebar:
  exclude: true
---

<h2>Describe your other aura symptom</h2>
<p>You selected “Other” as your only aura symptom. Please describe what you experienced so we can generate a report.</p>

<textarea id="otherDescription" rows="6" style="width: 100%;" placeholder="e.g., déjà vu, olfactory changes, etc."></textarea>

<button id="generatePdfBtn" class="btn">Download Aura Report (PDF)</button>

<!-- Required JS dependencies -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="/js/generateAuraReport.js"></script>

<script>
  document.getElementById("generatePdfBtn").addEventListener("click", async () => {
    const desc = document.getElementById("otherDescription").value;

    const data = {
      flowType: "other-only",
      modalities: ["other"],
      otherDescription: desc
    };

    await generateAuraReport("other-only", data);
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
