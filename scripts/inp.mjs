// Approximates INP: Event Timing duration per labelled interaction (2nd run = steady state).
// Usage: node scripts/inp.mjs [cpuThrottle=4]
import { chromium } from "@playwright/test";
const rate = Number(process.argv[2] ?? 4);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send("Emulation.setCPUThrottlingRate", { rate });
await p.addInitScript(() => {
  window.__ev = [];
  new PerformanceObserver((l) => l.getEntries().forEach((e) => e.interactionId && window.__ev.push(Math.round(e.duration))))
    .observe({ type: "event", durationThreshold: 16, buffered: true });
});
await p.goto("http://localhost:3000/a", { waitUntil: "networkidle" });
if (process.env.STYLE) await p.addStyleTag({ content: process.env.STYLE });
await p.waitForTimeout(4000);
const measure = async (label, fn) => {
  const out = [];
  for (let i = 0; i < 2; i++) {
    await p.evaluate(() => (window.__ev = []));
    await fn();
    await p.waitForTimeout(600);
    out.push(await p.evaluate(() => Math.max(0, ...window.__ev)));
  }
  console.log(label.padEnd(22), out.join(" / "), "ms");
  return Math.max(...out.slice(1));
};
const clickAt = async (sel) => {
  const r = await p.evaluate((sel) => { const b = document.querySelector(sel).getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; }, sel);
  await p.mouse.click(r[0], r[1]);
};
const res = [];
res.push(await measure("physical key", () => p.keyboard.press("KeyQ")));
res.push(await measure("click keycap", () => clickAt('.key[data-code="KeyW"]')));
res.push(await measure("secret word wave", () => p.keyboard.type("hire")));
res.push(await measure("sound toggle", () => clickAt(".sound-toggle")));
await p.evaluate(() => document.querySelector("#skills").scrollIntoView());
await p.waitForTimeout(1500);
res.push(await measure("skills tab", async () => { await clickAt("#skills-tab-Backend"); await p.waitForTimeout(300); await clickAt("#skills-tab-All"); }));
res.push(await measure("cmd-k open+close", async () => { await p.keyboard.press("Control+k"); await p.waitForTimeout(300); await p.keyboard.press("Escape"); }));
console.log(`steady-state worst @${rate}x:`, Math.max(...res), "ms");
await b.close();
