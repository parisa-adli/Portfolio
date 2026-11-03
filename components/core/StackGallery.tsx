"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export type GalleryItem = { src?: string; title: string; category: string; detail?: string; href?: string };

type Props = { items: GalleryItem[]; label: string; sizes?: string; wide?: boolean };

// Layered card stack (ref: docs/gallary.png). Hover/focus lifts a card in place; click/arrows/swipe recentre it.
// Hover never recentres, otherwise the card sliding under the cursor would steal hover and ping-pong.
export function StackGallery({ items, label, wide, sizes = wide ? "(max-width: 640px) 84vw, 560px" : "(max-width: 640px) 70vw, 300px" }: Props) {
  const [active, setActive] = useState(() => Math.floor(items.length / 2));
  const [hover, setHover] = useState<number | null>(null);
  const down = useRef<{ x: number; swiped: boolean } | null>(null);
  const router = useRouter();
  const n = items.length;
  const go = (i: number) => setActive((i + n) % n);
  const pad = (i: number) => String(i + 1).padStart(2, "0");
  const lead = hover ?? active;

  return (
    <div
      className={wide ? "sg sg--wide" : "sg"}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(active - 1);
        else if (e.key === "ArrowRight") go(active + 1);
        else return;
        e.preventDefault();
      }}
    >
      <div
        className="sg__stage"
        onPointerDown={(e) => (down.current = { x: e.clientX, swiped: false })}
        onPointerUp={(e) => {
          const d = down.current;
          if (!d) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 40) {
            d.swiped = true;
            go(active + (dx < 0 ? 1 : -1));
          }
        }}
        onPointerLeave={() => setHover(null)}
      >
        {items.map((it, i) => {
          const off = i - active;
          const dist = Math.abs(off);
          const lifted = i === lead;
          // Cards beside the lifted one slide outward to make room.
          const push = hover === null || i === hover ? 0 : Math.sign(i - hover) * 0.28;
          const style = {
            "--x": off + push,
            "--s": 1 - dist * 0.12 + (lifted ? 0.05 : 0),
            "--ry": `${lifted ? 0 : Math.max(-2, Math.min(2, off)) * -9}deg`,
            "--y": lifted ? "-14px" : "0px",
            zIndex: lifted ? 20 : 10 - dist,
          } as React.CSSProperties;
          return (
            <button
              key={i}
              type="button"
              className="sg__card"
              data-dist={Math.min(dist, 3)}
              data-lead={lifted || undefined}
              aria-current={i === active || undefined}
              aria-label={`${it.title}, ${it.category} (${i + 1} of ${n})`}
              tabIndex={dist > 2 ? -1 : 0}
              style={style}
              data-cursor="view"
              onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              onClick={() => {
                const swiped = down.current?.swiped;
                down.current = null;
                if (swiped) return;
                if (i !== active) go(i);
                else if (it.href) router.push(it.href);
              }}
            >
              <span className="sg__media">
                {it.src ? (
                  <Image src={it.src} alt="" fill sizes={sizes} unoptimized className="sg__img" draggable={false} />
                ) : (
                  <span className="sg__pending label">screenshot pending</span>
                )}
              </span>
              <span className="sg__cap">
                <span className="sg__text">
                  <span className="sg__title">{it.title}</span>
                  <span className="sg__cat">{it.category}</span>
                  {it.detail && <span className="sg__detail label">{it.detail}</span>}
                </span>
                <span className="sg__arrow" aria-hidden="true">
                  →
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="sg__nav">
        <button type="button" className="sg__btn" aria-label="Previous image" onClick={() => go(active - 1)}>
          ‹
        </button>
        <span className="sg__count label" aria-live="polite">
          {pad(active)} / {String(n).padStart(2, "0")}
        </span>
        <button type="button" className="sg__btn sg__btn--next" aria-label="Next image" onClick={() => go(active + 1)}>
          ›
        </button>
      </div>
    </div>
  );
}
