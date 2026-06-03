// flow-runner.ts — consumes a flow definition and computes step transitions.
//
// Unlike the Hugo version, goNext() does NOT navigate (no window.location.href).
// It returns the language-prefixed target URL; the caller performs the
// navigation (e.g. window.location.assign(...) in the question island). This
// keeps the runner pure and testable. `nextUrl()` returns the raw, un-prefixed
// URL for assertions against the flow graph.

import { resolve } from "./rules-engine";
import { langURL } from "./i18n";
import type { Flow } from "./types";

export class FlowRunner<S> {
  constructor(
    private flow: Flow<S>,
    private stateProvider: () => S,
  ) {}

  /** Resolve a step's `next` to its raw URL (no language prefix). */
  nextUrl(stepId: string): string {
    const step = this.flow.steps[stepId];
    if (!step) {
      throw new Error(`flow-runner: unknown step "${stepId}"`);
    }
    if (step.next === null || step.next === undefined) {
      throw new Error(
        `flow-runner: step "${stepId}" has no next defined ` +
          `(terminal node — no forward navigation)`,
      );
    }
    return resolve(step.next, this.stateProvider());
  }

  /**
   * Resolve a step's target as a language-prefixed URL ready to navigate to.
   * Does not navigate — the caller does. Pass `lang` explicitly outside the
   * browser; in the browser it is read from <html lang>.
   */
  goNext(stepId: string, lang?: string): string {
    return langURL(this.nextUrl(stepId), lang);
  }
}
