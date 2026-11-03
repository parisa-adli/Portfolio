// Mobile INP approximation: 390x844, touch, isMobile, 4x CPU, taps. Max Event Timing duration per interaction.
import { chromium } from "@playwright/test";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await p.addInitScript(() => { window.__ev = []; new PerformanceObserver((l) => l.getEntries().forEach((e) => e.interactionId && window.__ev.push(Math.round(e.duration)))).observe({ type: "event", durationThreshold: 16 }); });
await p.goto((process.env.BASE_URL ?? "http://localhost:3000") + (process.env.P ?? "/a"), { waitUntil: "networkidle" });
await p.waitForTimeout(3000);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
const tapAt = async (sel) => {
  const r = await p.evaluate((sel) => { const b = document.querySelector(sel).getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; }, sel);
  await p.touchscreen.tap(r[0], r[1]);
};
const measure = async (label, fn) => {
  const out = [];
  for (let i = 0; i < 2; i++) { await p.evaluate(() => (window.__ev = [])); await fn(); await p.waitForTimeout(700); out.push(await p.evaluate(() => Math.max(0, ...window.__ev))); }
  console.log(label.padEnd(18), out.join(" / "), "ms");
  return Math.max(...out);
};
const res = [];
res.push(await measure("tap keycap", () => tapAt('.key[data-code="KeyW"], .kb3d')));
res.push(await measure("sound toggle", () => tapAt(".sound-toggle")));
res.push(await measure("menu (cmd-k)", async () => { await tapAt(".nav__k"); await p.waitForTimeout(300); await tapAt(".cmdk-overlay"); }));
await p.evaluate(() => document.querySelector("#skills").scrollIntoView());
await p.waitForTimeout(1500);
res.push(await measure("skills tab", async () => { await tapAt("#skills-tab-Backend"); await p.waitForTimeout(400); await tapAt("#skills-tab-All"); }));
await p.evaluate(() => document.querySelector("#contact").scrollIntoView());
await p.waitForTimeout(1500);
res.push(await measure("copy email", () => tapAt(".copy-email")));
res.push(await measure("focus input", () => tapAt("#tx-name")));
console.log("worst (≈INP @4x mobile):", Math.max(...res), "ms");
await b.close();
