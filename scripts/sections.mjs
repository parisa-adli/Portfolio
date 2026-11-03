// Usage: node scripts/sections.mjs [outDir=docs/screenshots]   (needs `next start`, or set BASE_URL)
// One screenshot per section at 1440 px, plus the hero at 390 px (§9 final check).
// Scrolls the whole page first so every reveal and lazy section has run.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const out = process.argv[2] ?? "docs/screenshots";
const SECTIONS = ["top", "work", "skills", "about", "experience", "contact"];
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const errors = [];
for (const w of [1440, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: w > 600 ? 900 : 844 } });
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await p.goto((process.env.BASE_URL ?? "http://localhost:3000") + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  if (w === 390) {
    await p.screenshot({ path: `${out}/hero-390.png` });
    await p.close();
    continue;
  }
  await p.screenshot({ path: `${out}/hero-1440.png` });
  for (let y = 0; y < (await p.evaluate(() => document.body.scrollHeight)); y += 600) {
    await p.evaluate((y) => window.scrollTo(0, y), y);
    await p.waitForTimeout(150);
  }
  for (const id of SECTIONS.slice(1)) {
    await p.evaluate((id) => document.getElementById(id).scrollIntoView(), id);
    await p.waitForTimeout(1200);
    await p.locator(`#${id}`).screenshot({ path: `${out}/${id}-1440.png` });
  }
  await p.locator("footer").screenshot({ path: `${out}/footer-1440.png` });
  await p.close();
}
await b.close();
console.log(errors.length ? errors : "no console errors");
