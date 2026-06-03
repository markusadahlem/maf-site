import { describe, expect, it } from "vitest";
import { resolve } from "../src/lib/engine/rules-engine";
import type { Branch } from "../src/lib/engine/types";

interface S {
  reason?: string;
}

describe("rules-engine resolve()", () => {
  it("returns a static string URL unchanged", () => {
    expect(resolve("/a/", {})).toBe("/a/");
  });

  it("calls a function form with the state", () => {
    expect(resolve((s: S) => `/${s.reason}/`, { reason: "x" })).toBe("/x/");
  });

  it("returns the first matching branch's goto", () => {
    const next: Branch<S>[] = [
      { when: (s) => s.reason === "a", goto: "/a/" },
      { when: (s) => s.reason === "b", goto: "/b/" },
    ];
    expect(resolve(next, { reason: "b" })).toBe("/b/");
  });

  it("falls through to a default arm", () => {
    const next: Branch<S>[] = [
      { when: (s) => s.reason === "a", goto: "/a/" },
      { default: "/fallback/" },
    ];
    expect(resolve(next, { reason: "zzz" })).toBe("/fallback/");
  });

  it("throws when no branch matches and there is no default", () => {
    const next: Branch<S>[] = [{ when: (s) => s.reason === "a", goto: "/a/" }];
    expect(() => resolve(next, { reason: "zzz" })).toThrow(/no branch matched/);
  });
});
