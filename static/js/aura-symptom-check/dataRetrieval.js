import { store, MODULE_ID } from "/js/modules/aura-symptom-check/index.js";

export function getDataFromLocalStorage() {
  return {
    data: store.get(MODULE_ID, "criterionBAnswers") || {},
    userInfo: store.get(MODULE_ID, "userInfo") || {},
    acuteChronicData: store.get(MODULE_ID, "acuteChronic") || {},
    acuteChronicAnswers: store.get(MODULE_ID, "acuteChronicAnswers") || {},
    auraCharacteristicsAnswers:
      store.get(MODULE_ID, "auraCharacteristicsAnswers") || [],
  };
}
