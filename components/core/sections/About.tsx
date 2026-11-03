import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { profile } from "@/content/profile";
import { SectionHeader } from "../SectionHeader";
import { TerminalCard } from "../TerminalCard";

// §5.4: bio verbatim with a faint line-number gutter, photo window + terminal card. No stats (owner decision).
export function About() {
  const { photo, status } = profile;
  const showPhoto = photo && existsSync(join(process.cwd(), "public", photo.src));
  const entries = status ? [...profile.terminal, { cmd: "cat status.txt", out: [status] }] : profile.terminal;
  return (
    <section id="about" className="section container-x cv-auto" aria-labelledby="about-title">
      <SectionHeader index="04" file="about.tsx" id="about-title" title="About" />
      <div className="about">
        <div className="about__bio">
          <span className="about__gutter" aria-hidden="true" />
          <div className="about__text">
            {profile.about.split("\n\n").map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="about__side">
          {showPhoto && (
            <figure className="term about__photo">
              <div className="term__bar">
                <span className="editor__dots" aria-hidden="true">
                  <i /> <i /> <i />
                </span>
                <span className="label">{photo.src.split("/").pop()}</span>
              </div>
              <div className="about__img">
                <Image src={photo.src} alt={photo.alt} fill sizes="200px" />
              </div>
            </figure>
          )}
          <TerminalCard entries={entries} />
        </div>
      </div>
    </section>
  );
}
