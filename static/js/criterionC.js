import { store, MODULE_ID } from "/js/modules/aura-symptom-check/index.js";
import { t, langURL } from "/js/decision-flow/i18n.js";

const questions = [
  {
    text: t("flow.criterionC.q1.text"),
    explanation: t("flow.criterionC.q1.explanation"),
  },
  {
    text: t("flow.criterionC.q2.text"),
    explanation: t("flow.criterionC.q2.explanation"),
  },
  {
    text: t("flow.criterionC.q3.text"),
    explanation: t("flow.criterionC.q3.explanation"),
  },
  {
    text: t("flow.criterionC.q4.text"),
    explanation: t("flow.criterionC.q4.explanation"),
  },
  {
    text: t("flow.criterionC.q5.text"),
    explanation: t("flow.criterionC.q5.explanation"),
  },
  {
    text: t("flow.criterionC.q6.text"),
    explanation: t("flow.criterionC.q6.explanation"),
  },
];

let current = 0;
let answers = [];

const container = document.getElementById("quizContainer");
const result = document.getElementById("resultC");

function showQuestion() {
  result.textContent = "";

  if (current === questions.length) {
    let summaryHTML = "<ul>";
    questions.forEach((q, index) => {
      const response =
        answers[index] === true
          ? t("flow.criterionC.summary.yesLabel")
          : t("flow.criterionC.summary.noLabel");
      summaryHTML += `<li>${q.text} <strong>${response}</strong></li>`;
    });
    summaryHTML += "</ul>";

    container.innerHTML = `
              <p><strong>${t("flow.criterionC.summary.intro")}</strong></p>
              <p>${t("flow.criterionC.summary.summaryHeading")}</p>
              ${summaryHTML}
              <p>${t("flow.criterionC.summary.clickPrompt")}</p>
              <button class="btn btn-outline" data-action="show-result">${t("flow.criterionC.buttons.showResult")}</button>
              <button class="btn btn-secondary" data-action="go-back">${t("flow.criterionC.buttons.back")}</button>
            `;
    return;
  }

  const q = questions[current];
  container.innerHTML = `
    <p><strong>${t("flow.criterionC.questionLabel", null, { n: current + 1, total: questions.length })}</strong></p>
    <p>${q.text}
      <button data-action="explain" title="${t("flow.criterionC.moreInfo")}" class="info-icon">ⓘ</button>
    </p>
    <button class="btn btn-outline" data-action="answer-yes">${t("flow.criterionC.buttons.yes")}</button>
    <button class="btn btn-outline" data-action="answer-no">${t("flow.criterionC.buttons.no")}</button>
    ${current > 0 ? `<br><br><button class="btn btn-secondary" data-action="go-back">${t("flow.criterionC.buttons.back")}</button>` : ""}
    <div id="explanation" style="display:none; margin-top: 0.5rem; font-style: italic;"></div>
  `;
}

function answer(choice) {
  answers[current] = choice;
  current++;
  showQuestion();
}

function goBack() {
  if (current > 0) current--;
  showQuestion();
}

function showExplanation() {
  const explanation = questions[current].explanation;
  const explEl = document.getElementById("explanation");
  explEl.textContent = explanation;
  explEl.style.display = "block";
}

function showResult() {
  const score = answers.filter((a) => a === true).length;
  const passed = score >= 3;

  store.set(MODULE_ID, "auraCharacteristicsAnswers", answers);

  // redirectToDemographicInfo is a transient cross-page signal, not flow state.
  const flag = localStorage.getItem("redirectToDemographicInfo");

  if (flag) {
    window.location.href = langURL("/aura-symptom-check/demographic-information/");
  } else {
    window.location.href = langURL(
      passed
        ? "/aura-symptom-check/criterioncmeet/"
        : "/aura-symptom-check/criterioncnotmeet/",
    );
  }
}

container.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  switch (action) {
    case "answer-yes": answer(true); break;
    case "answer-no": answer(false); break;
    case "go-back": goBack(); break;
    case "explain": showExplanation(); break;
    case "show-result": showResult(); break;
  }
});

showQuestion(); // Start
