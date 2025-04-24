// File: /js/aura-symptom-check/modality/helpers.js

export function formatList(items) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

export function getPronouns(gender) {
  const g = (gender || "").toLowerCase();
  if (g === "male") return { subj: "he", poss: "his", label: "he/him" };
  if (g === "female") return { subj: "she", poss: "her", label: "she/her" };
  return { subj: "they", poss: "their", label: "they/them" };
}
