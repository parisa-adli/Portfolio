// Usage: node scripts/shot.mjs [path=/a] [name=page] [--full] [--reduced]   env: EL=<selector> SCROLL=<selector> WIDTHS=1440,390
// Screenshots at 1440 and 390 px into /screenshots (git-ignored).
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [path = "/a", name = "page"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const full = process.argv.includes("--full");
const reduced = process.argv.includes("--reduced");
const base = process.env.BASE_URL ?? "http://localhost:3000";
const widths = (process.env.WIDTHS ?? "1440,390").split(",").map(Number);
mkdirSync("screenshots", { recursive: true });

const browser = await chromium.launch();
for (const w of widths) {
  const page = await browser.newPage({
    viewport: { width: w, height: w > 600 ? 900 : 844 },
    deviceScaleFactor: 1,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(base + path, { waitUntil: "networkidle" });
  if (process.env.SCROLL) {
    await page.evaluate((s) => document.querySelector(s)?.scrollIntoView(), process.env.SCROLL);
    await page.waitForTimeout(1200);
  }
  await page.waitForTimeout(Number(process.env.WAIT ?? 600));
  const file = `screenshots/${name}-${w}.png`;
  if (process.env.EL) await page.locator(process.env.EL).first().screenshot({ path: file });
  else await page.screenshot({ path: file, fullPage: full });
  console.log(file, errors.length ? "ERRORS: " + errors.map((e) => e.split("\n")[0].slice(0, 140)).join(" | ") : "");
  await page.close();
}
await browser.close();
