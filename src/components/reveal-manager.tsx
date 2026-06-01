"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion, countUp, fillRing, fillBar } from "@/lib/motion";

/**
 * Vanilla-rebuilt motion system (ported from the EVA prototype's portal.js):
 * reveal-on-view with stagger, count-up numbers, SVG progress-ring draw-on,
 * progress-bar fills, pointer spotlight, and magnetic buttons.
 *
 * Re-scans the DOM whenever the route changes. Motion primitives live in
 * `@/lib/motion` so interactive components (e.g. the phase tracker) can replay
 * them locally. Fully respects prefers-reduced-motion by snapping to final.
 */
export default function RevealManager() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const all = (s: string, r: ParentNode = document): HTMLElement[] =>
      Array.from(r.querySelectorAll(s));

    function triggerChildren(el: HTMLElement) {
      all(".count", el).forEach((n) => countUp(n));
      if (el.classList.contains("count")) countUp(el);
      el.querySelectorAll<SVGCircleElement>(".ring .prog").forEach(fillRing);
      all(".bar-fill, .line .done", el).forEach(fillBar);
    }

    const reveals = all(".reveal");

    if (reduce) {
      reveals.forEach((el) => {
        el.classList.add("in");
        triggerChildren(el);
      });
      // Snap any standalone animated values not wrapped in a .reveal.
      all(".count").forEach((n) => countUp(n));
      document
        .querySelectorAll<SVGCircleElement>(".ring .prog")
        .forEach(fillRing);
      all(".bar-fill, .line .done").forEach(fillBar);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.classList.add("in");
          triggerChildren(el);
          io.unobserve(el);
        });
      },
      { threshold: 0.2 },
    );

    reveals.forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 60, 360) + "ms";
      io.observe(el);
    });

    // Reveal anything already in view this frame.
    const raf = requestAnimationFrame(() =>
      reveals.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.98 && r.bottom > 0) {
          io.unobserve(el);
          el.classList.add("in");
          triggerChildren(el);
        }
      }),
    );

    // Safety net: never leave content hidden.
    const safety = window.setTimeout(() => {
      all(".reveal:not(.in)").forEach((el) => {
        io.unobserve(el);
        el.classList.add("in");
        triggerChildren(el);
      });
    }, 1800);

    // Spotlight: radial follows pointer within .spotlight cards.
    const onSpot = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".spotlight");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    };
    document.addEventListener("pointermove", onSpot);

    // Magnetic buttons.
    const magnetCleanups: Array<() => void> = [];
    all(".magnetic").forEach((btn) => {
      const move = (e: PointerEvent) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      };
      const leave = () => {
        btn.style.transform = "";
      };
      btn.addEventListener("pointermove", move);
      btn.addEventListener("pointerleave", leave);
      magnetCleanups.push(() => {
        btn.removeEventListener("pointermove", move);
        btn.removeEventListener("pointerleave", leave);
      });
    });

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      document.removeEventListener("pointermove", onSpot);
      magnetCleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return null;
}
