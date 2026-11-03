import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { profile } from "@/content/profile";
import { SectionHeader } from "../SectionHeader";
import { TerminalCard } from "../TerminalCard";

// §5.4: bio verbatim with a faint line-number gutter, terminal card with a round photo badge on its corner. No stats (owner decision).
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
          <TerminalCard entries={entries} />
          {showPhoto && (
            <Image className="about__photo" src={photo.src} alt={photo.alt} width={112} height={112} sizes="(max-width: 1023px) 92px, 130px" />
          )}
        </div>
      </div>
    </section>
  );
}
