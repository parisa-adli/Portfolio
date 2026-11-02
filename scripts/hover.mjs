// Usage: node scripts/hover.mjs <path> <selector> <name>: moves the mouse over selector and screenshots at 1440.
import { chromium } from "@playwright/test";
const [path, sel, name] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
await p.goto("http://localhost:3000" + path, { waitUntil: "networkidle" });
if (sel.startsWith("@")) { const [x, y] = sel.slice(1).split(",").map(Number); await p.mouse.move(x - 40, y - 40); await p.mouse.move(x, y, { steps: 10 }); }
else { await p.locator(sel).first().scrollIntoViewIfNeeded(); await p.locator(sel).first().hover(); }
await p.waitForTimeout(900);
await p.screenshot({ path: `screenshots/${name}.png` });
console.log(name, errors.join(" | "));
await b.close();
