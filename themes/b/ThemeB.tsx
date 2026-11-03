import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "@/components/core/styles";
import "./tokens.css";
import "./b.css";

const sans = Space_Grotesk({ subsets: ["latin"], variable: "--font-b-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-b-mono", display: "swap" });

// Prototype B shell ("Mechanical"): fonts + data-theme. Shared by /b and /b/work/[slug].
export function ThemeB({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-theme="b"
      className={`${sans.variable} ${mono.variable} theme-root`}
      style={{ ["--font-sans-family" as string]: "var(--font-b-sans)", ["--font-mono-family" as string]: "var(--font-b-mono)" }}
    >
      {children}
    </div>
  );
}
