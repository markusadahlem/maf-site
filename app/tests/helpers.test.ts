import { describe, expect, it } from "vitest";
import { formatList, getPronouns } from "../src/lib/engine/helpers";

describe("getPronouns()", () => {
  it("returns English triples", () => {
    expect(getPronouns("male", "en")).toEqual({
      subj: "he",
      poss: "his",
      label: "he/him",
    });
    expect(getPronouns("female", "en")).toEqual({
      subj: "she",
      poss: "her",
      label: "she/her",
    });
    expect(getPronouns("other", "en")).toEqual({
      subj: "they",
      poss: "their",
      label: "they/them",
    });
  });

  it("returns German triples (er/sein, sie/ihre)", () => {
    expect(getPronouns("male", "de")).toEqual({
      subj: "er",
      poss: "sein",
      label: "er/sein",
    });
    expect(getPronouns("female", "de")).toEqual({
      subj: "sie",
      poss: "ihre",
      label: "sie/ihre",
    });
    expect(getPronouns("other", "de")).toEqual({
      subj: "sie",
      poss: "ihre",
      label: "sie/ihre",
    });
  });
});

describe("formatList()", () => {
  it("handles empty and single-item lists", () => {
    expect(formatList([], "en")).toBe("");
    expect(formatList(["solo"], "en")).toBe("solo");
  });

  it("joins two items with the conjunction", () => {
    expect(formatList(["a", "b"], "en")).toBe("a and b");
    expect(formatList(["a", "b"], "de")).toBe("a und b");
  });

  it("uses the Oxford comma in English but not in German", () => {
    expect(formatList(["a", "b", "c"], "en")).toBe("a, b, and c");
    expect(formatList(["a", "b", "c"], "de")).toBe("a, b und c");
  });
});
