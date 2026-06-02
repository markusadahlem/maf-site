---
title: ""
description: ""
date: 2025-04-19
toc: false
sidebar:
  exclude: true
---

<div id="password-protected-content" style="display:none;">

<span style="color:red">{{< t "flow.pages.common.betaVersion" >}}</span>

{{< aura-symptom-check/section-progress current="1" >}}

### {{< t "flow.pages.reasonForVisit.heading" >}}


Um Ihre Situation zu verstehen, stellen wir Ihnen hier **sieben** kurze Fragen. Zwei weitere Abschnitte folgen — einer zu den Symptomen, die Sie erlebt haben, und einer dazu, wie sie typischerweise verlaufen.
Das hilft uns, einen Bericht zu erstellen, der klar, relevant und bei Bedarf leicht mit Ihrer Ärztin oder Ihrem Arzt geteilt werden kann.





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

### ⚠️ Wichtiger Hinweis

Dieses Tool dient ausschließlich Informationszwecken und stellt keine medizinische Diagnose dar. Neurologische Symptome können viele Ursachen haben – darunter auch neue ernsthafte Erkrankungen. Wenn deine Symptome **neu, ungewöhnlich oder zunehmend** sind, suche bitte **unverzüglich ärztlichen Rat**.

</div>

{{< password-gate >}}
