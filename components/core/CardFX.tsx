"use client";
import { useEffect } from "react";
import { onFrame, richPointer } from "@/lib/pointer";

const MAX_TILT = 3;

// Cursor-following border glow + ≤3° tilt for [data-card] elements (§5.2), on the shared pointer loop.
// Only the hovered card is touched; it writes --gx/--gy and a transform, never React state.
export function CardFX() {
  useEffect(() => {
    if (!richPointer()) return;
    let active: HTMLElement | null = null;

    const onOver = (e: PointerEvent) => {
      const card = (e.target as Element).closest<HTMLElement>("[data-card]");
      if (card === active) return;
      if (active) {
        active.style.transform = "";
        active.classList.remove("is-hot");
      }
      active = card;
      active?.classList.add("is-hot");
    };
    document.addEventListener("pointerover", onOver, { passive: true });

    const off = onFrame((p) => {
      if (!active) return;
      const r = active.getBoundingClientRect();
      const x = (p.x - r.left) / r.width;
      const y = (p.y - r.top) / r.height;
      active.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      active.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
      const tilt = active.classList.contains("pcard--featured") ? MAX_TILT / 2 : MAX_TILT;
      active.style.transform = `perspective(1400px) translateY(-4px) rotateX(${((0.5 - y) * tilt).toFixed(2)}deg) rotateY(${((x - 0.5) * tilt).toFixed(2)}deg)`;
    });
    return () => {
      off();
      document.removeEventListener("pointerover", onOver);
    };
  }, []);
  return null;
}
