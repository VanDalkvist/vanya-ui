import { useEffect, useState, type RefObject } from "react";

/** The prerender uses fallback SVG dimensions. Reveal only the measured initial
 * frame after fonts and the sticky header have settled; leave resize behavior
 * of the public SineWave component unchanged. */
export function useInitialWaveReady(waveRef: RefObject<SVGSVGElement | null>) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window.requestAnimationFrame !== "function") return;
    let cancelled = false;
    let frame = 0;
    let previous: number[] | null = null;
    const inspect = () => {
      if (cancelled) return;
      const svg = waveRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const [x, y, w, h] = (svg.getAttribute("viewBox") || "").split(/\s+/).map(Number);
      const header = document.querySelector(".showcase-header");
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      const declaredHeaderHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--showcase-header-height"));
      const headerSettled = !header || Math.abs(Math.ceil(headerHeight) - declaredHeaderHeight) <= 1;
      const measured = x === 0 && y === 0 && rect.width > 0 && rect.height > 0 &&
        Math.abs(w - rect.width) <= .5 && Math.abs(h - rect.height) <= .5 && headerSettled;
      const current = [rect.width, rect.height, rect.left + window.scrollX, rect.top + window.scrollY];
      if (measured && previous && current.every((value, i) => Math.abs(value - previous![i]) <= .5)) {
        setReady(true);
        return;
      }
      previous = measured ? current : null;
      frame = window.requestAnimationFrame(inspect);
    };
    const start = () => { if (!cancelled) frame = window.requestAnimationFrame(inspect); };
    Promise.resolve(document.fonts?.ready).then(start, start);
    return () => { cancelled = true; window.cancelAnimationFrame(frame); };
  }, [waveRef]);
  return ready;
}
