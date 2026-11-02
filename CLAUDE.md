# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Source of truth

`docs/DESIGN.md` is the single source of truth for design, content and scope. **Re-read it in full before starting any new section or prototype.** If this file and DESIGN.md disagree, DESIGN.md wins.

`docs/DESIGN.md` is the only DESIGN.md. Impeccable (or any other skill) must not create a root `DESIGN.md`. If Impeccable guidance or detector findings conflict with `docs/DESIGN.md`, `docs/DESIGN.md` wins.

Owner inputs: `docs/cv.pdf` is the LinkedIn export and is git-ignored, so never commit it. `docs/keyboard (1).webp` and `docs/keyboard (2).webp` are the keyboard references.

## How to work

- **Build one prototype at a time** (A, then B, then C). Stop and wait for the owner's approval before starting the next one.
- Gather content first (§2), then build in this order: tokens → layout shell → hero keyboard → projects → skills → marquee bands → remaining sections → polish → audits.
- **After finishing each section**, run the dev server and take Playwright screenshots at **1440px** and **390px**. Review them and fix issues before moving on.
- **Never invent content, metrics or links.** Use `{{TODO: ...}}` placeholders and log each one in `CONTENT_GAPS.md`.

## Tech stack (§7)

- Next.js 15 App Router + TypeScript + Tailwind CSS v4, with tokens as CSS variables.
- GSAP 3 (ScrollTrigger, SplitText) + Lenis. React Three Fiber + drei only for prototype B's keyboard (dynamic import, `ssr:false`).
- Playwright for screenshots and visual checks. `next/image` (AVIF/WebP) and `next/font` (self-hosted). Deploy to Vercel.
- Content lives only in typed files in `/content`. Shared logic goes in `/components/core`; per-prototype styling goes in `/themes/{a,b,c}`.

## Design tokens (§3.1)

- Backgrounds: `--bg-0 #07080A`, `--bg-1 #0D0F12`, `--bg-2 #14171C`. Lines: `--line` at 8% white, `--line-strong` at 16% white.
- Text: `--text-0 #EDEEF0`, `--text-1 #A3A8B0`, `--text-2 #6B717A`.
- Radii: 8 / 14 / 22px. Easing: `--ease-out: cubic-bezier(.22,1,.36,1)`. Spacing: 4 8 12 16 24 32 48 64 96 128 160.
- Prototypes override **accents only**.
- Type: one sans + one mono. Display headings are 64–120px at -0.03em. Mono labels are 11–12px uppercase at +0.12em.
- Grid: 12 columns, 1240px max width, 24px gutters. Section padding is 128–160px on desktop and 80px on mobile.

## Motion (§4.4)

- Heading reveals: split by line or word, `y: 100% → 0`, stagger 0.04, 0.8s `--ease-out`, once per element.
- Micro-interactions take 200–400ms; reveals take 600–900ms. Only marquees and the caret loop.
- Per-frame effects use one rAF loop writing CSS variables, never React state. Animate `scaleX`/`scaleY`, never `width`/`height`.
- `prefers-reduced-motion`: opacity fades only, no Lenis, no custom cursor or spotlight.

## Do / Do not (§8)

- Do: one focal point per section; real content and links only; every hover state also reachable via `:focus-visible`; touch targets ≥ 44px; a mobile layout that is designed, not just stacked.
- Don't:
  - A generic template look.
  - Particle storms, autoplaying sound, or scroll-jacking beyond Lenis.
  - More than one 3D object in view at a time.
  - Neon gradients everywhere, glassmorphism on every element, or emoji decoration.
  - `#` links, fake testimonials, or invented metrics.
  - Layout shift from fonts or images.

## Acceptance checks (§9), required before a prototype counts as done

- Lighthouse mobile: Performance ≥ 90; Accessibility, Best Practices and SEO ≥ 95.
- LCP < 2.0s, CLS < 0.05, INP < 200ms. First-load JS < 200 KB gzipped (excluding the lazy 3D chunk).
- WCAG AA contrast, full keyboard navigation, reduced-motion mode verified.
- Tested at widths 390 / 768 / 1280 / 1440 / 1920, in Safari and Chrome.
- Meta: title, description, OG image, favicon, `sitemap.xml`, `robots.txt`, JSON-LD `Person`.
- Write `CONTENT_GAPS.md` and `PROTOTYPES.md`.
