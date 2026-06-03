# MAF Redesign — Astro package

The bespoke redesign of migraine-aura-foundation.org, packaged as an
**Astro + TypeScript** project. This is the *presentation layer* of the
Hugo→Astro migration (see `docs/astro-migration-plan.md`): it replaces
Hextra/Starlight chrome with the custom design system, and leaves clear
seams where the typed **rule engine / i18n / PDF** work plugs in.

> **Relationship to the migration plan.** The plan assumed Starlight for
> chrome. Since then the foundation commissioned this custom design, so we do
> **not** use Starlight — `Nav`, `Footer`, `ThemeToggle`, sidebar/TOC, and the
> questionnaire UI are all hand-built components here. Everything else in the
> plan stands: engine in `src/lib/engine`, rules in `src/lib/rules`, i18n
> catalogs in `src/i18n`, PDF in `src/lib/pdf`, Vitest, GH Pages deploy.

## Run it

```bash
cd astro
npm install      # or pnpm / yarn
npm run dev      # http://localhost:4321
npm run build    # static output in ./dist
```

(Requires Node 18+. The lockfile is intentionally omitted — install fresh.)

## Structure

```
astro/
  astro.config.mjs          # no Starlight; i18n block stubbed for en+de
  src/
    config/site.ts          # brand, nav links, footer columns — single source
    data/voices.ts          # homepage patient voices
    styles/                 # theme.css (tokens, light+dark) + page CSS
    layouts/BaseLayout.astro # html shell, fonts, no-flash theme init, Nav+Footer
    components/             # the design system (see table below)
    content/
      config.ts             # collections: symptoms, blog (light Zod schemas)
      symptoms/*.md         # Field Guide entries
      blog/*.md             # Science Blog posts
    pages/
      index.astro                    # homepage
      field-guide.astro              # Field Guide index
      experiences.astro              # art gallery
      about.astro                    # mission / values / timeline
      aura-check.astro               # questionnaire step (redesigned chrome)
      blog/index.astro               # blog index (reads collection)
      blog/[...slug].astro           # blog article (renders collection)
      symptom-guide/[...slug].astro  # Field Guide article (renders collection + TOC)
  public/img/               # patient artwork + app screenshots
```

## Mockup → component map

The static HTML mockups at the project root were the design source. Each maps
to Astro as follows:

| Mockup (root)        | Astro route / component |
|----------------------|--------------------------|
| `index.html`         | `pages/index.astro` |
| `field-guide.html`   | `pages/field-guide.astro` |
| `symptom.html`       | `pages/symptom-guide/[...slug].astro` (content-driven) |
| `symptom-check.html` | `pages/aura-check.astro` |
| `experiences.html`   | `pages/experiences.astro` |
| `blog.html`          | `pages/blog/index.astro` |
| `blog-post.html`     | `pages/blog/[...slug].astro` (content-driven) |
| `about.html`         | `pages/about.astro` |

### Components

| Component | Role |
|-----------|------|
| `Brand`, `Nav`, `Footer` | site chrome (Nav has theme toggle + mobile menu island) |
| `Button`, `Kicker`, `Tag`, `SectionHead`, `Callout` | atoms |
| `FeatureCard`, `Quote`, `CtaBand`, `PostCard`, `Track`, `GalleryFigure`, `TimelineItem` | content blocks |
| `ProgressSteps` | the fixed 3-section questionnaire indicator (+ optional sub-step bar) |
| `OptionGroup` | checkbox/radio question UI: info popovers, exclusive "None", "Other" textarea, Continue gate |

## Design tokens

All in `src/styles/theme.css` under `:root` (light) and `:root[data-theme="dark"]`.
Calm clinical blue (`--primary`), terracotta warmth (`--warm`), warm paper
neutrals, defined in `oklch`. Type: **Source Serif 4** (display) + **Hanken
Grotesk** (UI/body). Change the palette in one place.

## Content collections

`src/content/config.ts` defines `symptoms` and `blog` with light schemas
(per the plan, frontmatter stays loose for v1 — tighten with Zod later).
Add a Field Guide entry by dropping a markdown file in `content/symptoms/`;
add a post in `content/blog/`. Routes and the blog index pick it up
automatically. To add German, enable the `i18n` block in `astro.config.mjs`
and mirror content under `content/<collection>/de/`.

## Wiring the questionnaire to the engine

`OptionGroup` preserves the DOM contract from `NEW-DESIGN/QUESTIONNAIRE-BRIEF.md`
(real `<input name=…>` controls, exclusive-none, other-reveal, a Continue
button). Its island handles all the UI gating. The single seam to the typed
engine is marked `TODO(migration)` in the `<script>` block — persist the answer
via the storage helpers, then call `flowRunner.goNext(stepId)`. The 3-section
model in `ProgressSteps` is fixed, as the brief requires.

## Not yet ported (follow the plan)

- `src/lib/engine/*`, `src/lib/rules/aura-symptom-check.ts` (Phase 1)
- `src/i18n/{en,de}.yaml` — copy verbatim; swap hardcoded strings in
  `aura-check.astro` / `OptionGroup` props for `t()` calls (Phase 1–2)
- `src/lib/pdf/generateAuraReport.ts` (Phase 3)
- PostHog `<head>` snippet → add to `BaseLayout` (Phase 5)
- Vitest suite, GH Actions deploy (Phase 1 / 6)
