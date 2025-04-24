console.log("Script is loaded"); // Debugging line to confirm script is loaded

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired"); // Debugging line
  const output = document.getElementById("summaryOutput");
  const continueBtn = document.getElementById("continueBtn");

  console.log("Output element:", output); // Debugging line
  console.log("Continue button element:", continueBtn); // Debugging line

  const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const acuteChronicData = JSON.parse(
    localStorage.getItem("acuteChronic") || "{}",
  );
  const acuteChronicAnswers = JSON.parse(
    localStorage.getItem("acuteChronicAnswers") || "{}",
  );

  console.log("Data from localStorage:", data); // Debugging line
  console.log("User Info from localStorage:", userInfo); // Debugging line
  console.log("Acute Chronic Data from localStorage:", acuteChronicData); // Debugging line
  console.log("Acute Chronic Answers from localStorage:", acuteChronicAnswers); // Debugging line

  if (!Object.keys(data).length) {
    output.innerHTML =
      "<p>❗ No data found. Please go through the previous steps first.</p>";
    continueBtn.style.display = "none";
    return;
  }

  function formatList(items) {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
  }

  function getPronouns(gender) {
    const g = (gender || "").toLowerCase();
    if (g === "male") return { subj: "He", poss: "his", label: "he/him" };
    if (g === "female") return { subj: "She", poss: "her", label: "she/her" };
    return { subj: "They", poss: "their", label: "they/them" };
  }

  function generateNarrativeSummary(
    data,
    userInfo,
    acuteChronicData,
    acuteChronicAnswers,
  ) {
    const { subj, poss, label } = getPronouns(userInfo.gender);
    const fullName = userInfo.name ? `${userInfo.name} (${label})` : subj;

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
        additionalSentence = `${fullName} is experiencing new or unfamiliar symptoms that might be related to migraine.`;
        break;
      case "acute-chronic-A2":
        additionalSentence = `${fullName} has had aura symptoms before, but something feels different this time.`;
        break;
      case "acute-chronic-A3":
        additionalSentence = `${fullName} has been having migraine with aura episodes for a while.`;
        break;
      case "acute-chronic-A4":
        additionalSentence = `${fullName} has been having aura symptoms without any headache for a while.`;
        break;
      case "acute-chronic-A5":
        additionalSentence = `${fullName} is gathering general information about migraine auras.`;
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
          symptomExperienceSentence = `${fullName} reports that this is the first time experiencing these symptoms.`;
          break;
        case "acute-chronic-B2":
          symptomExperienceSentence = `${fullName} reports having experienced these symptoms once or twice in the past, but not recently.`;
          break;
        case "acute-chronic-B3":
          if (reason === "acute-chronic-A1") {
            symptomExperienceSentence = `${fullName} reports that while the symptoms are new, they have been experiencing them for a while now.`;
          } else if (reason === "acute-chronic-A2") {
            symptomExperienceSentence = `${fullName} reports not having experienced such symptoms before, but has been getting these changed aura symptoms regularly for a while now.`;
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
          onsetWindowSentence = `${fullName} reports that the symptoms started within the last 24 hours.`;
          break;
        case "acute-chronic-C2":
          onsetWindowSentence = `${fullName} reports that the symptoms started within the last 7 days.`;
          break;
        case "acute-chronic-C3":
          onsetWindowSentence = `${fullName} reports that the symptoms started within the last 30 days.`;
          break;
        case "acute-chronic-C4":
          onsetWindowSentence = `${fullName} reports that the symptoms started more than 30 days ago.`;
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
        symptomProgressionSentence = `${fullName} reports that the symptoms have become more intense.`;
        break;
      case "acute-chronic-D2":
        symptomProgressionSentence = `${fullName} reports that the symptoms have eased or improved.`;
        break;
      case "acute-chronic-D3":
        symptomProgressionSentence = `${fullName} reports that the symptoms have stayed about the same.`;
        break;
      default:
        symptomProgressionSentence = "";
    }

    console.log("Additional Sentence:", additionalSentence); // Debugging line
    console.log("Symptom Experience Sentence:", symptomExperienceSentence); // Debugging line
    console.log("Onset Window Sentence:", onsetWindowSentence); // Debugging line
    console.log("Symptom Progression Sentence:", symptomProgressionSentence); // Debugging line

    // Aura detail
    let details = "";
    if (summaryLines.length > 0) {
      details = `${subj} report${subj === "They" ? "" : "s"} multiple aura modalities, including:<br><ul>`;
      summaryLines.forEach((line) => {
        details += `<li>${line}</li>`;
      });
      details += "</ul>";
    } else {
      details = `${subj} did not report any aura symptoms.`;
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
        modalityMap[k].replace(
          / features| disturbances| symptoms| changes/,
          "",
        ),
      );
      neg = `<p>No ${formatList(labels)} aura symptoms were reported.</p>`;
    }

    return `
                    <h3>Summary:</h3>
                    <p><strong>${intro}</strong></p>
                    <p>${additionalSentence}</p>
                    <p>${symptomExperienceSentence}</p>
                    <p>${onsetWindowSentence}</p>
                    <p>${symptomProgressionSentence}</p>
                    <p>${details}</p>
                    ${neg}
                `;
  }

  output.innerHTML = generateNarrativeSummary(
    data,
    userInfo,
    acuteChronicData,
    acuteChronicAnswers,
  );

  continueBtn.addEventListener("click", () => {
    const next = continueBtn.getAttribute("data-next");
    window.location.href = next;
  });
});
