// File: /js/aura-symptom-check/summaryGeneration.js

import { formatList, getPronouns } from "./helpers.js";
import { t } from "/js/decision-flow/i18n.js";

function detectLang() {
  if (typeof document === "undefined") return "en";
  return (document.documentElement.lang || "en").toLowerCase();
}

function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a narrative summary based on the provided data.
 * @param {Object} data - The data object containing criterionBAnswers, userInfo, acuteChronicData, and acuteChronicAnswers.
 * @returns {string} - The generated narrative summary as an HTML string.
 */
export function generateNarrativeSummary({
  data,
  userInfo,
  acuteChronicData,
  acuteChronicAnswers,
  auraCharacteristicsAnswers,
}) {
  const lang = detectLang();
  const { subj, poss } = getPronouns(userInfo.gender, lang);
  const Subj = capitalizeFirstLetter(subj);
  const Poss = capitalizeFirstLetter(poss);
  const fullName = userInfo.name ? `${userInfo.name}` : Subj;

  const diagnosisYear =
    userInfo.diagnosisYear ||
    t("flow.summary.diagnosisYear.unknown", "an unknown year");
  const headacheDays =
    userInfo.headacheDays !== undefined
      ? t(
          "flow.summary.headacheDays.value",
          "approximately {n} headache days per month",
          { n: userInfo.headacheDays },
        )
      : t("flow.summary.headacheDays.unknown", "frequent headaches");

  const modalityMap = {
    visual: t("flow.summary.modality.visual", "visual symptoms"),
    retinal: t("flow.summary.modality.retinal", "retinal changes"),
    sensory: t("flow.summary.modality.sensory", "sensory disturbances"),
    speech: t(
      "flow.summary.modality.speech",
      "speech/language disturbances",
    ),
    motor: t("flow.summary.modality.motor", "motor symptoms"),
    brainstem: t(
      "flow.summary.modality.brainstem",
      "other symptoms (usually summarized as brainstem or formerly basilar-type aura)",
    ),
  };

  const summaryLines = [];

  Object.entries(modalityMap).forEach(([key, label]) => {
    const entry = data[key] || {};
    const answers = entry.selected || entry.symptoms || [];
    const hasNone =
      answers.includes("none") ||
      answers.includes("no") ||
      answers.includes("unsure") ||
      answers.length === 0;

    if (hasNone) return;

    const desc = entry.description?.trim();
    const visionLossNote = t(
      "flow.summary.retinal.visionLoss",
      "i.e., vision loss in one eye",
    );
    const values = answers
      .filter((v) => v !== "other" && v !== "yes")
      .map((v) =>
        key === "retinal" && v === "yes" ? visionLossNote : v,
      );

    if (key === "retinal" && answers.includes("yes")) {
      values.push(visionLossNote);
    }

    if (desc) {
      values.push(
        t("flow.summary.ownWords", 'in {poss} own words: "{desc}"', {
          poss,
          desc,
        }),
      );
    }

    const content = values.length ? ` (${formatList(values, lang)})` : "";

    summaryLines.push(`${capitalizeFirstLetter(label)}${content}.`);
  });

  const intro = t(
    "flow.summary.intro",
    "{fullName} was first diagnosed with migraine in {year} and currently experiences {headacheDays}.",
    { fullName, year: diagnosisYear, headacheDays },
  );

  const reason = acuteChronicData.reason;
  const reasonParams = { Subj, subj, poss };
  let additionalSentence = "";
  switch (reason) {
    case "acute-chronic-A1":
      additionalSentence = t(
        "flow.summary.reason.a1",
        "{Subj} is experiencing new or unfamiliar symptoms that might be related to migraine.",
        reasonParams,
      );
      break;
    case "acute-chronic-A2":
      additionalSentence = t(
        "flow.summary.reason.a2",
        "{Subj} has had aura symptoms before, but something feels different this time.",
        reasonParams,
      );
      break;
    case "acute-chronic-A3":
      additionalSentence = t(
        "flow.summary.reason.a3",
        "{Subj} has been having migraine with aura episodes for a while.",
        reasonParams,
      );
      break;
    case "acute-chronic-A4":
      additionalSentence = t(
        "flow.summary.reason.a4",
        "{Subj} has been having aura symptoms without any headache for a while.",
        reasonParams,
      );
      break;
    case "acute-chronic-A5":
      additionalSentence = t(
        "flow.summary.reason.a5",
        "{Subj} is gathering general information about migraine auras.",
        reasonParams,
      );
      break;
  }

  const symptomExperience = acuteChronicAnswers.symptomExperience;
  let symptomExperienceSentence = "";
  if (reason === "acute-chronic-A1" || reason === "acute-chronic-A2") {
    switch (symptomExperience) {
      case "acute-chronic-B1":
        symptomExperienceSentence = t(
          "flow.summary.symptomExperience.b1",
          "{Subj} reports that this is the first time experiencing these symptoms.",
          reasonParams,
        );
        break;
      case "acute-chronic-B2":
        symptomExperienceSentence = t(
          "flow.summary.symptomExperience.b2",
          "{Subj} reports having experienced these symptoms once or twice in the past, but not recently.",
          reasonParams,
        );
        break;
      case "acute-chronic-B3":
        if (reason === "acute-chronic-A1") {
          symptomExperienceSentence = t(
            "flow.summary.symptomExperience.b3.a1",
            "{Subj} reports that while the symptoms are new, they have been experiencing them for a while now.",
            reasonParams,
          );
        } else {
          symptomExperienceSentence = t(
            "flow.summary.symptomExperience.b3.a2",
            "{Subj} reports not having experienced such symptoms before, but has been getting these changed aura symptoms regularly for a while now.",
            reasonParams,
          );
        }
        break;
    }
  }

  const onsetWindow = acuteChronicAnswers.onsetWindow;
  let onsetWindowSentence = "";
  if (reason === "acute-chronic-A1" || reason === "acute-chronic-A2") {
    switch (onsetWindow) {
      case "acute-chronic-C1":
        onsetWindowSentence = t(
          "flow.summary.onsetWindow.c1",
          "{Subj} reports that the symptoms started within the last 24 hours.",
          reasonParams,
        );
        break;
      case "acute-chronic-C2":
        onsetWindowSentence = t(
          "flow.summary.onsetWindow.c2",
          "{Subj} reports that the symptoms started within the last 7 days.",
          reasonParams,
        );
        break;
      case "acute-chronic-C3":
        onsetWindowSentence = t(
          "flow.summary.onsetWindow.c3",
          "{Subj} reports that the symptoms started within the last 30 days.",
          reasonParams,
        );
        break;
      case "acute-chronic-C4":
        onsetWindowSentence = t(
          "flow.summary.onsetWindow.c4",
          "{Subj} reports that the symptoms started more than 30 days ago.",
          reasonParams,
        );
        break;
    }
  }

  const symptomProgression = acuteChronicAnswers.symptomProgression;
  let symptomProgressionSentence = "";
  switch (symptomProgression) {
    case "acute-chronic-D1":
      symptomProgressionSentence = t(
        "flow.summary.progression.d1",
        "{Subj} reports that the symptoms have become more intense.",
        reasonParams,
      );
      break;
    case "acute-chronic-D2":
      symptomProgressionSentence = t(
        "flow.summary.progression.d2",
        "{Subj} reports that the symptoms have eased or improved.",
        reasonParams,
      );
      break;
    case "acute-chronic-D3":
      symptomProgressionSentence = t(
        "flow.summary.progression.d3",
        "{Subj} reports that the symptoms have stayed about the same.",
        reasonParams,
      );
      break;
  }

  const impact = acuteChronicAnswers.impact;
  let impactSentence = "";
  switch (impact) {
    case "acute-chronic-E1":
      impactSentence = t(
        "flow.summary.impact.e1",
        "{Subj} reports that the symptoms severely impact {poss} daily activities.",
        reasonParams,
      );
      break;
    case "acute-chronic-E2":
      impactSentence = t(
        "flow.summary.impact.e2",
        "{Subj} reports that the symptoms moderately impact {poss} daily activities.",
        reasonParams,
      );
      break;
    case "acute-chronic-E3":
      impactSentence = t(
        "flow.summary.impact.e3",
        "{Subj} reports that the symptoms minimally impact {poss} daily activities.",
        reasonParams,
      );
      break;
  }

  const remedies = acuteChronicAnswers.remedies;
  let remediesSentence = "";
  switch (remedies) {
    case "acute-chronic-F1":
      remediesSentence = t(
        "flow.summary.remedies.f1",
        "{Subj} reports that {subj} has not tried any remedies for the symptoms.",
        reasonParams,
      );
      break;
    case "acute-chronic-F2":
      remediesSentence = t(
        "flow.summary.remedies.f2",
        "{Subj} reports that {subj} has tried over-the-counter remedies.",
        reasonParams,
      );
      break;
    case "acute-chronic-F3":
      remediesSentence = t(
        "flow.summary.remedies.f3",
        "{Subj} reports that {subj} has tried prescription remedies.",
        reasonParams,
      );
      break;
    case "acute-chronic-F4":
      remediesSentence = t(
        "flow.summary.remedies.f4",
        "{Subj} reports that {subj} has tried alternative remedies.",
        reasonParams,
      );
      break;
  }

  const priorMedical = acuteChronicAnswers.priorMedical;
  let priorMedicalSentence = "";
  switch (priorMedical) {
    case "acute-chronic-G1":
      priorMedicalSentence = t(
        "flow.summary.priorMedical.g1",
        "{Subj} reports that {subj} has not sought prior medical attention for the symptoms.",
        reasonParams,
      );
      break;
    case "acute-chronic-G2":
      priorMedicalSentence = t(
        "flow.summary.priorMedical.g2",
        "{Subj} reports that {subj} has sought prior medical attention for the symptoms.",
        reasonParams,
      );
      break;
    case "acute-chronic-G3":
      priorMedicalSentence = t(
        "flow.summary.priorMedical.g3",
        "{Subj} reports that {subj} is currently seeking medical attention for the symptoms.",
        reasonParams,
      );
      break;
  }

  // Aura characteristics
  const auraCharDescs = [
    t(
      "flow.summary.auraCharacteristics.0",
      "at least one aura symptom spread gradually over 5 minutes or longer",
    ),
    t(
      "flow.summary.auraCharacteristics.1",
      "two or more aura symptoms occurred in succession",
    ),
    t(
      "flow.summary.auraCharacteristics.2",
      "each individual aura symptom lasted between 5–60 minutes",
    ),
    t(
      "flow.summary.auraCharacteristics.3",
      "at least one aura symptom was unilateral (on one side only)",
    ),
    t(
      "flow.summary.auraCharacteristics.4",
      "at least one aura symptom was positive (e.g., flashing lights or pins and needles)",
    ),
    t(
      "flow.summary.auraCharacteristics.5",
      "the aura was accompanied or followed within 60 minutes by headache",
    ),
  ];

  const auraCharacteristicsDetails = [];
  const auraCharacteristicsNotApply = [];
  auraCharDescs.forEach((desc, i) => {
    if (auraCharacteristicsAnswers[i]) {
      auraCharacteristicsDetails.push(desc);
    } else {
      auraCharacteristicsNotApply.push(desc);
    }
  });
  const keyCharacteristicsCount = auraCharacteristicsDetails.length;

  let auraCharacteristicsSentence = "";
  if (auraCharacteristicsDetails.length > 0) {
    auraCharacteristicsSentence = t(
      "flow.summary.auraCharacteristics.summary",
      "{Subj} reports the following {count} of 6 aura characteristics: {details}.",
      {
        Subj,
        count: keyCharacteristicsCount,
        details: formatList(auraCharacteristicsDetails, lang),
      },
    );
    auraCharacteristicsSentence += t(
      "flow.summary.auraCharacteristics.notApply",
      " These {count} characteristics do not apply: {details}.",
      {
        count: 6 - keyCharacteristicsCount,
        details: formatList(auraCharacteristicsNotApply, lang),
      },
    );
  }

  const keyCharacteristicsSummary =
    keyCharacteristicsCount < 3
      ? t(
          "flow.summary.conclusion.notMeets",
          "Fewer than three key characteristics apply. Based on {poss} answers, fewer than three of the key features associated with migraine aura are present. This suggests that {poss} symptom profile does not fully align with Criterion C as defined by the ICHD-3 guidelines.",
          { poss },
        )
      : t(
          "flow.summary.conclusion.meets",
          "{Poss} responses indicate that the ICHD-3 criteria for migraine with aura have likely been met. This means that a sufficient number of typical features—such as gradual onset, full reversibility, limited duration, and association with headache—were present to suggest a pattern consistent with migraine aura. These criteria help differentiate migraine aura from other possible neurological conditions.",
          { Poss },
        );

  // Aura modalities detail block
  let details = "";
  if (summaryLines.length > 0) {
    const heading = t(
      "flow.summary.details.headingMultiple",
      "{Subj} reports multiple aura modalities, including:",
      { Subj },
    );
    details = `${heading}<ul style="margin: 0; padding: 0; list-style-type: none;">`;
    summaryLines.forEach((line) => {
      details += `<li style="margin-bottom: 4px;">${line}</li>`;
    });
    details += "</ul>";
  } else {
    details = t(
      "flow.summary.details.headingNone",
      "{Subj} did not report any aura symptoms.",
      { Subj },
    );
  }

  // Negative findings
  const reported = Object.keys(modalityMap).filter(
    (key) =>
      data[key]?.selected &&
      !["none", "no", "unsure"].includes(data[key].selected[0]),
  );
  const unreported = Object.keys(modalityMap).filter(
    (key) => !reported.includes(key),
  );
  let neg = "";
  if (unreported.length > 0 && unreported.length < 6) {
    const labels = unreported.map((k) =>
      modalityMap[k].replace(/ features| disturbances| symptoms| changes/, ""),
    );
    neg = `<p>${t(
      "flow.summary.negativeFindings",
      "No {labels} aura symptoms were reported.",
      { labels: formatList(labels, lang) },
    )}</p>`;
  }

  const reportHeading = t(
    "flow.summary.reportHeading",
    "Expert System Patient Report: Migraine Aura Assessment",
  );

  return `
    <style>
      p, ul {
        margin: 0;
        padding: 0;
      }
      ul {
        list-style-type: none;
        padding-left: 0;
      }
      li {
        margin-bottom: 4px;
      }
    </style>
    <h4>${reportHeading}</h4>
    <p>${intro}</p><p>${additionalSentence} ${symptomExperienceSentence} ${onsetWindowSentence} ${impactSentence} ${remediesSentence} ${priorMedicalSentence}</p>
    <p>${symptomProgressionSentence}</p>
    <p>${details}</p>
    ${neg}
    <p>${auraCharacteristicsSentence}</p>
    <p>${keyCharacteristicsSummary}</p>
  `;
}
