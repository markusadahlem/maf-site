---
title: ""
description: ""
date: 2025-04-19
toc: false
sidebar:
  exclude: true
---
<p class="beta-notice">{{< t "flow.pages.common.betaVersion" >}}</p>

{{< aura-symptom-check/section-progress current="2" step="5" total="5" >}}

## {{< t "flow.pages.modality.brainstem.heading" >}}

**{{< t "flow.pages.modality.brainstem.prompt" >}}**  
_{{< t "flow.pages.common.selectAllThatApply" >}}_

<link rel="stylesheet" href="/css/symptom-check.css">

{{< aura-symptom-check/modality/brainstem-aura-form >}}

<script type="module" src="/js/aura-symptom-check/modality/brainstemAuraStep.js"></script>
