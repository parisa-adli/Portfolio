import Link from "next/link";
import type { Project } from "@/content/projects";
import { PhoneMockup } from "./PhoneMockup";
import { PointerFX } from "./PointerFX";
import { SHOTS, screenshotSrc } from "@/lib/screenshots";

type Props = { project: Project; index: number; next: Project };

// §5.2 case study: header → challenge → solution → features → stack → proof → screenshots → next.
// Built only from projects.ts fields; no outcome section (no metrics exist).
export function CaseStudy({ project: p, index, next }: Props) {
  const n = String(index + 1).padStart(2, "0");
  const proof = [
    { k: "commits", v: String(p.signals.commits) },
    { k: "tests", v: p.signals.tests ?? "none yet" },
    { k: "ci", v: p.signals.ci ? "GitHub Actions ✓" : "not set up" },
  ];
  const shots = SHOTS.map((m) => ({ m, src: screenshotSrc(p.slug, m) }));
  return (
    <>
      <PointerFX />
      <main id="main" className="case container-x">
        <nav className="case__crumbs label" aria-label="Breadcrumb">
          <Link href="/#work" className="text-link">
            ← ~/parisa/projects
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{p.slug}</span>
        </nav>

        <header className="case__header">
          <div className="pcard__meta">
            <span className="label pcard__index">PROJECT_{n}</span>
            <span className="chip">{p.category}</span>
            <span className="chip chip--status">{p.status}</span>
          </div>
          <h1 className="display case__title">{p.title}</h1>
          <p className="case__tagline">{p.tagline}</p>
          <dl className="case__facts">
            <div>
              <dt className="label">role</dt>
              <dd>{p.role}</dd>
            </div>
          </dl>
          <div className="pcard__actions">
            {p.liveUrl && (
              <a href={p.liveUrl} className="btn btn--primary" target="_blank" rel="noopener noreferrer">
                Live demo ↗
              </a>
            )}
            <a href={p.sourceUrl} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
              Source <span aria-hidden="true">⌥</span>
            </a>
          </div>
        </header>

        <div className="case__grid">
          <section className="case__block" aria-labelledby="c-challenge">
            <h2 id="c-challenge" className="label case__h">01 — challenge</h2>
            <p className="case__lead">{p.challenge}</p>
          </section>
          <section className="case__block" aria-labelledby="c-solution">
            <h2 id="c-solution" className="label case__h">02 — solution</h2>
            <p className="case__lead">{p.solution}</p>
          </section>
          <section className="case__block" aria-labelledby="c-features">
            <h2 id="c-features" className="label case__h">03 — features</h2>
            <ul className="pcard__features case__features">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
          <section className="case__block" aria-labelledby="c-stack">
            <h2 id="c-stack" className="label case__h">04 — stack</h2>
            <ul className="pcard__stack">
              {p.stack.map((s) => (
                <li key={s} className="chip chip--tech">
                  {s}
                </li>
              ))}
            </ul>
          </section>
          <section className="case__block" aria-labelledby="c-proof">
            <h2 id="c-proof" className="label case__h">05 — proof</h2>
            <dl className="proof">
              {proof.map((x) => (
                <div key={x.k} className="proof__row">
                  <dt className="label">{x.k}</dt>
                  <dd>{x.v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <section className="case__shots" aria-label="Screenshots">
          <div className="phones" aria-hidden="true">
            {shots.map(({ m, src }, i) => (
              <PhoneMockup
                key={m}
                src={src}
                sizes="(max-width: 768px) 30vw, 260px"
                className={`phones__p phones__p--${i}`}
                alt={`${p.title} screen ${i + 1}`}
                label={`${p.slug}/${m}`}
              />
            ))}
          </div>
          {shots.some((s) => !s.src) && <p className="label case__shots-note">Screenshots are captured once the live demo is deployed.</p>}
        </section>

        <Link href={`/work/${next.slug}`} className="case__next" data-cursor="view">
          <span className="label">next project →</span>
          <span className="h2">{next.title}</span>
        </Link>
      </main>
    </>
  );
}
