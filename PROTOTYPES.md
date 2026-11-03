# Prototypes

**Decision (owner, 2026-11-03): prototype A ("Editor") is the final site, served at `/`.**

All three prototypes were built and compared: A "Editor", B "Mechanical" (React Three Fiber keyboard) and C "Editorial". B and C, their themes, the dev switcher and the comparison screenshots were removed after the decision. Everything is still recoverable at git tag **`all-prototypes`** (`git checkout all-prototypes`). That tag's `PROTOTYPES.md` has the side-by-side screenshots, the rationales and the §9 results for all three.

Why A: the whole site reads like a refined code editor, which fits a developer audience. It uses no WebGL, so it stays fast on phones (124 KB first-load JS), and it scored highest on the "technical, precise" brief.

Final screenshots of the shipped site are in `docs/screenshots/`: one per section at 1440 px and the hero at 390 px. Regenerate them with `node scripts/sections.mjs` while `next start` is running.
