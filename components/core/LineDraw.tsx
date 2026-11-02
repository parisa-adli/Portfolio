"use client";
import { useEffect, useRef } from "react";
import { onScroll, reducedMotion } from "@/lib/motion";

// A vertical line that draws itself with scroll (scrubbed scaleY, §5.5). Geometry is cached on
// resize; scroll only does arithmetic + one transform write, and only while the lane is near view.
export function LineDraw({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const el = ref.current!;
    const lane = el.parentElement!;
    let top = 0;
    let height = 1;
    let near = false;
    const measure = () => {
      const r = lane.getBoundingClientRect();
      top = r.top + scrollY;
      height = r.height;
    };
    const update = (y: number) => {
      if (!near) return;
      // 0 when the lane top is at 70% of the viewport, 1 when its bottom reaches 60%.
      const start = top - innerHeight * 0.7;
      const end = top + height - innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (y - start) / (end - start)));
      el.style.transform = `scaleY(${p.toFixed(4)})`;
    };
    el.style.transform = "scaleY(0)";
    const ro = new ResizeObserver(() => (measure(), update(scrollY)));
    ro.observe(document.body);
    const io = new IntersectionObserver(([e]) => ((near = e.isIntersecting), update(scrollY)), { rootMargin: "50% 0px" });
    io.observe(lane);
    const off = onScroll(update);
    return () => {
      off();
      ro.disconnect();
      io.disconnect();
    };
  }, []);
  return <span ref={ref} className={className} aria-hidden="true" />;
}
