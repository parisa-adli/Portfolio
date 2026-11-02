"use client";
import { useEffect, useRef } from "react";
import { onScroll, reducedMotion } from "@/lib/motion";

const WORDS = ["RESPONSIVE", "ACCESSIBLE", "PIXEL-PERFECT", "FAST", "SEO-READY", "TYPE-SAFE", "TESTED", "CLIENT-FOCUSED"];

function Band({ variant }: { variant: 1 | 2 }) {
  const run = (
    <span className="band__run">
      {WORDS.map((w) => (
        <span key={w} className="band__item">
          {w}
          <span className="band__star">✦</span>
        </span>
      ))}
    </span>
  );
  return (
    <div className={`band band--${variant}`}>
      <div className="band__track" data-dir={variant === 1 ? -1 : 1}>
        {run}
        {run}
      </div>
    </div>
  );
}

// Two crossing bands (§4.3): opposite directions, speed follows scroll velocity and flips with scroll
// direction, pause on hover, idle off-screen. Static under reduced motion.
// The loop is a WAAPI transform animation, so it runs on the compositor: a GSAP xPercent tween wrote a
// transform every frame on the main thread, and that per-frame work pushed INP over budget. Scroll only
// adjusts playbackRate (a short rAF ease back to base speed, then it sleeps).
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const el = root.current!;
    const tracks = [...el.querySelectorAll<HTMLElement>(".band__track")];
    // Finite-but-huge iteration count started mid-way: WAAPI can't play an infinite animation backwards,
    // and scrolling up plays the loop in reverse (negative playbackRate).
    const DUR = 38000;
    const anims = tracks.map((t) => {
      const a = t.animate([{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }], {
        duration: DUR,
        iterations: 1e5,
        direction: Number(t.dataset.dir) < 0 ? "normal" : "reverse",
      });
      a.currentTime = DUR * 5e4;
      return a;
    });
    const hovered = new Set<number>();
    let visible = false;
    const sync = () => anims.forEach((a, i) => (visible && !hovered.has(i) ? a.play() : a.pause()));
    anims.forEach((a) => a.pause());

    const vis = new IntersectionObserver(([e]) => ((visible = e.isIntersecting), sync()));
    vis.observe(el);

    let rate = 1;
    let target = 1;
    let raf = 0;
    const ease = () => {
      rate += (target - rate) * 0.08;
      if (Math.abs(target - rate) < 0.01) rate = target;
      anims.forEach((a) => (a.playbackRate = rate));
      raf = rate === target ? 0 : requestAnimationFrame(ease);
    };
    const off = onScroll((_y, velocity, dir) => {
      if (!visible) return;
      const boost = 1 + Math.min(Math.abs(velocity) / 12, 4);
      rate = dir * boost; // jump to the boosted speed in the scroll direction…
      target = dir; // …then ease back to base speed, keeping the direction
      if (!raf) raf = requestAnimationFrame(ease);
    });

    const bands = [...el.querySelectorAll<HTMLElement>(".band")];
    const unhover = bands.map((band, i) => {
      const enter = () => (hovered.add(i), sync());
      const leave = () => (hovered.delete(i), sync());
      band.addEventListener("pointerenter", enter);
      band.addEventListener("pointerleave", leave);
      return () => {
        band.removeEventListener("pointerenter", enter);
        band.removeEventListener("pointerleave", leave);
      };
    });

    return () => {
      off();
      cancelAnimationFrame(raf);
      vis.disconnect();
      unhover.forEach((u) => u());
      anims.forEach((a) => a.cancel());
    };
  }, []);

  return (
    <div ref={root} className="bands" aria-hidden="true">
      <Band variant={2} />
      <Band variant={1} />
    </div>
  );
}
