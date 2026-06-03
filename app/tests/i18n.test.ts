import { afterEach, describe, expect, it } from "vitest";
import { langURL, setCatalog, t } from "../src/lib/engine/i18n";

afterEach(() => setCatalog({}));

describe("t()", () => {
  it("returns the catalog value when the key exists", () => {
    setCatalog({ "greet.hello": "Hello" });
    expect(t("greet.hello")).toBe("Hello");
  });

  it("returns the fallback when the key is missing", () => {
    setCatalog({});
    expect(t("nope", "fallback text")).toBe("fallback text");
  });

  it("returns the key itself when missing and no fallback", () => {
    setCatalog({});
    expect(t("some.missing.key")).toBe("some.missing.key");
  });

  it("substitutes {param} placeholders", () => {
    setCatalog({ "greet.name": "Hello {name}, you have {n} messages" });
    expect(t("greet.name", undefined, { name: "Alex", n: 3 })).toBe(
      "Hello Alex, you have 3 messages",
    );
  });

  it("leaves unknown placeholders intact", () => {
    setCatalog({ "x": "a {known} b {unknown}" });
    expect(t("x", undefined, { known: "Y" })).toBe("a Y b {unknown}");
  });
});

describe("langURL()", () => {
  it("leaves English paths at the root", () => {
    expect(langURL("/aura-symptom-check/x/", "en")).toBe(
      "/aura-symptom-check/x/",
    );
  });

  it("prefixes non-English locales", () => {
    expect(langURL("/aura-symptom-check/x/", "de")).toBe(
      "/de/aura-symptom-check/x/",
    );
  });

  it("does not double-prefix an already-prefixed path", () => {
    expect(langURL("/de/aura-symptom-check/x/", "de")).toBe(
      "/de/aura-symptom-check/x/",
    );
  });

  it("returns relative paths unchanged", () => {
    expect(langURL("relative", "de")).toBe("relative");
  });
});
