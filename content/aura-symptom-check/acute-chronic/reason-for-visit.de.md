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


Um Ihre Situation besser zu verstehen, bitten wir Sie, einige Fragen zu beantworten.
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

<div id="password-prompt">
  <h1>Enter Password</h1>
  <input type="password" id="password-input" placeholder="Password">
  <button onclick="checkPassword()">Submit</button>
</div>

<script>
  function checkPassword() {
    var password = document.getElementById('password-input').value;
    var correctPassword = 'wonderland'; // Replace with your actual password
    if (password === correctPassword) {
      document.getElementById('password-protected-content').style.display = 'block';
      document.getElementById('password-prompt').style.display = 'none';
    } else {
      alert('Incorrect password. Please try again.');
    }
  }
</script>
