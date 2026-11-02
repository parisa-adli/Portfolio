"use client";
import { useEffect } from "react";
import { loadGsap, reducedMotion } from "@/lib/motion";

// Heading reveals for [data-reveal] (§4.4): masked lines/words, y 100% → 0, stagger 0.04, 0.8s ease-out,
// once. Work is lazy: a heading is split (hidden) when it comes within ~half a viewport, and plays when
// it enters. Nothing is split at load. Reduced motion: CSS opacity fade only. The hero H1 is never marked.
export function Reveal() {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    if (reducedMotion()) {
      const io = new IntersectionObserver((entries) =>
        entries.forEach((e) => e.isIntersecting && (e.target.classList.add("is-revealed"), io.unobserve(e.target))),
      );
      els.forEach((el) => (el.classList.add("reveal-fade"), io.observe(el)));
      return () => io.disconnect();
    }

    const ready = new Map<Element, () => void>();
    let disposed = false;
    const reverts: (() => void)[] = [];

    const play = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting || !ready.has(e.target)) return;
          ready.get(e.target)!();
          ready.delete(e.target);
          play.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -12% 0px" },
    );

    const prep = new IntersectionObserver(
      (entries) =>
        entries.forEach(async (e) => {
          if (!e.isIntersecting) return;
          prep.unobserve(e.target);
          const [gsap, { SplitText }] = await Promise.all([loadGsap(), import("gsap/SplitText")]);
          if (disposed) return;
          gsap.registerPlugin(SplitText);
          const el = e.target as HTMLElement;
          const split = SplitText.create(el, { type: "lines,words", mask: "lines" });
          const tw = gsap.from(split.words, { yPercent: 100, stagger: 0.04, duration: 0.8, ease: "expo.out", paused: true });
          reverts.push(() => (tw.kill(), split.revert()));
          ready.set(el, () => tw.play());
          play.observe(el);
        }),
      { rootMargin: "0px 0px 60% 0px" },
    );
    // Armed on the first scroll: below-the-fold headings can't be seen before it, and this keeps GSAP and
    // SplitText out of the page-load window. Headings already on screen are left alone (no flash-hide).
    const arm = () => els.forEach((el) => (el.getBoundingClientRect().top > innerHeight ? prep.observe(el) : null));
    window.addEventListener("scroll", arm, { once: true, passive: true });
    return () => {
      disposed = true;
      window.removeEventListener("scroll", arm);
      prep.disconnect();
      play.disconnect();
      reverts.forEach((r) => r());
    };
  }, []);
  return null;
}
