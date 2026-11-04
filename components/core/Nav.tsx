"use client";
import { useEffect, useRef, useState } from "react";
import { onScroll } from "@/lib/motion";

export const NAV_ITEMS = [
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export const openCommandMenu = () => window.dispatchEvent(new Event("command-menu:open"));

// Transparent at the top; after 80px the glass pill + scroll progress bar appear (§4.2).
export function Nav({ brand }: { brand: string }) {
  const header = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    // Progress = scrollY / max; max is cached on resize so scrolling never reads layout.
    let max = 1;
    const measure = () => (max = Math.max(1, document.documentElement.scrollHeight - innerHeight));
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    measure();
    let scrolled: boolean | null = null;
    // Grab the nodes once: React nulls refs before this cleanup runs, and a late scroll would throw.
    const [b, h] = [bar.current!, header.current!];
    const off = onScroll((y) => {
      b.style.transform = `scaleX(${Math.min(1, y / max).toFixed(4)})`;
      if ((y > 80) !== scrolled) h.classList.toggle("is-scrolled", (scrolled = y > 80));
    });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));
    return () => {
      off();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const current = NAV_ITEMS.find((i) => i.id === active);

  return (
    <header ref={header} className="nav">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <a href="#top" className="nav__brand label" aria-label={`${brand}, back to top`}>
        ~/parisa
      </a>
      <nav className="nav__pill" aria-label="Sections">
        <ul className="nav__links">
          {NAV_ITEMS.map((i) => (
            <li key={i.id}>
              <a href={`#${i.id}`} aria-current={active === i.id ? "location" : undefined}>
                {i.label}
              </a>
            </li>
          ))}
        </ul>
        <span className="nav__current label" aria-hidden="true">
          {current ? `~/${current.id}` : "~/parisa"}
        </span>
        <button type="button" className="nav__k" onClick={openCommandMenu} aria-label="Open command menu">
          <span className="nav__k-desktop">⌘K</span>
          <span className="nav__k-mobile">Menu</span>
        </button>
        <span className="nav__progress" aria-hidden="true">
          <span ref={bar} />
        </span>
      </nav>
    </header>
  );
}
