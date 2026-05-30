---
date: '2026-05-30T00:00:00+02:00'
title: 'The Migraine Aura Scan in Brief'
authors:
  - name: Markus A. Dahlem, PhD
    link: https://www.linkedin.com/in/markusdahlem/
description: "A short introduction for those who don't yet have a password but want to know what the MigraineAuraScan — the Aura Anamnesis from the Migraine Aura Foundation — does."
---

<div class="hx-mb-12">
{{< hextra/hero-subtitle style="margin: 1rem 0 0 0">}}A short introduction for those who don't yet have a password but want to know what the MigraineAuraScan — the Aura Anamnesis from the Migraine Aura Foundation — does: we translate the narrative experience of people living with migraine into the formal language of diagnostics.
    {{< /hextra/hero-subtitle >}}
</div>

Imagine a world where you no longer sit in the waiting room trying to compress months into five sentences — but instead walk into the consultation with an ordered report of your own symptoms in hand. The conversation begins where it usually ends.

That is the goal of the [MigraineAuraScan](/aura-symptom-check/symptom-check-tools/) — the structured Aura Anamnesis from the Migraine Aura Foundation. But the mission needs more than one tool: alongside it, headache phenotyping (carried over from M-sense's >300M-record corpus) and the [MigraineBrainRadar™](/test-suit/) are advancing in parallel.


<div style="text-align: center;">
  <figure style="display: inline-block; margin: 0 auto;">
    <img
      src="/images/blog/aura-symptom-check-show-case.png"
      class="img"
      alt="Concept diagram: expert system at the center, Voices on the input side, consultation report on the output side" />
    <figcaption style="font-size: 0.8em; margin-top: 0.5em;">
        The concept in one picture: at the center, the symbolic AI expert system; on the input side (not visualized), the link to the foundation's collective patient accounts; on the output side, an automatically generated consultation letter in the style of a tele-consult.
    </figcaption>
  </figure>
</div>

## Bringing three things together

**At the center** sits a symbolic AI expert system. Symbolic means: no chatbot, and therefore no black box — but transparent rules grounded in the [ICHD-3 diagnostic criteria](https://ichd-3.org/) of the International Headache Society. Every question, every conclusion is openly traceable.

**As input**, the system needs a translation — between the patient's narrative experience and the formal language of diagnostics. That translation draws on the rich archive of the foundation's website: more than 7,000 lived accounts (read same [Voices](/voices/)), gathered since 1998. At every step of the questionnaire, patients can look up how others described something similar — and so subjective illness experience becomes comparable.

**As output**, an automated consultation letter is generated, in the style of a tele-consult. Readable by a clinician in 30 seconds, delivered as a PDF to bring to the appointment.

## The core idea

The Aura Anamnesis thus connects two worlds that rarely meet in routine care: the **narrative experience** of patients and the **formal language of diagnostics**. Not interrogated — but guided through the criteria.

Three shifts follow:

- **From isolation to comparability.** What feels unique and barely describable acquires a shape and a place where it resonates.
- **From self-doubt to language.** What was hard to put into words becomes a clearly documented observation — not as the system sees it, but as the patient does.
- **From consultation to shared decision making.** When patient and physician start from the same ICHD-3-based finding, the conversation begins on equal footing.

## Why symbolic AI — and not an LLM

In medicine, what matters is not only *what* a system outputs, but *why*. A language model produces plausible sentences but cannot reliably disclose its derivation. A symbolic expert system can: every statement in the consultation letter traces back to the specific ICHD-3 question that was answered — for the patient, for the physician, for a second opinion.

That is the wager of this tool: that combining collective experiential knowledge, formal diagnostic logic, and a shareable report yields more than any of these parts alone.

For a deeper dive, the longer post ["Migraine Aura Check: Recognizing the Unrecognized"](/blog/aura-symptom-check/) explains effects, risks, and validation in detail.

<script>
document.addEventListener('click', function (e) {
  const link = e.target.closest('a');
  if (!link) return;

  const href = link.getAttribute('href') || '';
  let target;

  if (href.includes('ichd-3.org'))                          target = 'ichd3';
  else if (/\/blog\/aura-symptom-check\/?$/.test(href))     target = 'long_blog';
  else if (href.includes('/symptom-check-tools'))           target = 'symptom_check_tools';
  else if (href.includes('/test-suit'))                     target = 'migrainebrainradar';
  else if (href.includes('/voices'))                        target = 'voices';
  else return;

  if (window.posthog) {
    posthog.capture('brief_blog_outbound_click', {
      target,
      lang: document.documentElement.lang || 'en',
    });
  }
});
</script>
