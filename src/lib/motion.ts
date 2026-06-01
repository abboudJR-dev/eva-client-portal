/**
 * Shared vanilla motion primitives used by RevealManager (global, route-level)
 * and by interactive components that need to replay an animation locally
 * (e.g. the phase tracker when a different phase is selected).
 *
 * Each primitive reads `data-*` attributes off the element and respects
 * prefers-reduced-motion by snapping straight to the final value.
 */

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/** Animate a number from 0 to `data-to`, appending `data-suffix`. */
export function countUp(el: HTMLElement, force = false): void {
  if (el.dataset.done && !force) return;
  el.dataset.done = "1";
  const to = parseFloat(el.dataset.to || "0");
  const suffix = el.dataset.suffix || "";
  if (prefersReducedMotion()) {
    el.textContent = to + suffix;
    return;
  }
  const dur = 1300;
  const start = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / dur);
    el.textContent = Math.round(easeOutExpo(p) * to) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Draw an SVG progress ring to `data-pct` via stroke-dashoffset. */
export function fillRing(c: SVGCircleElement): void {
  const radius = c.r.baseVal.value;
  const circ = 2 * Math.PI * radius;
  const pct = parseFloat(c.dataset.pct || "0");
  c.style.strokeDasharray = String(circ);
  if (prefersReducedMotion()) {
    c.style.strokeDashoffset = String(circ * (1 - pct / 100));
    return;
  }
  c.style.strokeDashoffset = String(circ);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      c.style.strokeDashoffset = String(circ * (1 - pct / 100));
    }),
  );
}

/** Grow a progress bar's width to `data-w` percent. */
export function fillBar(el: HTMLElement): void {
  const w = (el.dataset.w || "0") + "%";
  if (prefersReducedMotion()) {
    el.style.width = w;
    return;
  }
  el.style.width = "0%";
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      el.style.width = w;
    }),
  );
}
