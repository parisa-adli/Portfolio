// Usage: node scripts/sweep.mjs [path=/a] — types "hire", shoots the hero keyboard mid-wave at 1440, then hovers the
// first tech keycap (macro column, top-left) and reports the tooltip.
import { chromium } from "@playwright/test";
const path = process.argv[2] ?? "/";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto((process.env.BASE_URL ?? "http://localhost:3000") + path, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await page.keyboard.type("hire", { delay: 60 });
await page.waitForTimeout(450);
const kb = page.locator(".kb").first();
await kb.screenshot({ path: "screenshots/sweep-1440.png" });
const toast = await page.locator(".toast").count();
const box = await kb.boundingBox();
await page.mouse.move(box.x + box.width * 0.79, box.y + box.height * 0.43);
await page.waitForTimeout(300);
const tip = await page.locator(".kb__tip.is-on").textContent().catch(() => null);
await kb.screenshot({ path: "screenshots/tip-1440.png" });
console.log({ toast, tip, errors });
await browser.close();
