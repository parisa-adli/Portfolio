import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.headline}`;
export const size = { width: 1200, height: 630 };

const GLOW = "radial-gradient(circle at 80% 20%, rgba(139,92,246,.35), transparent 50%), radial-gradient(circle at 10% 100%, rgba(34,211,238,.18), transparent 45%)";
export const contentType = "image/png";

// OG image (§9): editor-style card, violet → cyan accent.
export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 72, background: "#07080A", color: "#EDEEF0", backgroundImage: GLOW,
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, color: "#A3A8B0", fontFamily: "monospace" }}>
          ~/PARISA — FULL-STACK DEVELOPER
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{profile.name}</div>
          <div style={{ fontSize: 38, color: "#A3A8B0", maxWidth: 980, lineHeight: 1.25 }}>{profile.positioning}</div>
        </div>
        <div style={{ display: "flex", height: 6, width: 360, borderRadius: 6, background: "linear-gradient(90deg, #8B5CF6, #22D3EE)" }} />
      </div>
    ),
    size,
  );
}
