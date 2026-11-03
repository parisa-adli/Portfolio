// Usage: node scripts/sweep.mjs — types "hire" and shoots the hero keyboard mid-sweep at 1440.
import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto((process.env.BASE_URL ?? "http://localhost:3000") + "/a", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.keyboard.type("hire", { delay: 60 });
await page.waitForTimeout(450);
await page.locator(".kb").first().screenshot({ path: "screenshots/sweep-1440.png" });
console.log("wave:", await page.locator(".kb.is-wave").count(), errors.join(" | "));
await browser.close();
