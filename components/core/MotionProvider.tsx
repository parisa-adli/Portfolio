"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { emitScroll, reducedMotion, scroller } from "@/lib/motion";

// Lenis smooth scroll (§4.4). Its rAF runs only while a scroll is in progress: Lenis' autoRaf ticks
// forever, which forces a main-thread frame (style + layerize + commit) 60×/s on an idle page and
// showed up as input delay on every interaction. Scroll position/velocity fan out via lib/motion.
export function MotionProvider() {
  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({ autoRaf: false, anchors: { offset: -24 } });
    scroller.lenis = lenis;
    lenis.on("scroll", (l: Lenis) => emitScroll(l.scroll, l.velocity));

    let raf = 0;
    let grace = 0; // keep ticking a few frames after input so Lenis can pick the scroll up
    const loop = (t: number) => {
      lenis.raf(t);
      grace = lenis.isScrolling ? 3 : grace - 1;
      raf = grace > 0 ? requestAnimationFrame(loop) : 0;
    };
    const wake = () => {
      grace = 3;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    scroller.wake = wake;
    const opts = { passive: true } as const;
    window.addEventListener("wheel", wake, opts);
    window.addEventListener("touchstart", wake, opts);
    window.addEventListener("touchmove", wake, opts);
    window.addEventListener("keydown", wake, opts);
    document.addEventListener("click", wake, opts); // anchor links → lenis.scrollTo
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", wake);
      window.removeEventListener("touchstart", wake);
      window.removeEventListener("touchmove", wake);
      window.removeEventListener("keydown", wake);
      document.removeEventListener("click", wake);
      lenis.destroy();
      scroller.lenis = null;
      scroller.wake = undefined;
    };
  }, []);
  return null;
}
