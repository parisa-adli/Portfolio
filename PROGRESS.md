# Prototype A ("Editor"): progress (branch `prototype-a`, slices committed in `e58e36b`)

## Done
- Slices S1–S13 built: tokens and Geist fonts, dot grid with spotlight and cursor, nav pill with progress bar, Lenis, hero with the 75% CSS keyboard (typing, taps, sound toggle, tech tooltips, `hire`/`next`/`react` easter egg), project cards and `/work/[slug]`, marquee bands, Skills, About, Experience, Contact (server action), footer, ⌘K menu, dev switcher, heading reveals.
- S14 meta: OG image, favicon, `sitemap.xml`, `robots.txt`, JSON-LD `Person`.
- §9 results on the last verified build (prod, Lighthouse mobile ×5): Perf 93–98, A11y/BP/SEO 100, LCP 1.5s, CLS 0. `/a` first-load JS 124 KB (budget 200). `/work` Perf 98, CLS 0.031.
- axe (WCAG 2.2 AA + best practice): 0 violations on `/a` and `/work` at 390/1440 and in reduced motion. Tab walk: 41 stops, all with a visible ring. Reduced motion verified. WebKit runs with no errors. Unit tests 3/3 pass.

- Keyboard sweep checked on the prod build (`scripts/sweep.mjs`, 1440): one soft band, clipped to the board.
- `PROTOTYPES.md` written. Hero/projects/skills shots at 1440 + 390 are in `docs/prototypes/a/`.
- `CONTENT_GAPS.md` now lists `NEXT_PUBLIC_SITE_URL`, `RESEND_FROM` (verified domain), `RESEND_API_KEY` and the real Safari/iOS check.
- Slices committed (`e58e36b`).
- Final Lighthouse mobile on `/a` (2026-11-03, one run): Perf **89**, A11y/BP/SEO 100, LCP 1.5s, CLS 0, TBT 440ms.

## Left
- [ ] Perf 89 is 1 point under the §9 target, caused by TBT at 440ms. Earlier ×5 runs scored 93–98, and this run shared the CPU with a stale `next start` on :3000. Re-run ×5 on a quiet machine, or on the Vercel preview, before signing off.
- [ ] Test on a real device in Safari (owner; Windows WebKit was the only stand-in). Tracked in `CONTENT_GAPS.md`.
- [ ] Commit this session's docs/scripts changes when you approve.

## Known bugs / risks
- Windows WebKit draws Geist headings too thin because it ignores the variable `wght` axis. Not checked in real Safari.
- INP (4× CPU, 390 touch): steady state 30–150ms. The first tap sometimes spikes to ~240–290ms when it overlaps idle lazy loading. Desktop 4× skills tab ~230–290ms (about 70ms at 1×).
- The contact form says "sent ✓" even without `RESEND_API_KEY`; it only logs. Set the key before launch.
- `/work` CLS 0.031: `.case__grid` shifts, probably from the font swap. Passes, but it isn't zero.
- Keyboard tech-key counts are in the board's `aria-label` only. Sighted keyboard-only users can't open the tooltips (decorative by spec).
- The rate limit is in memory, per server instance.

## Key files
- Page: `app/a/page.tsx`, `app/a/layout.tsx` (meta, JSON-LD). Case study: `app/work/[slug]/page.tsx` + `components/core/CaseStudy.tsx`.
- Theme A skin: `themes/a/{ThemeA.tsx,tokens.css,a.css,keyboard.css}`. Shared structure CSS: `components/core/*.css`.
- Keyboard: `components/core/Keyboard/{layout.ts,Keyboard.tsx,controller.ts,sound.ts,KeyboardIsland.tsx}`.
- Motion: `lib/motion.ts` (onScroll, lazy GSAP), `lib/pointer.ts` (shared rAF), `components/core/{MotionProvider,Reveal,Marquee,LineDraw}.tsx`.
- Contact: `app/actions/contact.ts`, `lib/contact.ts` (+ test). Tech counts: `lib/techCount.ts` (+ test).
- Checks: `scripts/{shot,sweep,hover,kbtest,s12test,a11y,tabwalk,reduced,webkit,inp,inp-mobile}.mjs`, `scripts/lh.sh`.

## Decisions (most were made for INP or TBT)
- The keyboard is a server-rendered CSS 3D grid of `<span>` keys inside `role="img"`. It's flat, with no `preserve-3d`, which had made ~90 compositor layers. The controller loads on idle.
- No ScrollTrigger. Lenis rAF runs only while scrolling. Nav progress and the timeline line use a cached `onScroll`.
- Marquee runs on WAAPI on the compositor, with scroll velocity mapped to `playbackRate`. This departs from §4.3's "GSAP tween".
- GSAP and SplitText load only for heading reveals, armed on the first scroll. Under reduced motion, reveals are CSS fades.
- Skills "typing" is one cover wiping down the editor, not per-character typing. Caret and orbit use composited animations.
- ⌘K is a non-modal `<dialog>` with a manual focus trap, because `showModal()` cost ~270ms of recalc.
- Below-the-fold sections use `content-visibility: auto` and Suspense boundaries. The hero keyboard height is reserved on mobile, so there's no CLS.
- Sound is synthesized with Web Audio (no sample files), muted by default, and created after the first paint.
