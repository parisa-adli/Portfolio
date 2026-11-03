"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import type { TerminalEntry } from "@/content/profile";
import { schedule } from "@/lib/terminal";

// Terminal card (§5.4). Lines type in once when scrolled into view (CSS steps, staggered); the text is
// in the DOM from the start, so screen readers and no-JS visitors get it all.
export function TerminalCard({ entries }: { entries: TerminalEntry[] }) {
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
        {schedule(entries).map((r, i) => {
          const style = { "--n": r.n, "--d": `${r.d}ms`, "--t": `${r.t}ms` } as CSSProperties;
          if (r.kind === "end")
            return (
              <p key={i} className="term__line term__cmd" style={style}>
                {prompt} <span className="caret" aria-hidden="true" />
              </p>
            );
          if (r.kind === "cmd")
            return (
              <p key={i} className="term__line term__cmd" style={style}>
                {prompt} {r.entry!.cmd}
              </p>
            );
          return (
            <div key={i} className="term__line term__out" style={style}>
              {r.entry!.out.map((o, j) =>
                typeof o === "string" ? (
                  <span key={j} className="term__row">
                    {o.split("\t").map((c, k) => (
                      <span key={k}>{c}</span>
                    ))}
                  </span>
                ) : (
                  <Link key={j} href={o.href} className="term__link">
                    {o.text}
                    <span className="sr-only-focusable"> case study</span>
                  </Link>
                ),
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
