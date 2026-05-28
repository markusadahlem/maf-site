// rules-engine.js — resolves a step's `next` declaration to a URL.
//
// Forms supported (Phase 1 only uses the first; the others arrive
// in Phase 2 when branching steps are migrated):
//
//   1. Static string:    next: "/some/url/"
//   2. Function:         next: (state) => "/some/url/"
//   3. Branch array:     next: [
//                          { when: (state) => state.x === "a", goto: "/a/" },
//                          { when: (state) => state.x === "b", goto: "/b/" },
//                          { default: "/fallback/" }
//                        ]

export function resolve(next, state) {
    if (typeof next === "string") return next;

    if (typeof next === "function") return next(state);

    if (Array.isArray(next)) {
        for (const branch of next) {
            if ("default" in branch) return branch.default;
            if (branch.when && branch.when(state)) return branch.goto;
        }
        throw new Error("rules-engine: no branch matched and no default provided");
    }

    throw new Error(`rules-engine: unrecognized next form: ${JSON.stringify(next)}`);
}
