import { ogAlt, ogImage, ogSize } from "@/lib/og";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = "image/png";

// Prototype B: warm amber.
export default function OG() {
  return ogImage({
    glow: "radial-gradient(circle at 80% 20%, rgba(245,158,11,.3), transparent 50%), radial-gradient(circle at 10% 100%, rgba(99,72,230,.22), transparent 45%)",
    bar: "linear-gradient(90deg, #F59E0B, #FCD34D)",
  });
}
