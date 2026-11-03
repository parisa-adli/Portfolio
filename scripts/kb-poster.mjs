// Usage: node scripts/kb-poster.mjs — renders B's WebGL keyboard at rest (reduced motion: no tilt/float) and
// saves the canvas alone, transparent, as public/b/keyboard.png (the poster shown before WebGL loads).
// Re-run after changing themes/b/Scene.tsx so the poster and the live scene stay identical.
import { chromium } from "@playwright/test";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
await p.goto((process.env.BASE_URL ?? "http://localhost:3000") + "/b", { waitUntil: "networkidle" });
await p.evaluate(() => window.dispatchEvent(new Event("scroll")));
await p.waitForSelector(".kb3d.is-ready canvas");
await p.waitForTimeout(2500); // legend atlas waits for fonts
await p.addStyleTag({
  content: `html, body, .theme-root { background: transparent !important; }
    body * { visibility: hidden !important; } .kb3d canvas { visibility: visible !important; }
    .theme-root::before, .kb3d::before { display: none !important; }`,
});
await p.locator(".kb3d canvas").screenshot({ path: "public/b/keyboard.png", omitBackground: true });
await b.close();
console.log("public/b/keyboard.png");
