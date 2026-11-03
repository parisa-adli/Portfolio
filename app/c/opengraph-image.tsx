import { ogAlt, ogImage, ogSize } from "@/lib/og";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = "image/png";

// Prototype C: lime on black.
export default function OG() {
  return ogImage({
    glow: "radial-gradient(circle at 80% 20%, rgba(198,244,50,.22), transparent 50%), radial-gradient(circle at 10% 100%, rgba(255,255,255,.06), transparent 45%)",
    bar: "linear-gradient(90deg, #C6F432, #C6F432)",
  });
}
