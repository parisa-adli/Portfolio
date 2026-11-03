import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const ogAlt = `${profile.name} — ${profile.headline}`;
export const ogSize = { width: 1200, height: 630 };

// Per-prototype OG image (§9): same card, each prototype passes its own glow and accent bar.
export function ogImage({ glow, bar }: { glow: string; bar: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 72, background: "#07080A", color: "#EDEEF0", backgroundImage: glow,
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, color: "#A3A8B0", fontFamily: "monospace" }}>
          ~/PARISA — FULL-STACK DEVELOPER
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{profile.name}</div>
          <div style={{ fontSize: 38, color: "#A3A8B0", maxWidth: 980, lineHeight: 1.25 }}>{profile.positioning}</div>
        </div>
        <div style={{ display: "flex", height: 6, width: 360, borderRadius: 6, background: bar }} />
      </div>
    ),
    ogSize,
  );
}
