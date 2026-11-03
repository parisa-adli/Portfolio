import { ThemeB } from "@/themes/b/ThemeB";
import { PersonLd, protoMetadata } from "@/lib/protoMeta";

export const metadata = protoMetadata("b");

export default function BLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeB>
      <PersonLd id="b" />
      {children}
    </ThemeB>
  );
}
