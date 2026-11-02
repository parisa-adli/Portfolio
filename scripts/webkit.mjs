// WebKit (Safari engine) pass: hero + projects + skills at 1440 and 390, console errors, keyboard press.
import { webkit } from "@playwright/test";
const b = await webkit.launch();
for (const w of [1440, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: w > 600 ? 900 : 844 } });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await p.goto("http://localhost:3000/a", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  await p.screenshot({ path: `screenshots/webkit-hero-${w}.png` });
  await p.keyboard.down("KeyA");
  const down = await p.locator('.key[data-code="KeyA"]').getAttribute("class");
  await p.keyboard.up("KeyA");
  for (const id of ["work", "skills"]) {
    await p.evaluate((id) => document.getElementById(id).scrollIntoView(), id);
    await p.waitForTimeout(1200);
    await p.screenshot({ path: `screenshots/webkit-${id}-${w}.png` });
  }
  console.log(w, "key press:", down?.includes("is-down"), "errors:", errors.join(" | ") || "none");
  await p.close();
}
await b.close();
