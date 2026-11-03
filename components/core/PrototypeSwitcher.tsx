"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { PROTOS, type Proto } from "@/lib/site";

// Dev-only A · B · C switcher (§6), bottom-left. Keeps your place: the link carries the section in view and
// the offset into it (?o=), because the prototypes' sections differ in height, so a raw scrollY would drift.
export function PrototypeSwitcher({ current }: { current: Proto }) {
  const path = usePathname();

  useEffect(() => {
    const o = Number(new URLSearchParams(location.search).get("o"));
    const el = location.hash && document.getElementById(location.hash.slice(1));
    if (!el || !o) return;
    window.scrollTo(0, el.getBoundingClientRect().top + scrollY + o);
    history.replaceState(null, "", location.pathname + location.hash);
  }, []);

  if (process.env.NODE_ENV !== "development") return null;

  const keepPlace = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const sections = [...document.querySelectorAll<HTMLElement>("main [id]")];
    const at = sections.filter((s) => s.getBoundingClientRect().top <= 1).pop();
    if (at) e.currentTarget.href += `?o=${Math.round(-at.getBoundingClientRect().top)}#${at.id}`;
  };

  return (
    <nav className="proto-switch" aria-label="Prototype (dev only)">
      {PROTOS.map((p) =>
        p === current ? (
          <span key={p} className="proto-switch__item is-current" aria-current="page">
            {p.toUpperCase()}
          </span>
        ) : (
          <a key={p} href={path.replace(/^\/[abc]/, `/${p}`)} className="proto-switch__item" onClick={keepPlace} aria-label={`Prototype ${p.toUpperCase()}`}>
            {p.toUpperCase()}
          </a>
        ),
      )}
    </nav>
  );
}
