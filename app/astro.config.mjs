// @ts-check
import { defineConfig } from 'astro/config';
import remarkHeadingId from 'remark-heading-id';

// https://astro.build/config
//
// The redesign uses a bespoke chrome (custom Nav/Footer/ThemeToggle), so this
// config does NOT pull in Starlight. The migration plan's engine / i18n / PDF
// phases are unaffected — they live under src/lib and are wired into the
// Astro components built here. English stays at the root; German is served
// under /de/ (prefixDefaultLocale: false), matching Hugo's langURL convention.
export default defineConfig({
  site: 'https://migraine-aura-foundation.org',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: { prefixDefaultLocale: false },
  },

  // Markdown rendering for content collections (Field Guide, Blog).
  // remark-heading-id honours the `## Heading {#custom-id}` anchors the Hugo
  // field guide uses — the questionnaire's info-popovers deep-link to them.
  markdown: {
    shikiConfig: { theme: 'github-light' },
    remarkPlugins: [remarkHeadingId],
  },
});
