// flow-runner.js — consumes a flow definition and drives step transitions.
//
// Typical use from a module's index.js:
//
//   import { FlowRunner } from "/js/decision-flow/flow-runner.js";
//   import { flow } from "./flow.js";
//   import * as store from "/js/decision-flow/state-store.js";
//
//   const MODULE_ID = "aura-symptom-check";
//   const getState = () => ({
//     userInfo: store.get(MODULE_ID, "userInfo"),
//     ...
//   });
//
//   export const flowRunner = new FlowRunner(flow, getState);
//
// Step JS then calls flowRunner.goNext("<stepId>") instead of
// window.location.href = "...".

import { resolve } from "./rules-engine.js";
import { langURL } from "./i18n.js";

export class FlowRunner {
    constructor(flow, stateProvider) {
        this.flow = flow;
        this.stateProvider = stateProvider;
    }

    nextUrl(stepId) {
        const step = this.flow.steps[stepId];
        if (!step) {
            throw new Error(`flow-runner: unknown step "${stepId}"`);
        }
        if (step.next === null || step.next === undefined) {
            throw new Error(
                `flow-runner: step "${stepId}" has no next defined ` +
                `(terminal node — no forward navigation)`
            );
        }
        return resolve(step.next, this.stateProvider());
    }

    goNext(stepId) {
        window.location.href = langURL(this.nextUrl(stepId));
    }
}
