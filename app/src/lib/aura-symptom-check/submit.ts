// submit.ts — client-side handler that persists a checkbox/radio step's answer
// in the exact legacy storage shape, then navigates via the typed engine.
//
// Wired by the flow route: it listens for the `aura:continue` event that
// OptionGroup dispatches on Continue, reads the persist descriptor + answer off
// the form's data-* attributes, writes to the state-store, and assigns the next
// URL from flowRunner.goNext(). Used for `checkbox` and `radio` step types;
// `motor`, `demographic`, and `criterionC` carry their own submit logic.

import { flowRunner, store, MODULE_ID } from "../aura-symptom-check";
import { addSelectedModality, setModalityAnswer } from "../engine/storage";
import type {
  AcuteChronicAnswers,
  AcuteChronicData,
} from "../engine/types";

interface PersistMeta {
  kind: "modality" | "acuteChronic" | "acuteChronicAnswers";
  modality?: string;
  field?: string;
}

function persistModality(modality: string, selected: string[], description: string) {
  // Visual carries the retinal sub-answer: a checked "retinal" option is stored
  // under its own `retinal` modality (selected: ["yes"]) and dropped from visual.
  if (modality === "visual" && selected.includes("retinal")) {
    setModalityAnswer("retinal", { selected: ["yes"], description: "" });
    addSelectedModality("retinal");
    selected = selected.filter((v) => v !== "retinal");
  }
  setModalityAnswer(modality, { selected, description });
  addSelectedModality(modality);
}

export function submitStep(form: HTMLFormElement): void {
  const stepId = form.dataset.step;
  if (!stepId) return;
  const persist = JSON.parse(form.dataset.persist || "{}") as PersistMeta;
  const name = form.dataset.name || "";

  const checked = Array.from(
    form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`),
  ).map((i) => i.value);
  const description =
    form.querySelector<HTMLTextAreaElement>("[data-other-text]")?.value.trim() || "";

  switch (persist.kind) {
    case "modality":
      persistModality(persist.modality!, checked, description);
      break;
    case "acuteChronic": {
      const data = store.get<AcuteChronicData>(MODULE_ID, "acuteChronic") || {};
      (data as Record<string, string>)[persist.field!] = checked[0];
      store.set(MODULE_ID, "acuteChronic", data);
      break;
    }
    case "acuteChronicAnswers": {
      const data =
        store.get<AcuteChronicAnswers>(MODULE_ID, "acuteChronicAnswers") || {};
      (data as Record<string, string>)[persist.field!] = checked[0];
      store.set(MODULE_ID, "acuteChronicAnswers", data);
      break;
    }
  }

  window.location.assign(flowRunner.goNext(stepId));
}
