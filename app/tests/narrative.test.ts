import { beforeEach, describe, expect, it } from "vitest";
import { generateNarrativeSummary } from "../src/lib/engine/narrative";
import type { NarrativeInput } from "../src/lib/engine/narrative";
import { getCatalog } from "../src/lib/engine/catalogs";
import { setCatalog } from "../src/lib/engine/i18n";
import type { Lang } from "../src/lib/engine/types";

/** Build a canned narrative input; override per case. */
function input(over: Partial<NarrativeInput> = {}): NarrativeInput {
  return {
    lang: "en",
    userInfo: { gender: "female", name: "Alex", diagnosisYear: 2018, headacheDays: 8 },
    data: { visual: { selected: ["flashing-lights"] } },
    acuteChronicData: { reason: "acute-chronic-A1" },
    acuteChronicAnswers: {
      symptomExperience: "acute-chronic-B1",
      onsetWindow: "acute-chronic-C1",
      symptomProgression: "acute-chronic-D1",
      impact: "acute-chronic-E1",
      remedies: "acute-chronic-F1",
      priorMedical: "acute-chronic-G1",
    },
    auraCharacteristicsAnswers: [true, true, true, false, false, false], // 3 → meets
    ...over,
  };
}

function summary(over: Partial<NarrativeInput> = {}, lang: Lang = "en"): string {
  setCatalog(getCatalog(lang));
  return generateNarrativeSummary(input({ lang, ...over }));
}

beforeEach(() => setCatalog({}));

describe("generateNarrativeSummary — English reason arms", () => {
  const cases: [string, string][] = [
    ["acute-chronic-A1", "is experiencing new or unfamiliar symptoms"],
    ["acute-chronic-A2", "has had aura symptoms before, but something feels different"],
    ["acute-chronic-A3", "has been having migraine with aura episodes for a while"],
    ["acute-chronic-A4", "has been having aura symptoms without any headache"],
    ["acute-chronic-A5", "is gathering general information about migraine auras"],
  ];

  it.each(cases)("%s renders its sentence", (reason, fragment) => {
    const html = summary({ acuteChronicData: { reason } });
    expect(html).toContain(fragment);
  });
});

describe("generateNarrativeSummary — Criterion C conclusion", () => {
  it("reports 'meets' when ≥3 characteristics apply", () => {
    const html = summary({
      auraCharacteristicsAnswers: [true, true, true, false, false, false],
    });
    expect(html).toContain(
      "ICHD-3 criteria for migraine with aura have likely been met",
    );
  });

  it("reports 'does not meet' when <3 characteristics apply", () => {
    const html = summary({
      auraCharacteristicsAnswers: [true, true, false, false, false, false],
    });
    expect(html).toContain("Fewer than three key characteristics apply");
  });

  it("counts the reported characteristics in the summary line", () => {
    const html = summary({
      auraCharacteristicsAnswers: [true, true, true, true, false, false],
    });
    // 4 of 6 reported, 2 do not apply
    expect(html).toContain("following 4 of 6 aura characteristics");
    expect(html).toContain("These 2 characteristics do not apply");
  });
});

describe("generateNarrativeSummary — intro & name", () => {
  it("uses the patient name and diagnosis year", () => {
    const html = summary();
    expect(html).toContain(
      "Alex was first diagnosed with migraine in 2018",
    );
    expect(html).toContain("approximately 8 headache days per month");
  });
});

describe("generateNarrativeSummary — German", () => {
  it("renders the German intro and reason sentence", () => {
    const html = summary({ acuteChronicData: { reason: "acute-chronic-A1" } }, "de");
    expect(html).toContain("wurde im Jahr 2018 erstmals mit Migräne diagnostiziert");
    expect(html).toContain("erlebt neue oder ungewohnte Symptome");
  });

  it("renders the German 'meets' conclusion", () => {
    const html = summary({}, "de");
    expect(html).toContain(
      "ICHD-3-Kriterien für Migräne mit Aura wahrscheinlich erfüllt",
    );
  });
});
