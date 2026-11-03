import { profile } from "@/content/profile";
import { CopyEmail } from "../CopyEmail";
import { ContactForm } from "../ContactForm";
import { Icon } from "../icons";

// §5.7: huge headline with animated underline, copy-email, socials, terminal form.
export function Contact() {
  return (
    <section id="contact" className="section container-x cv-auto contact" aria-labelledby="contact-title" data-inview suppressHydrationWarning>
      <div className="file-tab label">
        <span className="file-tab__idx">06</span>
        <span aria-hidden="true">—</span>
        <span>contact.ts</span>
      </div>
      <h2 id="contact-title" className="contact__title" data-reveal>
        Got an idea <span className="contact__underline">worth building?</span>
      </h2>
      <div className="contact__grid">
        <div className="contact__direct">
          <CopyEmail email={profile.email} />
          <ul className="contact__links">
            {profile.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="contact__link" data-cursor="open">
                  <Icon name={l.label} size={18} />
                  <span>{l.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
