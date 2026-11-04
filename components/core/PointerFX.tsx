"use client";
import { useEffect, useRef } from "react";
import { onFrame, richPointer } from "@/lib/pointer";

const SPOT = 560; // spotlight diameter, px

// Background dot matrix (static) + mouse spotlight + custom cursor (§4.1).
export function PointerFX() {
  const spot = useRef<HTMLDivElement>(null);
  const spotInner = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!richPointer()) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    // Grab the nodes once: on route change React nulls refs before this cleanup runs, and a late
    // pointer event reading `ref.current` would throw (and used to kill the shared pointer loop).
    const [sp, si, d, r, l] = [spot.current!, spotInner.current!, dot.current!, ring.current!, label.current!];

    const off = onFrame((p) => {
      // Outer follows the lerped pointer, inner moves back, so the lit dots stay on the base grid.
      sp.style.transform = `translate3d(${p.sx - SPOT / 2}px, ${p.sy - SPOT / 2}px, 0)`;
      si.style.transform = `translate3d(${SPOT / 2 - p.sx}px, ${SPOT / 2 - p.sy}px, 0)`;
      d.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      r.style.transform = `translate3d(${p.sx}px, ${p.sy}px, 0)`;
    });

    let mode = "";
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element;
      const hit = t.closest<HTMLElement>("[data-cursor]");
      const interactive = t.closest("a, button, [role=tab], label, summary, input, textarea");
      const text = !interactive && t.closest("p, li, h1, h2, h3, blockquote");
      const next = hit ? "label" : interactive ? "hover" : text ? "text" : "";
      if (next !== mode) {
        mode = next;
        r.dataset.mode = mode;
        d.dataset.mode = mode;
      }
      l.textContent = hit?.dataset.cursor ?? "";
    };
    const onLeave = () => root.classList.add("cursor-out");
    const onEnter = () => root.classList.remove("cursor-out");
    document.addEventListener("pointerover", onOver, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerenter", onEnter);
    return () => {
      off();
      root.classList.remove("has-cursor");
      document.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div className="fx-grid" />
      <div ref={spot} className="fx-spot" style={{ width: SPOT, height: SPOT }}>
        <div ref={spotInner} className="fx-spot__inner" />
      </div>
      <div ref={ring} className="fx-ring">
        <span ref={label} className="fx-ring__label" />
      </div>
      <div ref={dot} className="fx-dot" />
    </div>
  );
}
