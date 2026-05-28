// i18n.js — message-key resolver. Phase 1 stub.
//
// Phase 5 wires this to <html lang="…"> and per-module catalogs. For now
// the resolver is a no-op identity that returns the key itself; this lets
// future call sites use t(key) without breaking anything in Phase 1.

let activeCatalog = {};

export function setCatalog(catalog) {
    activeCatalog = catalog || {};
}

export function t(key, fallback) {
    return activeCatalog[key] ?? fallback ?? key;
}
