import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/components/core/styles";
import "./tokens.css";
import "./a.css";
import "./keyboard.css";

// Prototype A shell: fonts + data-theme. Shared by /a and /a/work/[slug].
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
