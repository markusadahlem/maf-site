# Hugo → Astro migration of migraine-aura-foundation.org

> **Status**: Approved, deferred. Plan approved 2026-05-29; user intends to start execution in approximately 2 weeks (~2026-06-12). When resuming, no need to re-plan — this file is the source of truth.

## Context

The site is currently Hugo + Hextra theme, with substantial recent investment in a declarative decision-flow architecture (state-store, rules-engine, flow-runner) and full i18n for aura-symptom-check (en + de, ~120 keys, ~14 page siblings, language-aware navigation). Pain points that motivate the migration:

- **Loose typing on content**: Hugo markdown front matter has no schema; mistakes silently render.
- **Mixed rule/UI logic**: clinical assessment branching is split between `flow.js` (declarative URL graph) and `summaryGeneration.js` (imperative narrative composition with conditional sentences). Untyped, untested.
- **No regression safety net**: zero automated tests today; behaviour preservation relies on manual walkthroughs.
- **PDF lineage**: jsPDF output is hard to debug, no version stamp ties the PDF back to the rule set that produced it.
- **Cache busting**: Hugo doesn't fingerprint `/static/js/*.js` URLs, causing repeated "stale module" issues during the i18n work.
- **Theme constraints**: Hextra's chrome (sidebar, switcher, dark mode, search) is good but coupled tightly to Hugo's data structures; small UX changes require theme-level workarounds.

Goal: port to Astro + TypeScript + Starlight, extracting the rule engine into a typed package with vignette tests, while preserving en + de URLs and content. Multi-language continues with en + de as concrete locales; further languages slot in by adding catalogs + content siblings.

## Stack (decided)

- **Build**: Astro + TypeScript, **single project (no monorepo)**.
- **Chrome**: Starlight — sidebar nav, language switcher (i18n-aware routing), dark mode, mobile layout, Pagefind search, TOC. Customize via slot overrides where needed.
- **Islands**: Astro components with minimal `client:visible` islands using vanilla TS. **No additional framework** (Svelte/React) for v1 — add only if a specific interaction proves too painful in plain TS.
- **Rules**: **TypeScript `.ts` files**. Direct imports, autocomplete, refactor-safe, no parser dependency. (i18n catalogs stay YAML since translators edit them.)
- **PDF**: **Keep jsPDF** + Roboto. Already migrated to i18n with proper Unicode rendering; don't change two things at once.
- **Tests**: **Vitest unit tests only** for v1 — covers the rule engine, narrative composition, i18n. No Playwright, no vignette suite. Manual walkthrough is the cutover gate.
- **Hosting**: GitHub Pages via GitHub Actions. URL redirects via `404.html` fallback.
- **i18n**: Astro's built-in i18n. Carry `en.yaml` + `de.yaml` forward verbatim.

## Repo structure

Single Astro project:

```
src/
  pages/                          # Astro routes (replaces Hugo content URL routing)
  content/                        # Markdown (single shared frontmatter schema if any)
    aura-symptom-check/{en,de}/   # Language-routed via Astro i18n
    blog/, experiences/, art/, voices/, about/, contact/, research/
  components/                     # Astro components for forms, criterionC, criterionB, etc.
  lib/
    engine/                       # state-store, rules-engine, flow-runner, helpers, narrative, i18n
    rules/                        # TypeScript rule definitions (e.g. aura-symptom-check.ts)
    pdf/                          # generateAuraReport.ts (jsPDF port to TS)
  i18n/{en,de}.yaml               # Message catalogs (1:1 port of current i18n/*.yaml)
  fonts/Roboto-Regular.ttf
tests/                            # Vitest unit tests
.github/workflows/deploy.yml      # GH Pages deploy on push to main
```

## Migration phases

### Phase 1 — Foundation + Engine (~2-3 days)
- `pnpm create astro@latest` with the Starlight integration. Configure i18n: `en` default, `de` as second locale.
- Port `static/js/decision-flow/{state-store,rules-engine,flow-runner,i18n}.js` to `src/lib/engine/` in TS. Same API shape (`flowRunner.goNext`, `store.get/set`, `t(key, fallback, params)`).
- Port `static/js/modules/aura-symptom-check/flow.js` to `src/lib/rules/aura-symptom-check.ts` as a typed object literal.
- Port `static/js/aura-symptom-check/{helpers,summaryGeneration}.js` to `src/lib/engine/`. Preserve `getPronouns(gender, lang)`, `formatList(items, lang)`, and the `{Subj}/{subj}/{poss}/{fullName}` parameter convention in narrative templates.
- Copy `i18n/en.yaml` + `i18n/de.yaml` → `src/i18n/` verbatim.
- Write Vitest unit tests for: state-store get/set, rules-engine resolve (static + branch arrays), flow-runner goNext with `langURL()`, t() parameter substitution, getPronouns/formatList for en + de, narrative composition for canned input objects.
- GH Actions workflow → GH Pages deploy.

### Phase 2 — Flow UI (~2-3 days)
- Aura-symptom-check pages as Astro routes consuming the engine.
- Form components as Astro components with vanilla TS islands (one per step type: checkbox group, radio group, "yes/no + location detail", textarea, demographic form).
- criterionC quiz, criterionB modality selector, PDF download button as standalone Astro components.
- Wire `flowRunner.goNext()` to Astro's `navigate()` (no `window.location.href`).
- Walk en + de flows manually in dev; iterate until parity feels right.

### Phase 3 — PDF (~1 day)
- Port `static/js/generateAuraReport.js` to `src/lib/pdf/generateAuraReport.ts` (still jsPDF, now typed).
- Port Roboto registration (`static/js/decision-flow/fonts/roboto.js` → `src/lib/pdf/roboto.ts`). Reuse the same TTF file.
- Same i18n key conventions (`flow.report.*`, `flow.summary.*`).
- Manually generate en + de PDFs, verify umlauts + translated narrative.

### Phase 4 — Content migration (~1-2 days)
- Copy `content/aura-symptom-check/**/*.md` → `src/content/aura-symptom-check/{en,de}/`. Astro's i18n directory layout replaces Hugo's `.de.md` sibling pattern.
- Copy other sections (`blog`, `experiences`, `art`, `voices`, `about`, `contact`, `research`).
- Preserve URLs via `[...slug].astro` page templates.

### Phase 5 — Chrome carry-overs (~1-2 days)
- **Brevo newsletter** → Astro component (port existing HTML form + Brevo endpoint URL).
- **Swiper carousels** → keep Swiper (framework-agnostic).
- **Google Tag Manager** (G-93YYDEHTQD) → Astro layout `<head>` slot.
- **Alpine.js** → drop, Starlight + vanilla TS covers what Alpine did for Hextra.
- **FlexSearch (Hextra)** → Pagefind (Starlight default).

### Phase 6 — Cutover (~1 day)
- Manual clinical walkthrough: 5-10 representative flows in both en and de, compare narrative paragraph and PDF body side-by-side against current Hugo production.
- Configure GH Pages custom domain (`migraine-aura-foundation.org`); CNAME file in repo root.
- DNS swap from current Hugo host to GH Pages.
- Keep Hugo repo on its current host for **7 days** as fallback; archive after.

## Preserve / rebuild list

**Preserve (port directly)**:
- `i18n/en.yaml`, `i18n/de.yaml` → `src/i18n/`. Same dotted-key naming, same parameter convention.
- `static/js/modules/aura-symptom-check/flow.js` → `src/lib/rules/aura-symptom-check.ts`.
- `static/js/aura-symptom-check/summaryGeneration.js` → `src/lib/engine/narrative.ts`.
- `getPronouns(gender, lang)`, `formatList(items, lang)` → `src/lib/engine/helpers.ts`.
- `static/js/generateAuraReport.js` → `src/lib/pdf/generateAuraReport.ts` (still jsPDF).
- `static/fonts/Roboto-Regular.ttf` → `src/fonts/`.
- URL structure: `/aura-symptom-check/...` for English, `/de/aura-symptom-check/...` for German.

**Rebuild (Hugo-specific or theme-coupled)**:
- Hugo shortcodes (`layouts/shortcodes/aura-symptom-check/**/*.html`, `criterionB.html`, `criterionC.html`) → Astro components in `src/components/`.
- Hugo partials + Hextra theme chrome → Starlight defaults + slot overrides.
- Alpine.js (used by Hextra) → drop.
- FlexSearch (Hextra) → Pagefind.
- Hugo's `relLangURL` → Astro's `getRelativeLocaleUrl`.
- The 14 `.de.md` sibling files created during the i18n work → not needed (Astro's i18n directory layout handles language routing natively).
- `layouts/partials/aura-symptom-check/i18n-catalog.html` (the inline `window.__symptomCheckI18n` injection) → not needed. Astro statically resolves i18n at build time; client JS receives only the active language's strings.

**Drop entirely**:
- `static/js/aura-symptom-check/acute-chronic/modality-summary.md` (stray file in static dir).
- Hugo's livereload script.
- Any `.de.md` sibling whose only purpose was making Hugo render the German URL.

## Existing utilities being reused

- Dotted-key i18n schema (`flow.report.*`, `flow.summary.*`) — verbatim.
- `{Subj}/{subj}/{poss}/{fullName}` parameter convention in narrative templates — verbatim.
- `t(key, fallback, params)` API shape — same in TS.
- `getPronouns(gender, lang)` German output (`er/sein`, `sie/ihre`) and `formatList(items, "de")` (no Oxford comma, "und" conjunction) — preserved.
- Roboto-Regular TTF — same file, same jsPDF registration.

## Critical files (representative; not exhaustive)

**New**:
- `astro.config.mjs` — Astro + Starlight + i18n config.
- `src/lib/engine/{state-store,rules-engine,flow-runner,helpers,narrative,i18n}.ts`.
- `src/lib/rules/aura-symptom-check.ts`.
- `src/i18n/{en,de}.yaml` (1:1 ports).
- `src/lib/pdf/{generateAuraReport,roboto}.ts`.
- `tests/**/*.test.ts` — Vitest unit tests.
- `.github/workflows/deploy.yml`.

**Migrated patterns**:
- All `content/**/*.md` → `src/content/**/*.md` under Astro's i18n directory layout.
- All `layouts/shortcodes/aura-symptom-check/**/*.html` → `src/components/aura-symptom-check/**/*.astro` (with vanilla TS islands where interactive).
- All `static/js/*.js` flow JS → merged into `src/lib/engine/` or dropped (replaced by Astro components).

## Verification

### Vitest unit tests (the only automated layer for v1)
- **Engine**: state-store get/set/snapshots; rules-engine `resolve()` for static URLs and branch arrays; flow-runner `goNext()` produces `/de/...` URLs on de pages via `langURL`.
- **i18n**: `t()` returns catalog value when present, fallback when missing, applies `{name}` parameter substitution.
- **Helpers**: `getPronouns` returns correct triples for en/de × {male, female, other}; `formatList` produces correct conjunctions per language.
- **Narrative**: feed canned inputs (one per reason A1-A5, plus a mixed case), assert generated HTML contains expected sentence fragments in en and de.

### Manual clinical walkthrough (cutover gate)
- 5-10 representative flows in en + de.
- Compare narrative paragraph and PDF body side-by-side against current Hugo production.
- Specifically verify C-criterion characteristics count, modality list, conclusion sentence.
- Verify the language switcher round-trip preserves state.

### Cutover safety
- Keep Hugo repo on its current host for 7 days post-cutover.
- Rollback = DNS revert if anything material is wrong.
- Archive the Hugo repo after 7 days.

## Decisions still open (settle in Phase 1)

- **Astro i18n strategy**: built-in `i18n` config vs `astro-i18next` plugin. Built-in is simpler; pick if it covers our needs.
- **Pagefind index scope**: all content vs key pages only. Default to all.
- **The 7 partially-translated locales** (fr, es, it, uk, ru, nl, da) in current `i18n/*.yaml`. Probably leave the yaml files but don't add them to Astro's i18n config until real translators populate them. Existing partial-language URLs (none for the flow pages) will 404 quietly.
- **Content frontmatter schema**: none for v1 (Astro accepts loose frontmatter). Add Zod schemas later if a specific bug warrants it.

## Realistic effort

**1-2 person-weeks** of focused work.

- Phase 1 (foundation + engine + Vitest): 2-3 days.
- Phase 2 (flow UI in Astro components): 2-3 days.
- Phase 3 (PDF port): 1 day.
- Phase 4 (content copy): 1-2 days.
- Phase 5 (chrome carry-overs): 1-2 days.
- Phase 6 (manual walk + cutover): 1 day.

Trade-offs accepted vs the original brief:
- No automated UI tests (Vitest covers rules; manual walk covers UI).
- No PDF byte-stability test or version-stamp metadata.
- Brief risk window during cutover (manual walk → DNS swap).
- Loose frontmatter typing (no Zod schemas on content).

These can all be added later if a specific bug or audit need surfaces.
