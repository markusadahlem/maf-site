---
date: "2025-04-06T12:45:02+02:00"
title: "Andere"
linkTitle: "Symptom-Check"
toc: false
sidebar:
  exclude: true
---

<h2>{{< t "flow.report.page.otherDescribe.heading" >}}</h2>
<p>{{< t "flow.report.page.otherDescribe.promptLong" >}}</p>

<textarea id="otherDescription" rows="6" style="width: 100%;" placeholder='{{< t "flow.report.page.otherDescribe.placeholder" >}}'></textarea>

<button id="generatePdfBtn" class="btn"></button>

<!-- Required JS dependencies -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script type="module" src="/js/generateAuraReport.js"></script>


<script type="module">
  import { t } from "/js/decision-flow/i18n.js";

  const btn = document.getElementById("generatePdfBtn");
  btn.textContent = t("flow.report.button.downloadAuraPdf", "Download Aura Report (PDF)");

  btn.addEventListener("click", async () => {
    const desc = document.getElementById("otherDescription").value;

    const data = {
      flowType: "other-only",
      modalities: ["other"],
      otherDescription: desc
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
    background-color: #08768a;
    color: white;
  }

  .btn:hover {
    background-color: #065d6e;
  }
</style>
