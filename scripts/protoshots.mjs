// Usage: node scripts/protoshots.mjs <id> [outDir=docs/prototypes/<id>]
// Hero (viewport), projects (#work) and skills (#skills) at 1440 and 390 px, for PROTOTYPES.md.
// Scrolls the whole page first so every reveal and lazy section has run.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const id = process.argv[2] ?? "a";
const out = process.argv[3] ?? `docs/prototypes/${id}`;
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
for (const w of [1440, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: w > 600 ? 900 : 844 } });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto((process.env.BASE_URL ?? "http://localhost:3000") + "/" + id, { waitUntil: "networkidle" });
  await p.waitForTimeout(3500); // lazy keyboard (B's WebGL chunk) + fonts
  await p.screenshot({ path: `${out}/hero-${w}.png` });
  for (let y = 0; y < (await p.evaluate(() => document.body.scrollHeight)); y += 600) {
    await p.evaluate((y) => window.scrollTo(0, y), y);
    await p.waitForTimeout(150);
  }
  for (const [sel, name] of [["#work", "projects"], ["#skills", "skills"]]) {
    await p.evaluate((s) => document.querySelector(s).scrollIntoView(), sel);
    await p.waitForTimeout(1200);
    await p.locator(sel).screenshot({ path: `${out}/${name}-${w}.png` });
  }
  console.log(w, errors.length ? errors : "ok");
  await p.close();
}
await b.close();
