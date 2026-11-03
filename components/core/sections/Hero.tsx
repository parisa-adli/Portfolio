import { profile } from "@/content/profile";
import { Keyboard } from "../Keyboard/Keyboard";
import { KeyboardIsland } from "../Keyboard/KeyboardIsland";
import { Icon } from "../icons";

// §5.1. The H1 is server-rendered, visible and never animated in: it is the LCP element.
export function Hero({ keyboard = <Keyboard /> }: { keyboard?: React.ReactNode }) {
  const [before, after] = profile.positioning.split("tested");
  return (
    <section id="top" className="hero container-x" aria-labelledby="hero-title">
      <div className="hero__text">
        <p className="label hero__eyebrow">Full-Stack Developer · React / Next.js / Node</p>
        <h1 id="hero-title" className="hero__title">
          <span className="hero__name display">{profile.name}</span>
          <span className="hero__role">
            {before}
            <span className="grad-text">tested</span>
            {after}
            <span className="caret" aria-hidden="true" />
          </span>
        </h1>
        <p className="hero__sub">{profile.sub}</p>
        <div className="hero__actions">
          <a href="#work" className="btn btn--primary">
            View work
          </a>
          <a href="#contact" className="btn btn--ghost">
            Get in touch
          </a>
          <ul className="hero__social" aria-label="Profiles">
            {profile.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="icon-link" aria-label={l.label} target="_blank" rel="noopener noreferrer" data-cursor="open">
                  <Icon name={l.label} size={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="hero__kb">
        {keyboard}
        <div className="hero__hint">
          <span className="label">try typing ⌨</span>
          <KeyboardIsland />
        </div>
      </div>
    </section>
  );
}
