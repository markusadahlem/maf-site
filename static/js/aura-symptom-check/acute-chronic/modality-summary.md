---
title: "Summary of Aura Symptoms"
linkTitle: "Summary"
description: "Overview of all your selected aura symptoms."
---

<div id="summaryOutput"></div>

<br />
<button id="continueBtn" class="btn" data-next="/aura-symptom-check/aura-characteristics/">
  Continue to Step 3
</button>

<script type="module">
    import { getDataFromLocalStorage } from '/js/aura-symptom-check/dataRetrieval.js';
    import { generateNarrativeSummary } from '/js/aura-symptom-check/summaryGeneration.js';

    document.addEventListener("DOMContentLoaded", () => {
        console.log("Script is loaded"); // Debugging line to confirm script is loaded
        const output = document.getElementById("summaryOutput");
        const continueBtn = document.getElementById("continueBtn");

        console.log("Output element:", output); // Debugging line
        console.log("Continue button element:", continueBtn); // Debugging line

        // Retrieve data from localStorage
        const data = getDataFromLocalStorage();

        // Generate narrative summary
        output.innerHTML = generateNarrativeSummary(data);

        continueBtn.addEventListener("click", () => {
            const next = continueBtn.getAttribute("data-next");
            window.location.href = next;
        });
    });
</script>
