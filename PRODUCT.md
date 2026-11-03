# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Decided in `docs/DESIGN.md` §7: Next.js 15 App Router, TypeScript, Tailwind CSS v4, GSAP 3 + Lenis, React Three Fiber only for prototype B's keyboard. Deploys to Vercel. `docs/DESIGN.md` is the single source of truth for design, content and scope; this file records product facts only.

## Users

Two audiences, weighted equally (confirmed by the owner 2026-11-03):

- **Freelance clients:** founders and small businesses looking for someone to build a web product. Success means they get in touch about a project.
- **Hiring teams:** recruiters and engineering leads filling a role. Success means they reach out for an interview.

Both are evaluating one thing: can this person build and ship a real product, and do they have taste?

## Product Purpose

The personal portfolio of Parisa Adli. It exists to turn a visit into contact (email, LinkedIn or GitHub). Visitors should leave thinking "technical, precise, has taste, ships real products."

Three prototypes (A Editor, B Mechanical, C Editorial) share the same content and sections. The owner compares them and picks one.

## Positioning

**Full-Stack Developer** (confirmed by the owner 2026-11-03; this replaces the "Frontend Developer" wording in the GitHub bio and the DESIGN.md drafts). The work covers modern React and Next.js front ends plus Node.js/Express REST APIs and MongoDB. The point of difference is end-to-end products shown in real repos: role-based dashboards, e-commerce, OTP/JWT/Telegram auth, type-safe code (TypeScript, Zod) and automated tests (Vitest, Supertest, Playwright) with CI.

## Operating Context

- Visitors usually arrive from LinkedIn, GitHub or a direct link, often on a phone.
- They skim the hero and the projects, then open a repo or a case study (`/work/[slug]`) to check the work is real.
- Contact happens through click-to-copy email, a contact form, LinkedIn or GitHub.

## Capabilities and Constraints

- All content lives in typed files in `/content` (`profile.ts`, `projects.ts`, `skills.ts`, `experience.ts`). Raw GitHub data is in `/content/raw`.
- Never invent content, metrics or links. Use `{{TODO: ...}}` placeholders and log each one in `CONTENT_GAPS.md`.
- **Decided 2026-11-03:** location, timezone, availability, spoken languages, certifications, years of experience and stat counters stay off the site. Instagram is `https://www.instagram.com/parisa.adli.dev`. Work experience: none; the Experience section is a git log of independent projects.
- **Owner decision 2026-11-03 (About):** the terminal card is data-driven from `profile.terminal` (whoami, stack, focus, featured links to `/work/[slug]`). An optional `profile.status` line exists but stays unset, so availability is still off the site. A small framed photo (`profile.photo` → `public/parisa.jpg`) sits next to the bio in About, never in the Hero.
- Open: live demo URLs and screenshots. See `CONTENT_GAPS.md`.
- Performance and quality gates are in `docs/DESIGN.md` §9.

## Brand Commitments

- Name: Parisa Adli. Contact email: `parisa.adli.dev@gmail.com`.
- Links: https://github.com/parisa-adli and https://www.linkedin.com/in/parisa-adli.
- Voice: confident, concise, first person, no buzzword soup, occasional dry wit.
- The keyboard references (`docs/keyboard (1).webp`, `docs/keyboard (2).webp`) are binding for the hero keyboard. Details are in DESIGN.md §5.1.
- The phone number in the CV stays off the site.

## Evidence on Hand

- `docs/cv.pdf`: the LinkedIn export. It is git-ignored and must never be committed. Note that its WorkBridge entry is wrong.
- `content/raw/github.json`: 27 public repos, with commit counts and stacks, fetched 2026-11-03.
- Six selected projects are in `content/projects.ts`. The most mature is the inventory app: full-stack TypeScript, Playwright E2E tests and GitHub Actions CI.
- Education: Bachelor's in Software Engineering (2019). The school name is not shown on the site (owner decision 2026-11-03).
- **Missing; do not fabricate:** live deployment URLs, project screenshots, work-experience entries, testimonials, Lighthouse scores and client names. There are also no certifications.

## Product Principles

1. **Proof over claims.** Every statement points at a repo, a commit history, a test suite or a live product. Where proof is missing, the site stays silent.
2. **Both audiences, one story.** Clients and hiring teams both get the same evidence: a real product built end to end.
3. **Craft is the pitch.** Fast, accessible and polished, because a slow or broken portfolio disproves the claim.
4. **Owner-cleared facts only.** Personal details (location, availability, socials) go public only after the owner confirms them.

## Accessibility & Inclusion

WCAG AA contrast, full keyboard navigation, every hover state reachable via `:focus-visible`, touch targets ≥ 44px, and a working `prefers-reduced-motion` mode. Sound is muted by default.
