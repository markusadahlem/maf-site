// rules-engine.ts — resolves a step's `next` declaration to a URL.
//
// Forms supported:
//   1. Static string:    next: "/some/url/"
//   2. Function:         next: (state) => "/some/url/"
//   3. Branch array:     next: [
//                          { when: (state) => state.x === "a", goto: "/a/" },
//                          { when: (state) => state.x === "b", goto: "/b/" },
//                          { default: "/fallback/" }
//                        ]

import type { NextDecl } from "./types";

export function resolve<S>(next: NextDecl<S>, state: S): string {
  if (typeof next === "string") return next;

  if (typeof next === "function") return next(state);

  if (Array.isArray(next)) {
    for (const branch of next) {
      if ("default" in branch && branch.default !== undefined) {
        return branch.default;
      }
      if (branch.when && branch.when(state)) {
        if (branch.goto === undefined) {
          throw new Error("rules-engine: matched branch has no `goto`");
        }
        return branch.goto;
      }
    }
    throw new Error(
      "rules-engine: no branch matched and no default provided",
    );
  }

  throw new Error(
    `rules-engine: unrecognized next form: ${JSON.stringify(next)}`,
  );
}
