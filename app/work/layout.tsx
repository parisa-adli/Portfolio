import { ThemeA } from "@/themes/a/ThemeA";

// shortcut: case studies always use prototype A's theme; read the active prototype once B and C exist.
export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <ThemeA>{children}</ThemeA>;
}
