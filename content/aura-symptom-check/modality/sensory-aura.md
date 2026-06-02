---
title: ""
description: ""
date: 2025-04-19
toc: false
sidebar:
  exclude: true
---
<p class="beta-notice">{{< t "flow.pages.common.betaVersion" >}}</p>

{{< aura-symptom-check/section-progress current="2" step="2" total="5" >}}

## {{< t "flow.pages.modality.sensory.heading" >}}

**{{< t "flow.pages.modality.sensory.prompt" >}}**

<link rel="stylesheet" href="/css/symptom-check.css">

{{< aura-symptom-check/modality/sensory-aura-form >}}

<script type="module" src="/js/aura-symptom-check/modality/sensoryAuraStep.js"></script>
