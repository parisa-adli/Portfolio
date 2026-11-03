import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/components/core/core.css";
import "@/components/core/hero.css";
import "@/components/core/Keyboard/keyboard.css";
import "@/components/core/projects.css";
import "@/components/core/case.css";
import "@/components/core/marquee.css";
import "@/components/core/skills.css";
import "@/components/core/about.css";
import "@/components/core/contact.css";
import "./tokens.css";
import "./a.css";
import "./keyboard.css";

// Site shell: fonts + data-theme, wrapping every page (root layout).
export function ThemeA({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-theme="a"
      className={`${GeistSans.variable} ${GeistMono.variable} theme-root`}
      style={{ ["--font-sans-family" as string]: "var(--font-geist-sans)", ["--font-mono-family" as string]: "var(--font-geist-mono)" }}
    >
      {children}
    </div>
  );
}
