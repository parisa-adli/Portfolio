"use client";
import type Lenis from "lenis";

// Motion plumbing kept off the critical path: no GSAP/ScrollTrigger at load. GSAP (+ SplitText) is
// imported lazily by the effects that need it, when they get near the viewport.

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// Set by MotionProvider; null under reduced motion.
export const scroller: { lenis: Lenis | null; wake?: () => void } = { lenis: null };

type ScrollFn = (y: number, velocity: number, direction: 1 | -1) => void;
const scrollSubs = new Set<ScrollFn>();
let lastY = 0;
let nativeBound = false;

export function emitScroll(y: number, velocity: number) {
  const dir: 1 | -1 = y >= lastY ? 1 : -1;
  lastY = y;
  scrollSubs.forEach((f) => f(y, velocity, dir));
}

/** Subscribe to scroll (Lenis when active, native scroll otherwise). Called once immediately. */
export function onScroll(fn: ScrollFn) {
  scrollSubs.add(fn);
  if (!nativeBound) {
    nativeBound = true;
    window.addEventListener("scroll", () => !scroller.lenis && emitScroll(scrollY, 0), { passive: true });
  }
  fn(scrollY, 0, 1);
  return () => {
    scrollSubs.delete(fn);
  };
}

let gsapPromise: Promise<typeof import("gsap").gsap> | null = null;
export const loadGsap = () => (gsapPromise ??= import("gsap").then((m) => m.gsap));

export function scrollToTarget(target: string | number) {
  // start() first: a closing command menu may have stopped Lenis, and its close event fires later.
  if (scroller.lenis) {
    scroller.lenis.start();
    scroller.lenis.scrollTo(target, { offset: typeof target === "string" ? -24 : 0 });
    scroller.wake?.();
  }
  else if (typeof target === "number") window.scrollTo({ top: target });
  else document.querySelector(target)?.scrollIntoView();
}
