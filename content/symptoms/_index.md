---
date: "2025-04-06T12:45:02+02:00"
title: "Migraine — Beyond Headache"
sidebar:
  exclude: true

donut_settings:
  width: 400
  height: 400
  outerRadius: 160
  innerRadius: 60

donut_sections:
  - degrees: 50
    label: "Warning sign"
    link: "#warning-signs"
    color: "#AEEEEE"
  - degrees: 30
    link: "#aura"
    label: "Aura"
    color: "#C7A6E5"
  - degrees: 50
    link: "#headache"
    label: "Headache"
    color: "#E599A3"
  - degrees: 50
    link: "#postdrome"
    label: "Hangover"
    color: "#B3B3CC"
  - degrees: 180
    link: "#interictal-phase/"
    label: "Inbetween"
    color: "#D6D6E5"
---


## The Migraine Cycle

Before exploring your migraine symptoms, it’s helpful to clarify which phase of the migraine cycle the symptoms you’re interested in belong to.
This will help guide you more precisely.

{{< donut >}}

Migraine attacks often unfold in distinct phases. Not everyone experiences all of them, and their expression can vary between attacks — but recognizing them can help clarify where your symptoms belong.



### Warning Signs 
Early warning signs occur the premonitory phase (also known as prodrome). While this early phase is not yet considered as a true part of the migraine attack it offers an opportunity for ultra-early intervention. This phase can occur up to 48 hours before the headache starts and affects more than 70% of people living with migraine.


<div style="text-align: center;">
  <figure style="display: inline-block; margin: 0 auto;">
    <img
      src="/images/giffin_premonitory.png"
      class="img"
      style="width:amx; height:auto;"
      alt="Entry to Migraine Art Competition" />
    <figcaption style="font-size: 0.8em; margin-top: 0.5em;">
      Precision vs. Sensitivity per premonitory symptom, with bubble size representing the relative false positive rate (FPR). Based on data from Giffin et al. (2013) this visualization introduces a new 3-dimensional representation of the predictive challenge in migraine attacke forecasting based on symptoms in the premonitory phase: how often a sign precedes an attack (sensitivity), how reliably a sign predicts an attack (precision), and how frequently it triggers false alarms (FPR) © 2025 Migraine Aura Foundation
    </figcaption>
  </figure>
</div>


### Aura

Experienced by at least 30% of people with migraine, the aura typically occurs shortly before the headache and lasts between 5 and 60 minutes. This number is likely underreported, as many people do not recognize their symptoms as aura—especially when they involve negative symptoms like loss of vision or numbness. See image below.



<div id="image-container">
  <img id="oscillating-image" src="/images/hasselbach_platz_fortification_with_ns.png" alt="Wechselbild" width=max>
</div>

<script>
  const imagePaths = ["/images/hasselbach_platz_fortification_with_ns.png", "/images/hasselbach_platz_fortification_without_ns.png"];
  const durations = [1000, 3000]; // durations in milliseconds
  let currentIndex = 0;

  function switchImage() {
    const img = document.getElementById("oscillating-image");
    img.src = imagePaths[currentIndex];

    // Prepare for next switch
    const nextIndex = 1 - currentIndex;
    const delay = durations[currentIndex];
    currentIndex = nextIndex;

    setTimeout(switchImage, delay);
  }

  // Start the loop
  switchImage();
</script>

<div style="font-size: 0.8em; margin-top: 1em;">
  Source:  Dahlem, M. A., & Chronicle, E. P. (2004), A computational perspective on migraine aura. 
  <em>Progress in neurobiology</em> , 74(6), 351-361.
  <a href="https://doi.org/10.1016/j.pneurobio.2004.10.003" target="_blank" rel="noopener">https://doi.org/10.1016/j.pneurobio.2004.10.003</a>
</div>

While visual disturbances are the most well-known, aura can affect many other modalities, including sensation, speech, or movement.

To help you determine whether your symptoms meet the clinical criteria for aura, we’ve developed a guided tool with structured questions.



{{< hextra/hero-badge link="/aura-symptom-check/symptom-check-tools">}}
  <div class="hx-w-2 hx-h-2 hx-rounded-full hx-bg-primary-400"></div>
  <span class="hx-text-lg">Try the MigraineAuraScan™</span>
  {{< icon name="arrow-circle-right" attributes="height=32" >}}
{{< /hextra/hero-badge >}}


Many people associate aura with geometric zigzag patterns or flickering scotomas—experiences thought to arise from the brain’s early visual areas in the occipital lobe, responsible for basic visual processing. These classic “elementary” visual auras are easier to describe and illustrate.

However, auras originating from higher-order regions in the temporal or parietal lobes—linked to object recognition, spatial awareness, or motion perception—may manifest in more surreal or hard-to-verbalize ways. Rather than crisp lines or shimmering arcs, they might resemble distorted perspectives, impossible geometries, or dreamlike shifts in size and depth—similar to the disorienting art of Giorgio de Chirico or Cubist painting.

Such experiences may include derealization, face-blindness-like impressions, spatial confusion, or even altered time perception—suggesting involvement of higher cortical areas. These forms of aura may go unrecognized or unreported precisely because they defy conventional description. 

With the Aura-o-mat™ and the [MigraineBrainRadar™](/test-suit/), we are developing tools to identify even complex or rare types of aura and make their early signs visible in everyday life.
For an overview of less common aura experiences, see the [Migraine Art](/art) section.




### Headache
The most recognized phase, occurring in about 95% of attacks.
It typically lasts 4 to 72 hours

### Postdrome
Sometimes called the “migraine hangover,” this phase can last a few days and affects about 70% of individuals.


### Interictal Phase
The interval between attacks. While symptom-free for some, others experience subtle lingering effects, such as brain fog or fatigue.

The mentioned duration periods are typical for each phase of the migraine cycle — **but exceptions exist**. Some attacks last longer than 72 hours (status migrainosus), some auras involve multiple modalities, each lasting up to 60 minutes, and some phases may be entirely absent (such as aura without headache).

You’ll likely need to go back and forth a bit to recognize your own pattern and understand the full picture of your migraine cycle and its variations.

<!-- This phase is also important for identifying patterns or triggers. -->
