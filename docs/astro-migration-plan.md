# Hugo → Astro migration of migraine-aura-foundation.org

> **Status**: Active — execution started 2026-06-03. Plan approved 2026-05-29. A custom design was commissioned after approval and is now adopted as-is (see **Design system** below), which replaces the original "Starlight chrome" decision with hand-built chrome. This file is the single source of truth and **supersedes** `app/README.md` (the design handoff's notes). When resuming, no need to re-plan.

## Context

The site is currently Hugo + Hextra theme, with substantial recent investment in a declarative decision-flow architecture (state-store, rules-engine, flow-runner) and full i18n for aura-symptom-check (en + de, ~120 keys, ~14 page siblings, language-aware navigation). Pain points that motivate the migration:

- **Loose typing on content**: Hugo markdown front matter has no schema; mistakes silently render.
- **Mixed rule/UI logic**: clinical assessment branching is split between `flow.js` (declarative URL graph) and `summaryGeneration.js` (imperative narrative composition with conditional sentences). Untyped, untested.
- **No regression safety net**: zero automated tests today; behaviour preservation relies on manual walkthroughs.
- **PDF lineage**: jsPDF output is hard to debug, no version stamp ties the PDF back to the rule set that produced it.
- **Cache busting**: Hugo doesn't fingerprint `/static/js/*.js` URLs, causing repeated "stale module" issues during the i18n work.
- **Theme constraints**: Hextra's chrome (sidebar, switcher, dark mode, search) is good but coupled tightly to Hugo's data structures; small UX changes require theme-level workarounds.

Goal: port to Astro + TypeScript with a bespoke design system (no Starlight), extracting the rule engine into a typed package with unit tests, while preserving en + de URLs and content. Multi-language continues with en + de as concrete locales; further languages slot in by adding catalogs + content siblings.

## Design system

The foundation commissioned a custom design after this plan was approved. It is **adopted as-is** — do not redesign it.

- **Source of truth (read-only)**: `NEW-DESIGN/handoff/` (gitignored) holds the 8 static HTML mockups, screenshots, and the design CSS. Treat it as the reference; the living code is in `app/`.
- **Tokens**: `app/src/styles/theme.css` — OKLCH palette (warm-paper neutrals, calm clinical blue `--primary`, terracotta `--warm`), light + dark via `:root[data-theme="dark"]`. Type: **Source Serif 4** (display) + **Hanken Grotesk** (UI/body).
- **Brand change**: this replaces the current Hugo identity (teal `#08768a` / yellow `#eeff41` / IBM Plex Sans). The Roboto TTF stays, but only inside the PDF (jsPDF Unicode), not as a web font.

## Existing scaffold

A working Astro project already exists at `app/` (promoted from `NEW-DESIGN/handoff/astro/`). It ships the **presentation layer**: ~17 components (Brand, Nav, Footer, Button, Kicker, Tag, SectionHead, Callout, FeatureCard, Quote, CtaBand, PostCard, Track, GalleryFigure, TimelineItem, ProgressSteps, OptionGroup), 8 page routes, `BaseLayout` (html shell, fonts, no-flash theme init, Nav+Footer), `config/site.ts` (brand + nav + footer), `data/voices.ts`, and content collections (`symptoms`, `blog`) with light Zod schemas. The remaining work below is the **engine / rules / i18n / PDF / content / deploy** layer that plugs into this scaffold.

## Stack (decided)

- **Build**: Astro + TypeScript, **single project (no monorepo)**.
- **Chrome**: **bespoke design system, no Starlight.** Nav (with language switcher + dark-mode toggle + mobile menu island), Footer, sidebar/TOC, and the questionnaire UI are hand-built Astro components already present in `app/` (see **Existing scaffold**). OKLCH tokens + Source Serif 4 / Hanken Grotesk.
- **Islands**: Astro components with minimal `client:visible` islands using vanilla TS. **No additional framework** (Svelte/React) for v1 — add only if a specific interaction proves too painful in plain TS.
- **Rules**: **TypeScript `.ts` files**. Direct imports, autocomplete, refactor-safe, no parser dependency. (i18n catalogs stay YAML since translators edit them.)
- **PDF**: **Keep jsPDF** + Roboto. Already migrated to i18n with proper Unicode rendering; don't change two things at once.
- **Tests**: **Vitest unit tests only** for v1 — covers the rule engine, narrative composition, i18n. No Playwright, no vignette suite. Manual walkthrough is the cutover gate.
- **Hosting**: GitHub Pages via GitHub Actions. URL redirects via `404.html` fallback.
- **i18n**: Astro's built-in i18n. Carry `en.yaml` + `de.yaml` forward verbatim.

## Repo structure

Single Astro project. During the build phase it lives in **`app/`** so Hugo (repo root) and Astro build side-by-side; at cutover `app/` flattens to the repo root (the "single project, src at root" end state). `app/public/` holds tracked design assets — distinct from Hugo's gitignored root `public/` build output (the `.gitignore` rule is anchored to `/public/`).

```
app/
  astro.config.mjs                # Astro + built-in i18n (en+de); no Starlight
  src/
    pages/                        # Astro routes (replaces Hugo content URL routing)
    content/                      # Markdown collections (symptoms, blog; loose schema)
      <collection>/de/            # German mirror — Astro i18n directory layout
    components/                   # design-system components (already built) + forms,
                                  #   criterionC, criterionB (Phase 2)
    config/site.ts                # brand, nav links, footer columns
    styles/theme.css              # OKLCH design tokens (light + dark)
    lib/
      engine/                     # state-store, rules-engine, flow-runner, helpers, narrative, i18n
      rules/                      # TypeScript rule defs: aura-symptom-check.ts, steps.ts (registry)
      pdf/                        # generateAuraReport.ts (jsPDF port to TS) + roboto.ts
    i18n/{en,de}.yaml             # Message catalogs (1:1 port of current i18n/*.yaml)
    fonts/Roboto-Regular.ttf      # PDF only
  tests/                          # Vitest unit tests
.github/workflows/deploy.yml      # GH Pages deploy (build app/, publish app/dist)
```

## Migration phases

### Phase 0 — Promote scaffold + reconcile (~half day) — DONE 2026-06-03
- Copied `NEW-DESIGN/handoff/astro/` → tracked `app/`; anchored `.gitignore` `public/` → `/public/`; ignored `app/{node_modules,dist,.astro}`; pinned Node via `app/.nvmrc`.
- `npm install` + `npm run build` clean (11 pages). Baseline committed verbatim.
- Reconciled this plan doc into the single source of truth.

### Phase 1 — Foundation + Engine (~2-3 days)
- Scaffold already promoted (Phase 0). Configure built-in i18n in `astro.config.mjs`: `en` default, `de` second locale, `prefixDefaultLocale: false`.
- Port `static/js/decision-flow/{state-store,rules-engine,flow-runner,i18n}.js` to `app/src/lib/engine/` in TS. Same API shape (`flowRunner.goNext`, `store.get/set`, `t(key, fallback, params)`). `goNext` returns the resolved URL (no `window.location.href`); keep a pure `nextUrl(stepId)` for tests. Replace the `window.__symptomCheckI18n` auto-init with an explicit `setCatalog()` fed per locale at build.
- Port `static/js/modules/aura-symptom-check/flow.js` to `src/lib/rules/aura-symptom-check.ts` as a typed object literal.
- Port `static/js/aura-symptom-check/{helpers,summaryGeneration}.js` to `src/lib/engine/`. Preserve `getPronouns(gender, lang)`, `formatList(items, lang)`, and the `{Subj}/{subj}/{poss}/{fullName}` parameter convention in narrative templates.
- Copy `i18n/en.yaml` + `i18n/de.yaml` → `src/i18n/` verbatim.
- Write Vitest unit tests for: state-store get/set, rules-engine resolve (static + branch arrays), flow-runner goNext with `langURL()`, t() parameter substitution, getPronouns/formatList for en + de, narrative composition for canned input objects.
- GH Actions workflow → GH Pages deploy.

### Phase 2 — Flow UI (~3-4 days) — generalize the single handoff step into the full flow
The scaffold ships ONE static question step (`app/src/pages/aura-check.astro` + `OptionGroup.astro`, with a `TODO(migration)` seam). The real flow is ~14 branching steps. Generalize, don't hand-author 14 pages:
- **One dynamic route** `app/src/pages/aura-symptom-check/[...step].astro` driven by a **step registry** `app/src/lib/rules/steps.ts` (per stepId: type, i18n keys for heading/prompt/options, `ProgressSteps` position, engine stepId). `getStaticPaths()` emits one page per registry entry × locale.
- **Reuse `OptionGroup`** unchanged for checkbox/radio steps (feed options from i18n via `t()`, not hardcoded English). Add 3 new components in `app/src/components/aura-symptom-check/` for the demographic form, criterionC quiz, and criterionB modality selector (port the Hugo shortcodes). `modality-summary` → terminal page calling `narrative.ts` + the PDF button.
- Keep `OptionGroup.astro`, `ProgressSteps.astro`, `questionnaire.css`, and the `.flow/.qcard` markup as-is (preserve the design + DOM contract).
- **Wire the seam**: collect checked values + "Other" textarea → persist via storage helpers → `flowRunner.goNext(stepId)` → `window.location.assign(langURL(url))`. Plain `location.assign` for v1 (state in localStorage survives reloads); View Transitions can come later.
- Walk en + de flows manually in dev against live Hugo prod; iterate until parity.

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
- **Nav / Footer / theme toggle / mobile menu** → already hand-built in the scaffold (`Nav.astro`, `Footer.astro`, `BaseLayout.astro` no-flash init). Just confirm the en↔de language switcher round-trips.
- **PostHog** (cookieless, EU region) → port `layouts/partials/custom/posthog.html` verbatim into `BaseLayout.astro`'s `<head>` slot — same `phc_…` project key, same `persistence: 'memory'` / `autocapture: false` / `disable_session_recording: true` flags, same `eu.i.posthog.com` host. No consent banner. (GA was removed in commit `c7d2d33` before this migration.)
- **Swiper carousels** → keep Swiper only if the scaffold's `Track` / `GalleryFigure` don't already cover the galleries; check first.
- **Alpine.js** → drop (was Hextra-only).
- **Search dropped for v1.** Pagefind was a Starlight default; with custom chrome it needs a standalone index + a hand-built search UI matching the design system (net-new, no mockup). The site is content-light; ship without search and add Pagefind later (it runs standalone with Astro) if analytics show demand.

### Phase 6 — Cutover (~1 day)
**Production is GitHub Pages already** (confirmed): Hugo is built+published to GH Pages by `pages.yaml` on push to `main`. So cutover swaps the *content* GH Pages serves (Hugo → Astro) — **no DNS change, no separate host, no CNAME file** (the custom domain `migraine-aura-foundation.org` lives in repo Settings and persists; Hugo uploaded `./public` without a CNAME and so does the Astro deploy).
- Manual clinical walkthrough: 5-10 representative flows in both en and de, compare narrative paragraph and PDF body side-by-side against current Hugo production. (DONE 2026-06-03 — passed.)
- The swap is staged on `redesign`: `deploy.yml` (build `app/` → publish `app/dist` to Pages, on push:main) is added and Hugo's `pages.yaml` is deleted, so **merging `redesign` → `main` atomically swaps Hugo → Astro**.
- Pre-flight: confirm GH Pages Source = "GitHub Actions"; pick www-vs-apex canonical (astro `site` is www, Hugo built apex).
- **Rollback = revert the merge commit on `main`** (restores `pages.yaml`, drops the Astro deploy; next push to main rebuilds Hugo). Hugo source stays in git history.

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
- Hugo shortcodes (`layouts/shortcodes/aura-symptom-check/**/*.html`, `criterionB.html`, `criterionC.html`) → Astro components in `app/src/components/aura-symptom-check/`.
- Hugo partials + Hextra theme chrome → already rebuilt as the bespoke design system in `app/` (Nav/Footer/BaseLayout); nothing to port.
- Alpine.js (used by Hextra) → drop.
- FlexSearch (Hextra) → dropped for v1 (no search; Pagefind deferred — see Phase 5).
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

**New** (all under `app/` during the build phase):
- `app/astro.config.mjs` — Astro + built-in i18n config (no Starlight).
- `app/src/lib/engine/{state-store,rules-engine,flow-runner,helpers,narrative,i18n,storage}.ts`.
- `app/src/lib/rules/{aura-symptom-check,steps}.ts` (rule graph + step registry).
- `app/src/i18n/{en,de}.yaml` (1:1 ports).
- `app/src/lib/pdf/{generateAuraReport,roboto}.ts`.
- `app/tests/**/*.test.ts` — Vitest unit tests.
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
- Production is GH Pages (not a separate host), so there is no DNS step and no parallel host to keep running.
- Rollback = revert the merge commit on `main` (restores Hugo's `pages.yaml`, drops the Astro deploy); Hugo source remains in git history.
- Archive the Hugo repo after 7 days.

## Decisions still open (settle in Phase 1)

- **Astro i18n strategy** — DECIDED: built-in `i18n` config (`prefixDefaultLocale: false`), not `astro-i18next`.
- **Search** — DECIDED: dropped for v1 (no Pagefind). Revisit if analytics show demand.
- **Client navigation** — DECIDED: plain `window.location.assign(langURL(url))` for v1 (state in localStorage survives reloads); View Transitions deferred.
- **Cutover layout** — open: at Phase 6, flatten `app/` → repo root (matches "src at root") vs keep `app/` and point CI there. Decide before it affects paths.
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
- Brief risk window during cutover (manual walk → merge `redesign`→`main`, which swaps the GH Pages content).
- Loose frontmatter typing (no Zod schemas on content).

These can all be added later if a specific bug or audit need surfaces.
