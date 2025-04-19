---
date: "2025-04-06T12:45:02+02:00"
title: "Combined Modalities"
linkTitle: "Symptoms Check"
toc: false
sidebar:
  exclude: true
---

<link rel="stylesheet" href="/css/symptom-check.css" />

<h2>Review Your Aura Symptoms</h2>

<p><strong>Selected typical modality:</strong> <span id="selectedTypical"></span></p>

<p><strong>Other symptom:</strong></p>
<textarea id="otherDescription" rows="5" style="width: 100%;"></textarea>

<button id="generatePdfBtn" class="btn">Download Combined Aura Report</button>

<!-- Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="/js/generateAuraReport.js"></script>
<script src="/js/plusOther.js"></script>
