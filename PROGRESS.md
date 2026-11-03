# Portfolio: progress (final site = prototype A, served at `/`)

## Done
- **Decision (2026-11-03):** prototype A ("Editor") is the final site. All three prototypes are tagged `all-prototypes` (B and C are recoverable there).
- **Finalized on A** (branch `finalize-a`):
  - The site moved from `/a` to `/`. The case studies are back at `/work/[slug]`.
  - Removed `/b`, `/c`, `themes/b`, `themes/c`, the R3F keyboard and its poster, the dev switcher and the ⌘K "switch prototype" entries.
  - Removed the multi-prototype plumbing: the shared page, the work-route factory, per-prototype metadata/OG, `PROTOS`, and the `base` link props.
  - Removed deps `three`, `@react-three/fiber`, `@types/three` and the unused `@gsap/react`.
  - Removed dead code: `brandColor`, `soundOn`, the one-off `kbtest`/`s12test` scripts, the broken `lint` script (no ESLint config) and the `/` → `/a` redirect.
- **Build:** clean, with no warnings. `/` first-load JS is 124 KB (budget 200). `/work/*` is static. Typecheck is clean and unit tests pass 3/3.
- **§9 final checks** (prod build, run once each):
  - Lighthouse mobile on `/`: Perf **94**, A11y/BP/SEO **100**, LCP 1.5 s, CLS 0, TBT 250 ms.
  - Lighthouse mobile on `/work/inventory-manager`: Perf 97, A11y/BP/SEO 100, LCP 0.8 s, CLS 0.031.
  - axe (WCAG 2.2 AA + best practice, which covers contrast): 0 violations on `/` and `/work/nexaivon` at 390 and 1440, and in reduced motion.
  - Keyboard navigation: 41 tab stops, all with a visible focus ring.
  - Reduced motion: no Lenis, cursor, spotlight or keyboard float; reveals are fades only; caret, orbit and strip are static.
  - 390 / 768 / 1440 checked. Screenshots are in `docs/screenshots/`, with no console errors.
- **SEO verified:** title, description, canonical, OG + Twitter tags, OG image (1200×630 PNG), favicon (`icon.svg`), `sitemap.xml` (`/` + 5 case studies), `robots.txt`, and JSON-LD `Person` for Parisa Adli with GitHub, LinkedIn and Instagram in `sameAs`.

- **About update (owner decision 2026-11-03):** terminal card is now data-driven (`profile.terminal`, typing schedule in `lib/terminal.ts` + test, capped at ~3.4 s), with stack columns on a wrapping mono grid and the 3 featured projects as `/work/[slug]` links. Optional `profile.status` line (unset). Framed photo window (`profile.photo`, next/image, lazy, square, no CLS) beside the bio, above the terminal on mobile. `role` prop removed. Tests 5/5, build clean (`/` first-load 127 KB), axe 0 violations, 44 tab stops all with a ring, reduced motion verified.

## Left
- [ ] Everything in `CONTENT_GAPS.md`. The launch blockers are `NEXT_PUBLIC_SITE_URL` (canonical, OG, sitemap and JSON-LD still point at `http://localhost:3000`), `RESEND_API_KEY` + `RESEND_FROM`, the featured demo deploys, and the 15 project screenshots.
- [ ] Real Safari / iPhone check (owner).
- [ ] `npm audit` reports 7 dependency advisories (6 moderate, 1 high). They predate this work and haven't been triaged.
- [ ] `CLAUDE.md` still describes the three-prototype workflow (`/themes/{a,b,c}`, "one prototype at a time"). Update it if it should now describe a single site.

## Known bugs / risks
- The INP approximation at 4× CPU on desktop is ~200–216 ms on the skills-tab click (`SkillsFilter`), and mobile taps measure 136–144 ms. Re-measure on an idle machine; if it's still over, the fix belongs in `SkillsFilter`.
- The contact form says "sent ✓" without `RESEND_API_KEY`; it only logs. The rate limit is in memory, per server instance.
- `/work` CLS is 0.031 (passes, but isn't zero). It's probably the font swap in `.case__grid`.
- Windows WebKit draws Geist headings too thin. Not checked in real Safari.
- The old `/a` URL now returns 404. Add a redirect if it was ever shared.

## Key files
- Root: `app/layout.tsx` (theme, metadata, JSON-LD), `app/page.tsx`, `app/opengraph-image.tsx`, `app/work/[slug]/page.tsx`, `app/sitemap.ts`, `app/robots.ts`.
- Skin: `themes/a/*`. Shared structure and sections: `components/core/*`. Content: `content/*`.
- Checks: `scripts/{lh.sh,a11y,tabwalk,reduced,webkit,inp,inp-mobile,sweep,shot,sections,hover}.mjs`.
