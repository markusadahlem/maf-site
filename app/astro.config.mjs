// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
//
// The redesign uses a bespoke chrome (custom Nav/Footer/ThemeToggle), so this
// config does NOT pull in Starlight. The migration plan's engine / i18n / PDF
// phases are unaffected — they live under src/lib and are wired into the
// Astro components built here. To add German routing, enable the i18n block
// below and mirror content under src/content/<collection>/de/.
export default defineConfig({
  site: 'https://www.migraine-aura-foundation.org',

  // i18n: {
  //   defaultLocale: 'en',
  //   locales: ['en', 'de'],
  //   routing: { prefixDefaultLocale: false },
  // },

  // Markdown rendering for content collections (Field Guide, Blog).
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
