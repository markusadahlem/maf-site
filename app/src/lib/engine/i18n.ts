// i18n.ts — message-key resolver.
//
// The active catalog is set explicitly via setCatalog() — in Astro the page's
// locale catalog is resolved at build time and handed to the island, so client
// JS only ever holds the active language's strings (no global window inject).
// When a key is missing, t() returns the fallback if provided, else the key.

import type { Catalog, Params } from "./types";

let activeCatalog: Catalog = {};

export function setCatalog(catalog: Catalog | null | undefined): void {
  activeCatalog = catalog || {};
}

export function t(key: string, fallback?: string, params?: Params): string {
  const tpl = activeCatalog[key] ?? fallback ?? key;
  if (!params) return tpl;
  return tpl.replace(/\{(\w+)\}/g, (_, k: string) =>
    params[k] !== undefined ? String(params[k]) : `{${k}}`,
  );
}

// Prefix an absolute path with the current language code, matching Hugo's
// defaultContentLanguageInSubdir=false convention (en stays at root, others
// get a /<lang> prefix). Pass `lang` explicitly for testability; in the
// browser it falls back to <html lang="…"> then the URL path (e.g. /de/...).
export function langURL(path: string, lang?: string): string {
  if (!path.startsWith("/")) return path;

  let code = (lang || "").toLowerCase();
  if (!code && typeof document !== "undefined") {
    code = (document.documentElement.lang || "").toLowerCase();
    if (!code || code === "en") {
      const m = window.location.pathname.match(/^\/([a-z]{2})\//);
      if (m) code = m[1];
    }
  }

  return !code || code === "en" || path.startsWith(`/${code}/`)
    ? path
    : `/${code}${path}`;
}
