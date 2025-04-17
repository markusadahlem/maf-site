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

<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script>
    document.getElementById("generatePdfBtn").addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const desc = document.getElementById("otherDescription").value;

        doc.setFontSize(12);
        doc.text("Migraine Aura Symptom Report", 20, 20);
        doc.setFontSize(10);
        doc.text("Reported Aura Modality: Other", 20, 30);
        doc.text("Description:", 20, 40);
        doc.text(desc || "[No description entered]", 20, 50, { maxWidth: 170 });

        doc.save("aura_report.pdf");
    });
</script>
