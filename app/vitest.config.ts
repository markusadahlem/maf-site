import { defineConfig } from "vitest/config";

// Plain Vite/Vitest config — the engine is framework-agnostic TS with relative
// imports, so no Astro integration is needed. `?raw` YAML imports resolve via
// Vite. Default to the node environment; the state-store test opts into jsdom
// via a `// @vitest-environment jsdom` docblock (it needs localStorage).
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
