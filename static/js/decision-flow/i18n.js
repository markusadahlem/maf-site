// i18n.js — message-key resolver.
//
// Auto-initializes from window.__symptomCheckI18n if Hugo's partial has
// injected a catalog on the page. Callers can also set a catalog explicitly
// via setCatalog (useful for tests or non-page contexts). When a key is
// missing, t() returns the fallback if provided, else the key itself.

let activeCatalog =
    (typeof window !== "undefined" && window.__symptomCheckI18n) || {};

export function setCatalog(catalog) {
    activeCatalog = catalog || {};
}

export function t(key, fallback, params) {
    const tpl = activeCatalog[key] ?? fallback ?? key;
    if (!params) return tpl;
    return tpl.replace(/\{(\w+)\}/g, (_, k) =>
        params[k] !== undefined ? params[k] : `{${k}}`,
    );
}

// Prefix an absolute path with the current language code, matching Hugo's
// defaultContentLanguageInSubdir=false convention (en stays at root, others
// get a /<lang> prefix). Reads the language from <html lang="…">, with a
// fallback to the URL path (e.g. /de/...) for resilience.
export function langURL(path) {
    if (typeof document === "undefined" || !path.startsWith("/")) return path;
    let lang = (document.documentElement.lang || "").toLowerCase();
    if (!lang || lang === "en") {
        const m = window.location.pathname.match(/^\/([a-z]{2})\//);
        if (m) lang = m[1];
    }
    const result =
        !lang || lang === "en" || path.startsWith(`/${lang}/`)
            ? path
            : `/${lang}${path}`;
    console.log("[langURL]", {
        input: path,
        htmlLang: document.documentElement.lang,
        urlPath: window.location.pathname,
        detected: lang,
        output: result,
    });
    return result;
}
