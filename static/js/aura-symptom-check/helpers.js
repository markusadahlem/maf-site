// helpers.js — small utilities reused by summaryGeneration.js and PDF code.

function detectLang() {
  if (typeof document === "undefined") return "en";
  return (document.documentElement.lang || "en").toLowerCase();
}

export function getPronouns(gender, lang) {
  const g = (gender || "").toLowerCase();
  const l = (lang || detectLang()).toLowerCase();

  if (l === "de") {
    if (g === "male") return { subj: "er", poss: "sein", label: "er/sein" };
    if (g === "female") return { subj: "sie", poss: "ihre", label: "sie/ihre" };
    return { subj: "sie", poss: "ihre", label: "sie/ihre" };
  }

  // English fallback
  if (g === "male") return { subj: "he", poss: "his", label: "he/him" };
  if (g === "female") return { subj: "she", poss: "her", label: "she/her" };
  return { subj: "they", poss: "their", label: "they/them" };
}

export function formatList(items, lang) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  const l = (lang || detectLang()).toLowerCase();
  const conjunction = l === "de" ? "und" : "and";
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  // German: no Oxford comma. English: keep it.
  const lastSep = l === "de" ? ` ${conjunction} ` : `, ${conjunction} `;
  return `${items.slice(0, -1).join(", ")}${lastSep}${items.at(-1)}`;
}
