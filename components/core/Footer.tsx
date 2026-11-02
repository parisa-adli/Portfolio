import { profile } from "@/content/profile";

// §5.8: IDE status bar. No clock, location or availability.
export function Footer() {
  return (
    <footer className="statusbar">
      <div className="statusbar__inner container-x">
        <span className="statusbar__item statusbar__branch">⎇ main</span>
        <span className="statusbar__item">built with Next.js + GSAP</span>
        <span className="statusbar__item">© 2026 {profile.name}</span>
        <a href="#top" className="statusbar__top">
          back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
