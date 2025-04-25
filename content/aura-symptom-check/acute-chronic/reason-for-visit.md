---
title: ""
description: ""
date: 2025-04-19
toc: false
sidebar:
  exclude: true
---

<div id="password-protected-content" style="display:none;">

<span style="color:red">Beta version</span>
### Tell us why you're here 


To better understand your situation, please answer a few questions.
This helps us generate a report that’s clear, relevant, and easy to share with your doctor if needed.





**Which of these best describes why you’re filling out this form today?**

<link rel="stylesheet" href="/css/symptom-check.css">



{{< aura-symptom-check/acute-chronic/reason-for-visit >}}

<script src="/js/aura-symptom-check/acute-chronic/reason-for-visit.js"></script>
</div>

<div id="password-prompt">
  <h1>Enter Password</h1>
  <input type="password" id="password-input" placeholder="Password">
  <button onclick="checkPassword()">Submit</button>
</div>

<script>
  function checkPassword() {
    var password = document.getElementById('password-input').value;
    var correctPassword = '1'; // Replace with your actual password
    if (password === correctPassword) {
      document.getElementById('password-protected-content').style.display = 'block';
      document.getElementById('password-prompt').style.display = 'none';
    } else {
      alert('Incorrect password. Please try again.');
    }
  }
</script>
