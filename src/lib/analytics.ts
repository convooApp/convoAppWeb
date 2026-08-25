/* ------------------------------------------------------------------
   A thin wrapper over the gtag snippet in index.html.

   Nothing is sent from a dev build — the property is small enough that a
   morning of local clicking would visibly distort it. In dev the calls go to
   the console instead, so the wiring is still checkable.
   ------------------------------------------------------------------ */

type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (command: string, name: string, params?: Params) => void;
  }
}

export function track(name: string, params: Params = {}) {
  if (typeof window === "undefined") return;

  if (!import.meta.env.PROD) {
    console.debug("[analytics]", name, params);
    return;
  }

  window.gtag?.("event", name, params);
}
