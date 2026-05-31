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

<div style="max-width: 38rem; margin: 2rem auto; padding: 1.25rem 1.5rem; border-left: 4px solid #c2622d; background: rgba(194, 98, 45, 0.06); border-radius: 0 8px 8px 0;">

### ⚠️ Wichtiger Hinweis

Dieses Tool dient ausschließlich Informationszwecken und stellt keine medizinische Diagnose dar. Neurologische Symptome können viele Ursachen haben – darunter auch ernsthafte Erkrankungen. Wenn deine Symptome **neu, ungewöhnlich oder zunehmend** sind, suche bitte **unverzüglich ärztlichen Rat**.

</div>

<div id="password-prompt">
  <h1>Passwort eingeben</h1>
  <input type="password" id="password-input" placeholder="Passwort">
  <button onclick="checkPassword()">Absenden</button>

  <p style="margin-top: 1.25rem; font-size: 0.95rem; color: #4b5563;">
    Noch kein Passwort? <a href="/de/blog/aura-symptom-check-brief/">Lies in der Zwischenzeit, was der Check umfasst</a>.
  </p>
</div>

<script>
  function checkPassword() {
    var password = document.getElementById('password-input').value;
    var correctPassword = 'wonderland'; // Replace with your actual password
    var lang = document.documentElement.lang || 'de';
    if (password === correctPassword) {
      if (window.posthog) posthog.capture('password_submitted', { result: 'success', lang: lang });
      document.getElementById('password-protected-content').style.display = 'block';
      document.getElementById('password-prompt').style.display = 'none';
    } else {
      if (window.posthog) posthog.capture('password_submitted', { result: 'failure', lang: lang });
      alert('Incorrect password. Please try again.');
    }
  }
</script>
