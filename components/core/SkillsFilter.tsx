"use client";
import { useEffect, useRef, useState } from "react";

type Group = { group: string; items: string[] };
type Props = { groups: string[]; json: Group[]; children: React.ReactNode };

type Tok = { t: "p" | "k" | "s"; v: string }; // punctuation, key, string

function lines(json: Group[], filter: string): Tok[][] {
  const shown = filter === "All" ? json : json.filter((g) => g.group === filter);
  const out: Tok[][] = [[{ t: "p", v: "{" }]];
  shown.forEach((g, gi) => {
    out.push([{ t: "p", v: "  " }, { t: "k", v: `"${g.group.toLowerCase()}"` }, { t: "p", v: ": [" }]);
    g.items.forEach((it, i) =>
      out.push([{ t: "p", v: "    " }, { t: "s", v: `"${it}"` }, { t: "p", v: i < g.items.length - 1 ? "," : "" }]),
    );
    out.push([{ t: "p", v: gi < shown.length - 1 ? "  ]," : "  ]" }]);
  });
  out.push([{ t: "p", v: "}" }]);
  return out;
}

// Filter tabs drive both the skills.json editor (retyped line by line in CSS) and the tile dimming
// (a data attribute; tiles are server-rendered children). Also pauses the orbit/strip loops off-screen.
export function SkillsFilter({ groups, json, children }: Props) {
  const tabs = ["All", ...groups];
  const [filter, setFilter] = useState("All");
  const [run, setRun] = useState(0); // remount key: restarts the typing animation
  const root = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const section = root.current!.closest("section")!;
    const io = new IntersectionObserver(([e]) => section.classList.toggle("is-offscreen", !e.isIntersecting));
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const select = (t: string) => {
    if (t === filter) return;
    setFilter(t);
    setRun((r) => r + 1);
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    const n = (i + d + tabs.length) % tabs.length;
    tabRefs.current[n]?.focus();
    select(tabs[n]);
  };

  const ls = lines(json, filter);

  return (
    <div ref={root} className="skills" data-filter={filter}>
      <div className="editor">
        <div className="editor__bar">
          <span className="editor__dots" aria-hidden="true">
            <i /> <i /> <i />
          </span>
          <span className="label">skills.json</span>
        </div>
        <div role="tablist" aria-label="Filter skills" className="editor__tabs">
          {tabs.map((t, i) => (
            <button
              key={t}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`skills-tab-${t}`}
              aria-selected={filter === t}
              aria-controls="skills-panel"
              tabIndex={filter === t ? 0 : -1}
              className="editor__tab"
              onClick={() => select(t)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {t}
            </button>
          ))}
        </div>
        <pre id="skills-panel" role="tabpanel" aria-labelledby={`skills-tab-${filter}`} className={`editor__code${run ? " is-typing" : ""}`} key={run} tabIndex={0}>
          <code>
            {ls.map((l, i) => (
              <span key={i} className="code-line" style={{ ["--i" as string]: i, ["--ch" as string]: l.reduce((n, t) => n + t.v.length, 0) }}>
                <span className="code-line__text">
                  {l.map((t, j) => (
                    <span key={j} className={`tok-${t.t}`}>
                      {t.v}
                    </span>
                  ))}
                </span>
                {"\n"}
              </span>
            ))}
          </code>
        </pre>
      </div>
      {children}
    </div>
  );
}
