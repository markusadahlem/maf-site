// aura-symptom-check.ts — module entry. Configures and exports the FlowRunner
// the question islands use to compute the next URL, plus a getState() that
// collects the module's localStorage keys for rules evaluation.

import { FlowRunner } from "./engine/flow-runner";
import * as store from "./engine/state-store";
import { flow, MODULE_ID, type FlowState } from "./rules/aura-symptom-check";

export { MODULE_ID, store };

export function getState(): FlowState {
  return {
    userInfo: store.get(MODULE_ID, "userInfo") ?? undefined,
    criterionBAnswers: store.get(MODULE_ID, "criterionBAnswers") ?? undefined,
    selectedModalities: store.get(MODULE_ID, "selectedModalities") ?? undefined,
    acuteChronic: store.get(MODULE_ID, "acuteChronic") ?? undefined,
    acuteChronicAnswers:
      store.get(MODULE_ID, "acuteChronicAnswers") ?? undefined,
    auraCharacteristicsAnswers:
      store.get(MODULE_ID, "auraCharacteristicsAnswers") ?? undefined,
  };
}

export const flowRunner = new FlowRunner(flow, getState);
