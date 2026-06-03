// catalogs.ts — loads the YAML message catalogs at build time and exposes them
// by locale. The dotted-key YAML (e.g. `flow.summary.intro: "…"`) parses to a
// flat object, which is exactly the shape t() consumes. Imported via Vite's
// `?raw` so this works identically in the Astro build and in Vitest.

import yaml from "js-yaml";
import enRaw from "../../i18n/en.yaml?raw";
import deRaw from "../../i18n/de.yaml?raw";
import type { Catalog, Lang } from "./types";

const catalogs: Record<string, Catalog> = {
  en: (yaml.load(enRaw) as Catalog) ?? {},
  de: (yaml.load(deRaw) as Catalog) ?? {},
};

export function getCatalog(lang: Lang): Catalog {
  return catalogs[(lang || "en").toLowerCase()] ?? catalogs.en;
}
