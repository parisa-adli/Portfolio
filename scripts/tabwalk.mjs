// Tabs through the page and reports each stop + whether it shows a visible focus indicator.
import { chromium } from "@playwright/test";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto((process.env.BASE_URL ?? "http://localhost:3000") + (process.argv[2] ?? "/"), { waitUntil: "networkidle" });
const seen = [];
let noRing = 0;
for (let i = 0; i < 120; i++) {
  await p.keyboard.press("Tab");
  const info = await p.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    const after = getComputedStyle(el, "::after");
    const ring = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0 || after.outlineStyle !== "none" && parseFloat(after.outlineWidth) > 0 || cs.boxShadow !== "none";
    const r = el.getBoundingClientRect();
    return { d: (el.tagName.toLowerCase() + " " + (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ")).slice(0, 60), ring, onscreen: r.bottom > 0 && r.top < innerHeight };
  });
  if (!info) break;
  if (seen.length && seen[0] === info.d) break; // wrapped
  seen.push(info.d);
  if (!info.ring || !info.onscreen) noRing++;
  console.log(String(i + 1).padStart(3), info.ring ? "ring" : "NO-RING", info.onscreen ? "" : "OFFSCREEN", info.d);
}
console.log("stops:", seen.length, "problems:", noRing);
await b.close();
