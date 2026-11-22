import { useEffect, useState } from "react";

/**
 * The viewport is the source of truth for the active in-page section.
 * A fragment is used at first load, on hashchange and for history restoration;
 * no click-only React state and no rewriting native browser history on scroll.
 */
export function visibleSection(ids: readonly string[], headerBottom: number): string | null {
  const probe = headerBottom + 40; // account for scroll-margin below the sticky topbar
  let candidate: string | null = null;
  for (const id of ids) {
    const section = document.getElementById(id);
    if (!section) continue;
    const rect = section.getBoundingClientRect();
    // Only the section containing the probe is active; catalog and workspace are siblings.
    if (rect.top <= probe && rect.bottom > probe) candidate = id;
  }
  if (candidate) return candidate;
  // At the very start/end of the longread, choose the last section passed.
  let last: string | null = null;
  for (const id of ids) {
    const section = document.getElementById(id);
    if (section && section.getBoundingClientRect().top <= probe) last = id;
  }
  return last ?? ids.find((id) => document.getElementById(id) !== null) ?? null;
}

function sectionForHash(ids: readonly string[]): string | null {
  let hash = window.location.hash.slice(1);
  try { hash = decodeURIComponent(hash); } catch { /* malformed fragments are not section selectors */ }
  const target = document.getElementById(hash);
  if (!target) return null;
  // Later/inner named sections take precedence (e.g. #workspace inside #catalog).
  let match: string | null = null;
  for (const id of ids) {
    const section = document.getElementById(id);
    if (section?.contains(target)) match = id;
  }
  return match;
}

export function useActiveShowcaseSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const header = document.querySelector<HTMLElement>(".showcase-header");
      const next = visibleSection(ids, header?.getBoundingClientRect().bottom ?? 0);
      if (next) setActive((previous) => previous === next ? previous : next);
    };
    const schedule = () => {
      if (frame) return;
      frame = typeof window.requestAnimationFrame === "function"
        ? window.requestAnimationFrame(measure)
        : window.setTimeout(measure, 16);
    };
    const syncLocation = () => {
      const selected = sectionForHash(ids);
      if (selected) setActive(selected);
      schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", syncLocation);
    window.addEventListener("popstate", syncLocation);
    window.addEventListener("pageshow", schedule);
    syncLocation();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", syncLocation);
      window.removeEventListener("popstate", syncLocation);
      window.removeEventListener("pageshow", schedule);
      if (frame) {
        if (typeof window.cancelAnimationFrame === "function") window.cancelAnimationFrame(frame);
        else window.clearTimeout(frame);
      }
    };
  }, [ids]);
  return active;
}
