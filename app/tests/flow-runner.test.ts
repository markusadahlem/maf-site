import { describe, expect, it } from "vitest";
import { FlowRunner } from "../src/lib/engine/flow-runner";
import { flow, type FlowState } from "../src/lib/rules/aura-symptom-check";

function runnerWith(state: FlowState) {
  return new FlowRunner(flow, () => state);
}

describe("FlowRunner.nextUrl()", () => {
  it("resolves a linear modality step", () => {
    expect(runnerWith({}).nextUrl("visual-aura")).toBe(
      "/aura-symptom-check/modality/sensory-aura/",
    );
  });

  it("routes reason-for-visit A1 → symptom-experience-1", () => {
    const r = runnerWith({ acuteChronic: { reason: "acute-chronic-A1" } });
    expect(r.nextUrl("reason-for-visit")).toBe(
      "/aura-symptom-check/acute-chronic/symptom-experience-1",
    );
  });

  it("routes reason-for-visit A2 → symptom-experience-2", () => {
    const r = runnerWith({ acuteChronic: { reason: "acute-chronic-A2" } });
    expect(r.nextUrl("reason-for-visit")).toBe(
      "/aura-symptom-check/acute-chronic/symptom-experience-2",
    );
  });

  it.each(["acute-chronic-A3", "acute-chronic-A4", "acute-chronic-A5"])(
    "routes reason-for-visit %s → symptom-progression",
    (reason) => {
      const r = runnerWith({ acuteChronic: { reason } });
      expect(r.nextUrl("reason-for-visit")).toBe(
        "/aura-symptom-check/acute-chronic/symptom-progression",
      );
    },
  );

  it("throws when reason-for-visit has no matching branch (corrupt state)", () => {
    const r = runnerWith({ acuteChronic: { reason: "acute-chronic-ZZ" } });
    expect(() => r.nextUrl("reason-for-visit")).toThrow(/no branch matched/);
  });

  it("routes onset-window (A1/A2) → symptom-progression", () => {
    const r = runnerWith({ acuteChronic: { reason: "acute-chronic-A1" } });
    expect(r.nextUrl("onset-window")).toBe(
      "/aura-symptom-check/acute-chronic/symptom-progression/",
    );
  });

  it("throws on a terminal node (modality-summary)", () => {
    expect(() => runnerWith({}).nextUrl("modality-summary")).toThrow(
      /no next defined/,
    );
  });

  it("throws on an unknown step", () => {
    expect(() => runnerWith({}).nextUrl("nope")).toThrow(/unknown step/);
  });
});

describe("FlowRunner.goNext()", () => {
  it("returns the raw URL for English", () => {
    expect(runnerWith({}).goNext("visual-aura", "en")).toBe(
      "/aura-symptom-check/modality/sensory-aura/",
    );
  });

  it("returns a language-prefixed URL for German", () => {
    expect(runnerWith({}).goNext("visual-aura", "de")).toBe(
      "/de/aura-symptom-check/modality/sensory-aura/",
    );
  });
});
