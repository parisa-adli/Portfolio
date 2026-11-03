// Full axe-core audit of every section (content-visibility forced visible so nothing is skipped),
// at 390 and 1440, normal + reduced motion. Usage: node scripts/a11y.mjs [path=/a]
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
const axe = readFileSync("node_modules/axe-core/axe.min.js", "utf8");
const path = process.argv[2] ?? "/a";
const b = await chromium.launch();
let total = 0;
for (const [w, reduced] of [[390, false], [1440, false], [1440, true]]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, reducedMotion: reduced ? "reduce" : "no-preference" });
  await p.goto((process.env.BASE_URL ?? "http://localhost:3000") + path, { waitUntil: "networkidle" });
  await p.addStyleTag({ content: ".cv-auto{content-visibility:visible!important}" });
  // scroll through so lazy/in-view states settle, then back to top
  for (let y = 0; y < (await p.evaluate(() => document.body.scrollHeight)); y += 700) {
    await p.evaluate((y) => window.scrollTo(0, y), y);
    await p.waitForTimeout(120);
  }
  await p.waitForTimeout(1500);
  await p.addScriptTag({ content: axe });
  const res = await p.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"] });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, ex: v.nodes.slice(0, 3).map((n) => n.target.join(" ") + " :: " + (n.any[0]?.message ?? n.failureSummary).slice(0, 140)) }));
  });
  total += res.length;
  console.log(`\n== ${path} @${w}${reduced ? " reduced" : ""}: ${res.length} violation types`);
  res.forEach((v) => console.log(` - ${v.id} (${v.impact}) x${v.n}\n     ${v.ex.join("\n     ")}`));
  await p.close();
}
await b.close();
process.exit(total ? 1 : 0);
