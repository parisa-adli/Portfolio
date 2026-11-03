import { ogAlt, ogImage, ogSize } from "@/lib/og";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = "image/png";

// Prototype A: violet → cyan.
export default function OG() {
  return ogImage({
    glow: "radial-gradient(circle at 80% 20%, rgba(139,92,246,.35), transparent 50%), radial-gradient(circle at 10% 100%, rgba(34,211,238,.18), transparent 45%)",
    bar: "linear-gradient(90deg, #8B5CF6, #22D3EE)",
  });
}
