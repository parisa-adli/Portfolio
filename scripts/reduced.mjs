// Verifies prefers-reduced-motion: no Lenis, no custom cursor/spotlight, no float/tilt, static marquees,
// opacity-only reveals, caret/orbit/strip animations neutralised.
import { chromium } from "@playwright/test";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await p.goto((process.env.BASE_URL ?? "http://localhost:3000") + (process.argv[2] ?? "/a"), { waitUntil: "networkidle" });
await p.mouse.move(700, 400);
await p.evaluate(() => document.querySelector("#skills").scrollIntoView());
await p.waitForTimeout(1500);
const r = await p.evaluate(() => {
  const track = document.querySelector(".band__track");
  const anim = (sel) => { const el = document.querySelector(sel); return el ? getComputedStyle(el).animationDuration : "n/a"; };
  return {
    lenis: document.documentElement.classList.contains("lenis"),
    customCursor: document.documentElement.classList.contains("has-cursor"),
    spotlightOpacity: getComputedStyle(document.querySelector(".fx-spot")).opacity,
    kbAlive: document.querySelector(".kb, .kb3d").classList.contains("is-alive"),
    marqueeTransform: getComputedStyle(track).transform,
    revealMode: [...document.querySelectorAll("[data-reveal]")].map((h) => h.className.includes("reveal-fade") ? "fade" : h.querySelector("div") ? "split" : "none"),
    revealTransition: getComputedStyle(document.querySelector("[data-reveal]")).transitionDuration,
    caret: anim(".caret"), orbit: anim(".orbit"), strip: anim(".logo-strip__track"),
  };
});
console.log(r);
await p.screenshot({ path: "screenshots/reduced-skills.png" });
await b.close();
