import { profile } from "@/content/profile";
import { SectionHeader } from "../SectionHeader";
import { TerminalCard } from "../TerminalCard";

// §5.4: bio verbatim with a faint line-number gutter + terminal card. No stats (owner decision).
export function About() {
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
        <TerminalCard role="Full-stack developer · React / Next.js / Node" />
      </div>
    </section>
  );
}
