document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("summaryOutput");
  const continueBtn = document.getElementById("continueBtn");

  const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

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

  function generateNarrativeSummary(data, userInfo) {
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
        "other symptoms (usually summarised as brainstem or formerly basilar-typeaura)",
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
      <p>${details}</p>
      ${neg}
    `;
  }

  output.innerHTML = generateNarrativeSummary(data, userInfo);

  continueBtn.addEventListener("click", () => {
    const next = continueBtn.getAttribute("data-next");
    window.location.href = next;
  });
});
