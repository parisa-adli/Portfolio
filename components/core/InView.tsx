"use client";
import { useEffect } from "react";

// Adds .is-inview once to every [data-inview] element (CSS does the animation). .is-armed is set first,
// so without JS everything simply shows.
export function InView() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-inview]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-inview");
          io.unobserve(e.target);
        }),
      { threshold: 0.3 },
    );
    els.forEach((el) => {
      el.classList.add("is-armed");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
