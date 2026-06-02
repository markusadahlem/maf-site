---
title: ""
description: ""
date: 2025-04-19
toc: false
sidebar:
  exclude: true
---

<div id="password-protected-content" style="display:none;">

<p class="beta-notice">{{< t "flow.pages.common.betaVersion" >}}</p>

{{< aura-symptom-check/section-progress current="1" step="1" total="7" >}}

### {{< t "flow.pages.reasonForVisit.heading" >}}


To understand your situation, we'll ask **seven** short questions here. Two further sections follow — one about the symptoms you've experienced, and one about how they typically unfold.
This helps us generate a report that’s clear, relevant, and easy to share with your doctor if needed.





**{{< t "flow.pages.reasonForVisit.prompt" >}}**

<link rel="stylesheet" href="/css/symptom-check.css">

<script>
// Set the flag in localStorage
localStorage.setItem("redirectToDemographicInfo", "true");
</script>

{{< aura-symptom-check/acute-chronic/reason-for-visit >}}

<script type="module" src="/js/aura-symptom-check/acute-chronic/reason-for-visit.js"></script>
</div>

<div style="max-width: 38rem; margin: 2rem auto; padding: 1.25rem 1.5rem; border-left: 4px solid #08768a; background: rgba(8, 118, 138, 0.06); border-radius: 0 8px 8px 0;">

### ⚠️ Important notice

This tool is informational only — it is not a medical diagnosis. Neurological symptoms can have many causes, including new serious conditions. If your symptoms are **new, unusual, or worsening**, please seek prompt medical advice.

</div>

{{< password-gate >}}
