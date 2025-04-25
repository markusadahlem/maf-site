// File: /js/aura-symptom-check/summaryGeneration.js

import { formatList, getPronouns } from "./helpers.js";

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
  const { subj, poss, label } = getPronouns(userInfo.gender);
  const fullName = userInfo.name
    ? `${userInfo.name}`
    : capitalizeFirstLetter(subj);

  const diagnosisYear = userInfo.diagnosisYear || "an unknown year";
  const headacheDays =
    userInfo.headacheDays !== undefined
      ? `approximately ${userInfo.headacheDays} headache days per month`
      : "frequent headaches";

  const modalityMap = {
    visual: "visual symptoms",
    retinal: "retinal changes",
    sensory: "sensory disturbances",
    speech: "speech/language disturbances",
    motor: "motor symptoms",
    brainstem:
      "other symptoms (usually summarized as brainstem or formerly basilar-type aura)",
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
    const values = answers
      .filter((v) => v !== "other" && v !== "yes")
      .map((v) =>
        key === "retinal" && v === "yes" ? "i.e., vision loss in one eye" : v,
      );

    if (key === "retinal" && answers.includes("yes")) {
      values.push("i.e., vision loss in one eye");
    }

    if (desc) {
      values.push(`in ${poss} own words: "${desc}"`);
    }

    const content = values.length ? ` (${formatList(values)})` : "";

    summaryLines.push(
      `${label.charAt(0).toUpperCase() + label.slice(1)}${content}.`,
    );
  });

  // Intro sentence
  const intro = `${fullName} was first diagnosed with migraine in ${diagnosisYear} and currently experiences ${headacheDays}.`;

  // Additional sentence based on reason selection
  let additionalSentence = "";
  const reason = acuteChronicData.reason; // Retrieve reason from acuteChronicData
  console.log("Reason:", reason); // Debugging line

  switch (reason) {
    case "acute-chronic-A1":
      additionalSentence = `${capitalizeFirstLetter(subj)} is experiencing new or unfamiliar symptoms that might be related to migraine.`;
      break;
    case "acute-chronic-A2":
      additionalSentence = `${capitalizeFirstLetter(subj)} has had aura symptoms before, but something feels different this time.`;
      break;
    case "acute-chronic-A3":
      additionalSentence = `${capitalizeFirstLetter(subj)} has been having migraine with aura episodes for a while.`;
      break;
    case "acute-chronic-A4":
      additionalSentence = `${capitalizeFirstLetter(subj)} has been having aura symptoms without any headache for a while.`;
      break;
    case "acute-chronic-A5":
      additionalSentence = `${capitalizeFirstLetter(subj)} is gathering general information about migraine auras.`;
      break;
    default:
      additionalSentence = "";
  }

  // Additional sentence based on symptom experience selection for A1 and A2
  let symptomExperienceSentence = "";
  const symptomExperience = acuteChronicAnswers.symptomExperience;
  console.log("Symptom Experience:", symptomExperience); // Debugging line

  if (reason === "acute-chronic-A1" || reason === "acute-chronic-A2") {
    switch (symptomExperience) {
      case "acute-chronic-B1":
        symptomExperienceSentence = `${capitalizeFirstLetter(subj)} reports that this is the first time experiencing these symptoms.`;
        break;
      case "acute-chronic-B2":
        symptomExperienceSentence = `${capitalizeFirstLetter(subj)} reports having experienced these symptoms once or twice in the past, but not recently.`;
        break;
      case "acute-chronic-B3":
        if (reason === "acute-chronic-A1") {
          symptomExperienceSentence = `${capitalizeFirstLetter(subj)} reports that while the symptoms are new, they have been experiencing them for a while now.`;
        } else if (reason === "acute-chronic-A2") {
          symptomExperienceSentence = `${capitalizeFirstLetter(subj)} reports not having experienced such symptoms before, but has been getting these changed aura symptoms regularly for a while now.`;
        }
        break;
      default:
        symptomExperienceSentence = "";
    }
  }

  // Additional sentence based on onset window selection for A1 and A2
  let onsetWindowSentence = "";
  const onsetWindow = acuteChronicAnswers.onsetWindow;
  console.log("Onset Window:", onsetWindow); // Debugging line

  if (reason === "acute-chronic-A1" || reason === "acute-chronic-A2") {
    switch (onsetWindow) {
      case "acute-chronic-C1":
        onsetWindowSentence = `${capitalizeFirstLetter(subj)} reports that the symptoms started within the last 24 hours.`;
        break;
      case "acute-chronic-C2":
        onsetWindowSentence = `${capitalizeFirstLetter(subj)} reports that the symptoms started within the last 7 days.`;
        break;
      case "acute-chronic-C3":
        onsetWindowSentence = `${capitalizeFirstLetter(subj)} reports that the symptoms started within the last 30 days.`;
        break;
      case "acute-chronic-C4":
        onsetWindowSentence = `${capitalizeFirstLetter(subj)} reports that the symptoms started more than 30 days ago.`;
        break;
      default:
        onsetWindowSentence = "";
    }
  }

  // Additional sentence based on symptom progression selection for all cases
  let symptomProgressionSentence = "";
  const symptomProgression = acuteChronicAnswers.symptomProgression;
  console.log("Symptom Progression:", symptomProgression); // Debugging line

  switch (symptomProgression) {
    case "acute-chronic-D1":
      symptomProgressionSentence = `${capitalizeFirstLetter(subj)} reports that the symptoms have become more intense.`;
      break;
    case "acute-chronic-D2":
      symptomProgressionSentence = `${capitalizeFirstLetter(subj)} reports that the symptoms have eased or improved.`;
      break;
    case "acute-chronic-D3":
      symptomProgressionSentence = `${capitalizeFirstLetter(subj)} reports that the symptoms have stayed about the same.`;
      break;
    default:
      symptomProgressionSentence = "";
  }

  // Additional sentence based on impact selection for all cases
  let impactSentence = "";
  const impact = acuteChronicAnswers.impact;
  console.log("Impact:", impact); // Debugging line

  switch (impact) {
    case "acute-chronic-E1":
      impactSentence = `${capitalizeFirstLetter(subj)} reports that the symptoms severely impact ${poss} daily activities.`;
      break;
    case "acute-chronic-E2":
      impactSentence = `${capitalizeFirstLetter(subj)} reports that the symptoms moderately impact ${poss} daily activities.`;
      break;
    case "acute-chronic-E3":
      impactSentence = `${capitalizeFirstLetter(subj)} reports that the symptoms minimally impact ${poss} daily activities.`;
      break;
    default:
      impactSentence = "";
  }

  // Additional sentence based on remedies selection for all cases
  let remediesSentence = "";
  const remedies = acuteChronicAnswers.remedies;
  console.log("Remedies:", remedies); // Debugging line

  switch (remedies) {
    case "acute-chronic-F1":
      remediesSentence = `${capitalizeFirstLetter(subj)} reports that ${subj} has not tried any remedies for the symptoms.`;
      break;
    case "acute-chronic-F2":
      remediesSentence = `${capitalizeFirstLetter(subj)} reports that ${subj} has tried over-the-counter remedies.`;
      break;
    case "acute-chronic-F3":
      remediesSentence = `${capitalizeFirstLetter(subj)} reports that ${subj} has tried prescription remedies.`;
      break;
    case "acute-chronic-F4":
      remediesSentence = `${capitalizeFirstLetter(subj)} reports that ${subj} has tried alternative remedies.`;
      break;
    default:
      remediesSentence = "";
  }

  // Additional sentence based on prior medical selection for all cases
  let priorMedicalSentence = "";
  const priorMedical = acuteChronicAnswers.priorMedical;
  console.log("Prior Medical:", priorMedical); // Debugging line

  switch (priorMedical) {
    case "acute-chronic-G1":
      priorMedicalSentence = `${capitalizeFirstLetter(subj)} reports that ${subj} has not sought prior medical attention for the symptoms.`;
      break;
    case "acute-chronic-G2":
      priorMedicalSentence = `${capitalizeFirstLetter(subj)} reports that ${subj} has sought prior medical attention for the symptoms.`;
      break;
    case "acute-chronic-G3":
      priorMedicalSentence = `${capitalizeFirstLetter(subj)} reports that ${subj} is currently seeking medical attention for the symptoms.`;
      break;
    default:
      priorMedicalSentence = "";
  }

  // Count the number of key characteristics that apply
  const keyCharacteristicsCount = auraCharacteristicsAnswers.filter(
    (answer) => answer,
  ).length;
  console.log("Key Characteristics Count:", keyCharacteristicsCount); // Debugging line

  // Additional sentence based on aura characteristics selection for all cases
  let auraCharacteristicsSentence = "";
  const auraCharacteristicsDetails = [];
  const auraCharacteristicsNotApply = [];

  if (auraCharacteristicsAnswers[0]) {
    auraCharacteristicsDetails.push(
      "at least one aura symptom spread gradually over 5 minutes or longer",
    );
  } else {
    auraCharacteristicsNotApply.push(
      "at least one aura symptom spread gradually over 5 minutes or longer",
    );
  }
  if (auraCharacteristicsAnswers[1]) {
    auraCharacteristicsDetails.push(
      "two or more aura symptoms occurred in succession",
    );
  } else {
    auraCharacteristicsNotApply.push(
      "two or more aura symptoms occurred in succession",
    );
  }
  if (auraCharacteristicsAnswers[2]) {
    auraCharacteristicsDetails.push(
      "each individual aura symptom lasted between 5–60 minutes",
    );
  } else {
    auraCharacteristicsNotApply.push(
      "each individual aura symptom lasted between 5–60 minutes",
    );
  }
  if (auraCharacteristicsAnswers[3]) {
    auraCharacteristicsDetails.push(
      "at least one aura symptom was unilateral (on one side only)",
    );
  } else {
    auraCharacteristicsNotApply.push(
      "at least one aura symptom was unilateral (on one side only)",
    );
  }
  if (auraCharacteristicsAnswers[4]) {
    auraCharacteristicsDetails.push(
      "at least one aura symptom was positive (e.g., flashing lights or pins and needles)",
    );
  } else {
    auraCharacteristicsNotApply.push(
      "at least one aura symptom was positive (e.g., flashing lights or pins and needles)",
    );
  }
  if (auraCharacteristicsAnswers[5]) {
    auraCharacteristicsDetails.push(
      "the aura was accompanied or followed within 60 minutes by headache",
    );
  } else {
    auraCharacteristicsNotApply.push(
      "the aura was accompanied or followed within 60 minutes by headache",
    );
  }

  if (auraCharacteristicsDetails.length > 0) {
    auraCharacteristicsSentence = `${capitalizeFirstLetter(subj)} reports the following ${keyCharacteristicsCount} of 6 aura characteristics: ${formatList(auraCharacteristicsDetails)}.`;
    auraCharacteristicsSentence += ` These ${6 - keyCharacteristicsCount} characteristics do not apply: ${formatList(auraCharacteristicsNotApply)}.`;
  }

  // Additional sentence based on the count of key characteristics
  let keyCharacteristicsSummary = "";
  if (keyCharacteristicsCount < 3) {
    keyCharacteristicsSummary = `Fewer than three key characteristics apply. Based on your answers, fewer than three of the key features associated with migraine aura are present. This suggests that your symptom profile does not fully align with Criterion C as defined by the ICHD-3 guidelines.`;
  } else {
    keyCharacteristicsSummary = `Your responses indicate that the ICHD-3 criteria for migraine with aura have likely been met. This means that a sufficient number of typical features—such as gradual onset, full reversibility, limited duration, and association with headache—were present to suggest a pattern consistent with migraine aura. These criteria help differentiate migraine aura from other possible neurological conditions.`;
  }

  console.log("Additional Sentence:", additionalSentence); // Debugging line
  console.log("Symptom Experience Sentence:", symptomExperienceSentence); // Debugging line
  console.log("Onset Window Sentence:", onsetWindowSentence); // Debugging line
  console.log("Symptom Progression Sentence:", symptomProgressionSentence); // Debugging line
  console.log("Impact Sentence:", impactSentence); // Debugging line
  console.log("Remedies Sentence:", remediesSentence); // Debugging line
  console.log("Prior Medical Sentence:", priorMedicalSentence); // Debugging line
  console.log("Aura Characteristics Sentence:", auraCharacteristicsSentence); // Debugging line
  console.log("Key Characteristics Summary:", keyCharacteristicsSummary); // Debugging line

  // Aura detail
  let details = "";
  if (summaryLines.length > 0) {
    details = `${capitalizeFirstLetter(subj)} report${subj === "They" ? "" : "s"} multiple aura modalities, including:<ul style="margin: 0; padding: 0; list-style-type: none;">`;
    summaryLines.forEach((line) => {
      details += `<li style="margin-bottom: 4px;">${line}</li>`;
    });
    details += "</ul>";
  } else {
    details = `${capitalizeFirstLetter(subj)} did not report any aura symptoms.`;
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
    neg = `<p>No ${formatList(labels)} aura symptoms were reported.</p>`;
  }

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
        margin-bottom: 4px; /* Adjust as needed */
      }
    </style>
    <h4>Expert System Patient Report: Migraine Aura Assessment</h4>
    <p>${intro}</p><p>${additionalSentence} ${symptomExperienceSentence} ${onsetWindowSentence} ${impactSentence} ${remediesSentence} ${priorMedicalSentence}</p>
    <p>${symptomProgressionSentence}</p>
    <p>${details}</p>
    ${neg}
    <p>${auraCharacteristicsSentence}</p>
    <p>${keyCharacteristicsSummary}</p>
  `;
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
