import Link from "next/link";
import { experience } from "@/content/experience";
import { SectionHeader } from "../SectionHeader";
import { LineDraw } from "../LineDraw";

// Stable short "commit id" from the entry title (decoration, not data).
function shortHash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

// §5.5: git log of independent projects on one branch, merging down to education.
export function Experience({ base }: { base: string }) {
  const commits = experience.filter((e) => e.kind === "project");
  const branch = experience.find((e) => e.kind === "branch");
  const edu = experience.find((e) => e.kind === "education");
  return (
    <section id="experience" className="section container-x cv-auto" aria-labelledby="experience-title">
      <SectionHeader index="05" file="git log --graph" id="experience-title" title="Experience" />
      <div className="gitlog">
        {branch && (
          <p className="gitlog__branch label">
            <span aria-hidden="true">⎇</span> {branch.title} <span className="gitlog__range">· {branch.date}</span>
          </p>
        )}
        <div className="gitlog__lane">
          <LineDraw className="gitlog__line" />
          <ol className="gitlog__list">
            {commits.map((c) => (
              <li key={c.title} className="commit">
                <span className="commit__dot" aria-hidden="true" />
                <div className="commit__head">
                  <code className="commit__hash">{shortHash(c.title)}</code>
                  <time className="label commit__date" dateTime={c.date}>
                    {c.date}
                  </time>
                </div>
                <h3 className="commit__title">
                  {c.slug ? (
                    <Link href={`${base}/work/${c.slug}`} className="commit__link">
                      {c.title} <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    c.title
                  )}
                </h3>
                <p className="commit__line">{c.line}</p>
              </li>
            ))}
          </ol>
        </div>
        {edu && (
          <div className="gitlog__merge">
            <svg className="gitlog__curve" viewBox="0 0 48 64" aria-hidden="true" preserveAspectRatio="none">
              <path d="M40 0 C40 40 20 24 20 68" fill="none" />
            </svg>
            <div className="commit commit--edu">
              <span className="commit__dot" aria-hidden="true" />
              <div className="commit__head">
                <code className="commit__hash">{shortHash(edu.title)}</code>
                <time className="label commit__date" dateTime={edu.date}>
                  {edu.date}
                </time>
              </div>
              <h3 className="commit__title">{edu.title}</h3>
              <p className="commit__line">{edu.line}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
