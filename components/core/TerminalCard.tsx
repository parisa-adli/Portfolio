"use client";
import { useEffect, useRef } from "react";

// Terminal card (§5.4). Lines type in once when scrolled into view (CSS steps, staggered); the text is
// in the DOM from the start, so screen readers and no-JS visitors get it all.
export function TerminalCard({ role }: { role: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    el.classList.add("is-armed");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.classList.add("is-typed");
        io.disconnect();
        // Once typed, drop the clip: a caret blinking inside a clip-path can't run on the compositor.
        el.lastElementChild?.lastElementChild?.addEventListener("animationend", () => el.classList.add("is-done"), { once: true });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const prompt = (
    <span className="term__prompt">
      parisa@dev <span className="term__path">~</span> $
    </span>
  );
  return (
    <div ref={ref} className="term">
      <div className="term__bar">
        <span className="editor__dots" aria-hidden="true">
          <i /> <i /> <i />
        </span>
        <span className="label">zsh — parisa@dev</span>
      </div>
      <div className="term__body">
        <p className="term__line" style={{ ["--d" as string]: "0ms", ["--n" as string]: 22 }}>
          {prompt} whoami
        </p>
        <p className="term__line term__out" style={{ ["--d" as string]: "700ms", ["--n" as string]: role.length }}>
          {role}
        </p>
        <p className="term__line" style={{ ["--d" as string]: "1400ms", ["--n" as string]: 16 }}>
          {prompt} <span className="caret" aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}
