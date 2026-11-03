import { ThemeA } from "@/themes/a/ThemeA";
import { PersonLd, protoMetadata } from "@/lib/protoMeta";

export const metadata = protoMetadata("a");

export default function ALayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeA>
      <PersonLd id="a" />
      {children}
    </ThemeA>
  );
}
