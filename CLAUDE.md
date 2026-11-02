# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

Pre-scaffold. The repo contains only `docs/`:
- `docs/PORTFOLIO_DESIGN_SPEC.md` — the full brief. **Read it before writing any code**; it is the source of truth for sections, tokens, motion, and acceptance checks.
- `docs/cv.pdf` — the owner's LinkedIn PDF export (the only LinkedIn source).
- `docs/keyboard (1).webp`, `docs/keyboard (2).webp` — the hero keyboard references. Ignore the `.jpeg`/`.png`.

Owner decisions already folded into the spec (§5.1): the keyboard is full-sized, with no rows ever trimmed. On mobile it comes first, spanning the full viewport width, and all other hero content goes below it.

Not a git repo yet. No package.json, so no build/lint/test commands exist yet — update this file once the project is scaffolded.

## What is being built

A personal portfolio for Parisa Adli (freelance React/Next.js frontend developer), as **three interchangeable prototypes** (A "Editor", B "Mechanical", C "Editorial") sharing the same content, sections, and component API, differing only in visual direction (spec §6).

Planned stack (spec §7): Next.js 15 App Router + TypeScript + Tailwind v4 (tokens as CSS variables), GSAP + ScrollTrigger + SplitText, Lenis, React Three Fiber only for prototype B's keyboard (dynamic import, `ssr:false`), Playwright for project screenshots and visual checks, Vercel deploy.

## Architecture rules

- Routes `/a`, `/b`, `/c` plus `/work/[slug]`; dev-only `A · B · C` switcher bottom-left that keeps scroll position.
- Prototypes read content **only** from typed files in `/content` (`profile.ts`, `projects.ts`, `skills.ts`, `experience.ts`; raw sources in `/content/raw/`). Shared logic in `/components/core`; visual variants in `/themes/{a,b,c}` override accents/fonts only, not structure.
- Per-frame effects (cursor, spotlight) use one `requestAnimationFrame` loop writing CSS variables (`--mx`, `--my`) — never React state per frame. Progress bars animate `scaleX`/`scaleY`, never `width`/`height`.
- Hero H1 is the LCP element; the keyboard must be lazy-hydrated and must not block it.
- Everything honours `prefers-reduced-motion` (opacity fades only, no Lenis, no custom cursor/spotlight) and touch devices (no custom cursor/spotlight).

## Workflow (spec §0)

1. Content pipeline first (spec §2): GitHub via `gh`/public API → `/content/raw/github.json`; never scrape LinkedIn.
2. Build order: tokens → layout shell → hero keyboard → projects → skills → marquee bands → remaining sections → polish → audits.
3. After each major section, run the dev server and take Playwright screenshots at 1440px and 390px; review and fix before moving on.

## Hard rules

- No lorem ipsum, invented metrics, fake testimonials, or `#` links. Missing facts become `{{TODO: ...}}` and are logged in `CONTENT_GAPS.md`; hide buttons with no real URL.
- Instagram link: confirm with the owner before including.
- Reference sites (spec §10): take interaction ideas only, never their code or assets.
- Done means passing spec §9 (Lighthouse mobile ≥ 90/95/95/95, CLS < 0.05, first-load JS < 200 KB gz excluding the 3D chunk, WCAG AA, keyboard nav) and producing `CONTENT_GAPS.md` + `PROTOTYPES.md`.
