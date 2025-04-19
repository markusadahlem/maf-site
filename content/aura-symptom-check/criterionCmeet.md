---
title: ""
linkTitle: "C Criterium"
toc: false
sidebar:
  exclude: true
---


<p>&nbsp;</p>

## ⚠️ Disclaimer

This tool is not a medical diagnosis and is intended for informational purposes only.

Neurological symptoms can have many different causes—some of them serious. This tool assumes that your symptoms are not better explained by another medical condition, such as epilepsy, stroke, multiple sclerosis, or a known eye disorder.


If your symptoms are **new, unusual, worsening**, or occur **alongside other health issues**, please **seek medical advice immediately**.

<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="/js/generateAuraReport.js"></script>

<button class="btn" id="generatePdf">Download Aura Report</button>


<script>
  document.getElementById("generatePdf").addEventListener("click", async () => {
    const answers = JSON.parse(localStorage.getItem("auraCharacteristicsAnswers") || "[]");
    const modalities = JSON.parse(localStorage.getItem("selectedModalities") || "[]");
    const otherDescription = localStorage.getItem("otherDescription") || "";

    const data = {
      flowType: "standard",
      modalities,
      otherDescription,  // ✅ Freitext hinzufügen
      characteristics: {
        progression: answers[0] === true,
        succession: answers[1] === true,
        duration: answers[2] === true,
        laterality: answers[3] === true,
        positive: answers[4] === true,
        headacheOnset: answers[5] === true,
      }
    };

    console.log("🧪 Testdaten an PDF:", data);
    await generateAuraReport("standard", data);
    localStorage.clear();
  });
</script>


<!-- >

<div class="hx-mt-6 hx-mb-6">
{{< hero-button-secondary text="I understand! Continue to the report ✅" link="/aura-symptom-check/symptom-check-summary/" >}}
{{< hero-button-secondary text="I’m Not Sure – Exit 🚫" link="/" >}}
</div>
-->
