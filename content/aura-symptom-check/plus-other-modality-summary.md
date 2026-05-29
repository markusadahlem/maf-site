---
date: "2025-04-06T12:45:02+02:00"
title: "Combined Modalities"
linkTitle: "Symptoms Check"
toc: false
sidebar:
  exclude: true
---

<link rel="stylesheet" href="/css/symptom-check.css" />

<h2>{{< t "flow.report.page.combined.heading" >}}</h2>

<p><strong>{{< t "flow.report.page.combined.label.typical" >}}</strong> <span id="selectedTypical"></span></p>

<p><strong>{{< t "flow.report.page.combined.label.other" >}}</strong></p>
<textarea id="otherDescription" rows="5" style="width: 100%;"></textarea>

<button id="generatePdfBtn" class="btn"></button>

<!-- Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script type="module" src="/js/generateAuraReport.js"></script>
<script type="module" src="/js/plusOther.js"></script>

<script type="module">
  import { t } from "/js/decision-flow/i18n.js";
  document.getElementById("generatePdfBtn").textContent = t("flow.report.button.downloadCombined", "Download Combined Aura Report");
</script>
