// info-popovers.ts — one delegated click handler for the Field Guide info
// popovers (the ⓘ buttons). Idempotent: multiple components import it, but in
// dev/bundled builds every flow component's script loads on every page, so it
// must attach exactly once or clicks toggle twice and never open.

declare global {
  interface Window {
    __auraInfoPopovers?: boolean;
  }
}

export function initInfoPopovers(): void {
  if (typeof window === "undefined" || window.__auraInfoPopovers) return;
  window.__auraInfoPopovers = true;

  document.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest("[data-info-btn]");
    document.querySelectorAll('.info[data-open="true"]').forEach((i) => {
      if (!btn || i !== btn.closest(".info")) i.setAttribute("data-open", "false");
    });
    if (btn) {
      const info = btn.closest(".info")!;
      info.setAttribute(
        "data-open",
        info.getAttribute("data-open") === "true" ? "false" : "true",
      );
      e.preventDefault();
    }
  });
}
