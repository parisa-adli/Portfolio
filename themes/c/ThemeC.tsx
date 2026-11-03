import { Instrument_Serif, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import "@/components/core/styles";
import "./tokens.css";
import "./c.css";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-c-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-c-mono", display: "swap" });
// Accents only (italic words, big card numbers), so a single italic weight.
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-c-serif", display: "swap" });

// Prototype C shell ("Editorial"): fonts + data-theme. Shared by /c and /c/work/[slug].
export function ThemeC({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-theme="c"
      className={`${sans.variable} ${mono.variable} ${serif.variable} theme-root`}
      style={{ ["--font-sans-family" as string]: "var(--font-c-sans)", ["--font-mono-family" as string]: "var(--font-c-mono)" }}
    >
      {children}
    </div>
  );
}
