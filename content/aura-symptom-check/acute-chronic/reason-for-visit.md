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
### {{< t "flow.pages.common.tellUsWhyYoureHere" >}} 


To better understand your situation, please answer a few questions.
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

<div style="max-width: 38rem; margin: 2rem auto; padding: 1.25rem 1.5rem; border-left: 4px solid #c2622d; background: rgba(194, 98, 45, 0.06); border-radius: 0 8px 8px 0;">

### ⚠️ Important notice

This tool is informational only — it is not a medical diagnosis. Neurological symptoms can have many causes, including serious conditions. If your symptoms are **new, unusual, or worsening**, please seek prompt medical advice.

</div>

<div id="password-prompt">
  <h1>Enter Password</h1>
  <input type="password" id="password-input" placeholder="Password">
  <button onclick="checkPassword()">Submit</button>

  <p style="margin-top: 1.25rem; font-size: 0.95rem; color: #4b5563;">
    Don't have a password yet? <a href="/blog/aura-symptom-check-brief/">Read about what the check covers</a> in the meantime.
  </p>
</div>

<script>
  function checkPassword() {
    var password = document.getElementById('password-input').value;
    var correctPassword = 'wonderland'; // Replace with your actual password
    var lang = document.documentElement.lang || 'en';
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
