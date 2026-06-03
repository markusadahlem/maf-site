// report.ts — client helpers for the modality-summary terminal: render the
// on-page narrative summary and trigger the PDF download. Reads the same
// localStorage keys the Hugo dataRetrieval.js did, and reuses the typed
// narrative composer + PDF generator.

import { store, MODULE_ID } from "../aura-symptom-check";
import { getSelectedModalities } from "../engine/storage";
import { generateNarrativeSummary } from "../engine/narrative";
import { setCatalog } from "../engine/i18n";
import { getCatalog } from "../engine/catalogs";
import { generateAuraReport } from "../pdf/generateAuraReport";
import type {
  AcuteChronicAnswers,
  AcuteChronicData,
  AuraCharacteristicsAnswers,
  CriterionBAnswers,
  Lang,
  UserInfo,
} from "../engine/types";

function detectLang(): Lang {
  return (document.documentElement.lang || "en").toLowerCase();
}

function getData() {
  return {
    data: store.get<CriterionBAnswers>(MODULE_ID, "criterionBAnswers") || {},
    userInfo: store.get<UserInfo>(MODULE_ID, "userInfo") || {},
    acuteChronicData: store.get<AcuteChronicData>(MODULE_ID, "acuteChronic") || {},
    acuteChronicAnswers:
      store.get<AcuteChronicAnswers>(MODULE_ID, "acuteChronicAnswers") || {},
    auraCharacteristicsAnswers:
      store.get<AuraCharacteristicsAnswers>(MODULE_ID, "auraCharacteristicsAnswers") || [],
  };
}

/** Render the narrative summary HTML into the given element. */
export function renderSummary(el: HTMLElement): void {
  const lang = detectLang();
  setCatalog(getCatalog(lang));
  el.innerHTML = generateNarrativeSummary({ ...getData(), lang });
}

/** Assemble the report payload and trigger the jsPDF download. */
export async function downloadReport(): Promise<void> {
  const lang = detectLang();
  setCatalog(getCatalog(lang));
  const d = getData();
  const a = d.auraCharacteristicsAnswers;
  await generateAuraReport("standard", {
    criterionB: d.data,
    userInfo: d.userInfo,
    acuteChronicData: d.acuteChronicData,
    acuteChronicAnswers: d.acuteChronicAnswers,
    auraCharacteristicsAnswers: a,
    modalities: getSelectedModalities(),
    characteristics: {
      progression: !!a[0],
      succession: !!a[1],
      duration: !!a[2],
      laterality: !!a[3],
      positive: !!a[4],
      headacheOnset: !!a[5],
    },
    lang,
  });
}
