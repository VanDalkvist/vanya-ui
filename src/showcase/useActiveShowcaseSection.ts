import { useEffect, useState } from "react";

/**
 * The viewport is the source of truth for the active in-page section.
 * A fragment is used at first load, on hashchange and for history restoration;
 * no click-only React state and no rewriting native browser history on scroll.
 */
export function visibleSection(ids: readonly string[], headerBottom: number): string | null {
  // Native fragment alignment uses each target's computed scroll margin. Account
  // for that actual value as well as the measured sticky header.
  const probeFor = (section: HTMLElement) =>
    Math.max(headerBottom + 40, (parseFloat(getComputedStyle(section).scrollMarginTop) || 0) + 2);
  // At the end of a scrollable document the last section can be visible without
  // being able to reach the probe (the browser clamps scrollY).
  const root = document.documentElement;
  const lastId = ids[ids.length - 1];
  const lastSection = lastId ? document.getElementById(lastId) : null;
  if (lastSection && root.scrollHeight > window.innerHeight &&
      root.scrollHeight - window.innerHeight - window.scrollY <= 2) {
    const rect = lastSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > headerBottom) return lastId;
  }
  let candidate: string | null = null;
  for (const id of ids) {
    const section = document.getElementById(id);
    if (!section) continue;
    const rect = section.getBoundingClientRect();
    // Only the section containing the probe is active; catalog and workspace are siblings.
    const probe = probeFor(section);
    if (rect.top <= probe && rect.bottom > probe) candidate = id;
  }
  if (candidate) return candidate;
  // At the very start/end of the longread, choose the last section passed.
  let last: string | null = null;
  for (const id of ids) {
    const section = document.getElementById(id);
    if (section && section.getBoundingClientRect().top <= probeFor(section)) last = id;
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
    const header = document.querySelector<HTMLElement>(".showcase-header");
    const root = document.documentElement;
    const previousHeight = root.style.getPropertyValue("--showcase-header-height");
    const updateHeight = () => {
      const height = header?.getBoundingClientRect().height ?? 0;
      if (height > 0) root.style.setProperty("--showcase-header-height", `${Math.ceil(height)}px`);
    };
    const measure = () => {
      frame = 0;
      updateHeight();
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
    // The browser may align a cold fragment before fonts and the sticky header
    // settle. Re-align once after the actual layout is known, only on a fresh
    // navigation. Never override history restoration or a user who has moved.
    const initialHash = window.location.hash;
    const navigation = window.performance.getEntriesByType?.("navigation")[0] as PerformanceNavigationTiming | undefined;
    let initialPending = Boolean(initialHash) && navigation?.type === "navigate";
    const cancelInitial = () => { initialPending = false; };
    const settleInitial = () => {
      void (document.fonts?.ready ?? Promise.resolve()).then(() => {
        if (!initialPending || window.location.hash !== initialHash) return;
        initialPending = false;
        let id = initialHash.slice(1);
        try { id = decodeURIComponent(id); } catch { /* literal fragment */ }
        const target = document.getElementById(id);
        if (!target) return;
        updateHeight();
        target.scrollIntoView({ block: "start", behavior: "instant" });
        syncLocation();
      });
    };
    const initialInputEvents = ["pointerdown", "wheel", "touchstart", "keydown"] as const;
    for (const event of initialInputEvents) window.addEventListener(event, cancelInitial, { passive: true });
    window.addEventListener("hashchange", cancelInitial);
    window.addEventListener("popstate", cancelInitial);
    if (initialPending) {
      if (document.readyState === "complete") settleInitial();
      else window.addEventListener("load", settleInitial, { once: true });
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", syncLocation);
    window.addEventListener("popstate", syncLocation);
    window.addEventListener("pageshow", schedule);
    updateHeight();
    const observer = typeof ResizeObserver !== "undefined" && header ? new ResizeObserver(() => {
      updateHeight(); schedule();
    }) : null;
    if (header) observer?.observe(header);
    syncLocation();
    return () => {
      cancelInitial();
      window.removeEventListener("load", settleInitial);
      window.removeEventListener("hashchange", cancelInitial);
      window.removeEventListener("popstate", cancelInitial);
      for (const event of initialInputEvents) window.removeEventListener(event, cancelInitial);
      observer?.disconnect();
      if (previousHeight) root.style.setProperty("--showcase-header-height", previousHeight);
      else root.style.removeProperty("--showcase-header-height");
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
