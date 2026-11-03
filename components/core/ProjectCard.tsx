import Link from "next/link";
import type { Project } from "@/content/projects";
import { PhoneMockup } from "./PhoneMockup";

type Props = { project: Project; index: number; variant: "featured" | "compact"; flip?: boolean; base: string };

const STATUS: Record<Project["status"], string> = { live: "● live", "in progress": "in progress", "source only": "source only" };

// §5.2 card anatomy. The title link stretches over the whole card (→ /work/[slug]); Live/Source sit above it.
export function ProjectCard({ project: p, index, variant, flip, base }: Props) {
  const n = String(index + 1).padStart(2, "0");
  return (
    <article className={`pcard pcard--${variant}${flip ? " pcard--flip" : ""}`} data-cursor="view" data-card>
      <div className="pcard__meta">
        <span className="label pcard__index" data-n={n}>
          PROJECT_{n}
        </span>
        <span className="chip">{p.category}</span>
        <span className={`chip chip--status chip--${p.status.replace(" ", "-")}`}>{STATUS[p.status]}</span>
      </div>
      <div className="pcard__head">
        <h3 className="pcard__title">
          <Link href={`${base}/work/${p.slug}`} className="pcard__link">
            {p.title}
          </Link>
        </h3>
        <p className="pcard__tagline">{p.tagline}</p>
      </div>
      <div className="pcard__visual" aria-hidden="true">
        <div className="phones">
          {(["m1", "m2", "m3"] as const).map((m, i) => (
            <PhoneMockup key={m} className={`phones__p phones__p--${i}`} alt={`${p.title} screen ${i + 1}`} label={`${p.slug}/${m}`} />
          ))}
        </div>
      </div>
      <div className="pcard__body">
        <p className="pcard__desc">{p.description}</p>
        {variant === "featured" && (
          <ul className="pcard__features">
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
      </div>
      <ul className="pcard__stack" aria-label="Stack">
        {p.stack.map((s) => (
          <li key={s} className="chip chip--tech">
            {s}
          </li>
        ))}
      </ul>
      <div className="pcard__actions">
        {p.liveUrl && (
          <a href={p.liveUrl} className="btn btn--primary btn--sm" target="_blank" rel="noopener noreferrer" data-cursor="open">
            Live demo ↗
          </a>
        )}
        <a href={p.sourceUrl} className="btn btn--ghost btn--sm" target="_blank" rel="noopener noreferrer" data-cursor="open">
          Source <span aria-hidden="true">⌥</span>
        </a>
      </div>
    </article>
  );
}
