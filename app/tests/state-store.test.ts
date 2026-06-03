// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import {
  get,
  listSnapshots,
  loadSnapshot,
  saveSnapshot,
  set,
} from "../src/lib/engine/state-store";

const MOD = "test-module";

beforeEach(() => localStorage.clear());

describe("state-store get/set", () => {
  it("round-trips a namespaced value", () => {
    set(MOD, "userInfo", { name: "Alex" });
    expect(get(MOD, "userInfo")).toEqual({ name: "Alex" });
  });

  it("returns null for an unknown key", () => {
    expect(get(MOD, "missing")).toBeNull();
  });

  it("writes the wrapped form to the namespaced key", () => {
    set(MOD, "k", 42);
    const raw = JSON.parse(localStorage.getItem("test-module:k")!);
    expect(raw.value).toBe(42);
    expect(raw.moduleId).toBe(MOD);
    expect(typeof raw.ts).toBe("number");
  });

  it("falls back to a legacy un-namespaced key", () => {
    localStorage.setItem("legacyKey", JSON.stringify({ legacy: true }));
    expect(get(MOD, "legacyKey")).toEqual({ legacy: true });
  });

  it("prefers the namespaced value over the legacy one", () => {
    localStorage.setItem("dup", JSON.stringify("legacy"));
    set(MOD, "dup", "fresh");
    expect(get(MOD, "dup")).toBe("fresh");
  });
});

describe("snapshots", () => {
  it("captures the module's keys and reloads them by id", () => {
    set(MOD, "a", 1);
    set(MOD, "b", { x: 2 });
    const id = saveSnapshot(MOD, { note: "first" });

    const list = listSnapshots(MOD);
    expect(list).toHaveLength(1);

    const snap = loadSnapshot(MOD, id)!;
    expect(snap.metadata).toEqual({ note: "first" });
    expect(snap.state).toEqual({ a: 1, b: { x: 2 } });
  });

  it("does not include the snapshots key itself in a snapshot", () => {
    set(MOD, "a", 1);
    const id = saveSnapshot(MOD);
    const snap = loadSnapshot(MOD, id)!;
    expect(Object.keys(snap.state)).toEqual(["a"]);
  });
});
