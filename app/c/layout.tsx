import { ThemeC } from "@/themes/c/ThemeC";
import { PersonLd, protoMetadata } from "@/lib/protoMeta";

export const metadata = protoMetadata("c");

export default function CLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeC>
      <PersonLd id="c" />
      {children}
    </ThemeC>
  );
}
