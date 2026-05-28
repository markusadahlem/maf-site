import { store, MODULE_ID } from "/js/modules/aura-symptom-check/index.js";

const questions = [
  {
    text: "Did at least one aura symptom spread gradually over at least 5 minutes?",
    explanation:
      "E.g., a flickering spot in your visual field that slowly expands.",
  },
  {
    text: "Did two or more aura symptoms occur in succession?",
    explanation: "E.g., visual aura followed by tingling.",
  },
  {
    text: "Did each individual aura symptom last between 5–60 minutes?",
    explanation: "Shorter or longer durations are less typical.",
  },
  {
    text: "Was at least one aura symptom unilateral (on one side only)?",
    explanation:
      "E.g., vision affected in only one eye, or tingling only on one side.",
  },
  {
    text: "Was at least one aura symptom positive (e.g., flashing lights or pins and needles)?",
    explanation: "Positive means an added sensation (not loss of function).",
  },
  {
    text: "Was the aura accompanied or followed within 60 minutes by headache?",
    explanation: "Timing matters — headache should be within 1 hour of aura.",
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
      const response = answers[index] === true ? "✅ Yes" : "❌ No";
      summaryHTML += `<li>${q.text} <strong>${response}</strong></li>`;
    });
    summaryHTML += "</ul>";

    container.innerHTML = `
              <p><strong>You’ve completed the section on aura characteristics.</strong></p>
              <p>Here’s a summary of your responses:</p>
              ${summaryHTML}
              <p>Click below to see whether your responses meet the clinical threshold for this part.</p>
              <button class="btn" data-action="show-result">✅ Yes, show my result</button>
              <button class="btn btn-secondary" data-action="go-back">← Go Back</button>
            `;
    return;
  }

  const q = questions[current];
  container.innerHTML = `
    <p><strong>Question ${current + 1} of ${questions.length}</strong></p>
    <p>${q.text}
      <button data-action="explain" title="More info" class="info-icon">ⓘ</button>
    </p>
    <button class="btn" data-action="answer-yes">Yes</button>
    <button class="btn btn-outline" data-action="answer-no">No</button>
    ${current > 0 ? `<br><br><button class="btn btn-secondary" data-action="go-back">← Go Back</button>` : ""}
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
    window.location.href = "/aura-symptom-check/demographic-information/";
  } else {
    window.location.href = passed
      ? "/aura-symptom-check/criterioncmeet/"
      : "/aura-symptom-check/criterioncnotmeet/";
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
