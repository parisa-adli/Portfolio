# Portfolio Design Spec — Parisa Adli
> Brief for Claude Code. Read this whole file before writing any code.
> Goal: build **3 interchangeable prototypes** (A / B / C) of one personal portfolio that share the same content, sections, and component API, but differ in visual direction. The user will compare them and pick one.

---

## 0. How to work (instructions for Claude Code)

1. **Gather content first, design second.** Run the content pipeline in §2 before building any UI. Never ship lorem ipsum — if a fact is missing, use a clearly marked placeholder `{{TODO: ...}}` and list it in `CONTENT_GAPS.md`.
2. Scaffold one Next.js project with a **prototype switcher** (`/a`, `/b`, `/c` routes + a small floating toggle in dev) so all three can be compared side by side. Shared content lives in `/content`, shared logic in `/components/core`, visual variants in `/themes/{a,b,c}`.
3. Build in this order: tokens → layout shell (nav, scroll bar, background, cursor) → hero keyboard → projects → skills → marquee bands → remaining sections → polish → audits (§9).
4. After each major section, run the dev server, take a Playwright screenshot at 1440px and 390px, look at it, and fix issues before moving on.
5. Respect every "Do not" in §8.

---

## 1. Who this is for

- **Owner:** Parisa Adli — Full-Stack Developer | React · Next.js · TypeScript · Node.js · Express, works freelance with clients.
- **Audience:** potential clients and hiring teams. They should leave thinking: *"technical, precise, has taste, ships real products."*
- **Positioning line (draft, refine from LinkedIn):** "Frontend developer building fast, polished web apps with React & Next.js."
- **Links:**
  - GitHub: https://github.com/parisa-adli
  - LinkedIn: https://www.linkedin.com/in/parisa-adli
  - Instagram: https://instagram.com/parisa__ad (from GitHub README — confirm with owner before including)

---

## 2. Content pipeline (do this first)

### 2.1 GitHub (automated)
Use `gh` CLI or the public GitHub API (`/users/parisa-adli`, `/users/parisa-adli/repos?per_page=100`, each repo's README and `languages` endpoint). Save raw output to `/content/raw/github.json`.

Known facts (verified Nov 2026, re-check):
- Bio: "Frontend Developer | React JS | Next JS"
- README stack badges: CSS3, JavaScript, TypeScript, React, Next.js, Node.js, MongoDB, GraphQL, Postman, Tailwind CSS
- ~26 public repos. **Pinned:**
  1. `Next.js-next-shop-panel` — e-commerce platform + admin panel, Next.js (SSR/SSG, API routes), Tailwind custom theme, custom hooks, deployed on Vercel. 80+ commits.
  2. `Next.js-blog-app` — blog application, Next.js
  3. `React-freelancer-app` — freelancer marketplace app, React
  4. `React-Booking-Hotel_App` — hotel booking app, React
  5. `React-rick-and-morty-app` — Rick & Morty API explorer, React
  6. `-inventory-app-ai` — TypeScript full-stack (client/server/shared), Playwright E2E tests, GitHub Actions CI, email auth, AI-assisted dev workflow (CLAUDE.md). 68+ commits. **Most technically mature — feature it first.**

For each project, derive from README + code: one-line pitch, 3 key features, stack, role, live URL (check repo `homepage`, README, `netlify.toml`/Vercel), and a "challenge → solution" sentence. Don't invent metrics; if none exist, use honest signals (commit count, test coverage, CI, Lighthouse score you measure yourself on the live URL).

### 2.2 LinkedIn (manual — LinkedIn blocks scraping)
Do **not** try to scrape LinkedIn. The owner's LinkedIn PDF export is at **`docs/cv.pdf`**. Use it as the only LinkedIn source. Extract: headline, About, experience (role, company, dates, 2–3 bullets each), education, certifications, languages, location.

### 2.3 Normalise
Write typed content files (`/content/profile.ts`, `projects.ts`, `skills.ts`, `experience.ts`) — every prototype reads only from these. Copy tone: confident, concise, first person, no buzzword soup, occasional dry wit. Max ~25 words per project description on cards.

### 2.4 Project screenshots
Each project card needs **3 mobile screenshots**. For projects with a live URL, capture them with Playwright at **390×844 @2x** (home, a key feature screen, a detail/checkout/dashboard screen). Save as AVIF + WebP in `/public/projects/{slug}/m1..m3`. If no live URL, run the repo locally if feasible; otherwise create a neutral placeholder phone frame labelled "screenshot pending" and log it in `CONTENT_GAPS.md`.

---

## 3. Design direction (shared by all prototypes)

**Brief:** a modern, creative-developer aesthetic. Dark theme, bold typography, subtle gradients, IDE-inspired details. Minimal layouts + interactive project cards + smooth GSAP animation + refined micro-interactions. Feels like a premium Creative Developer / Software Engineer portfolio: technical, distinctive, elegant, professional. Clean UI, usability and performance beat effects.

### 3.1 Shared design tokens (prototypes override accents only)
```
--bg-0: #07080A        /* page */
--bg-1: #0D0F12        /* surfaces / cards */
--bg-2: #14171C        /* raised */
--line: rgba(255,255,255,0.08)   /* 1px borders */
--line-strong: rgba(255,255,255,0.16)
--text-0: #EDEEF0      /* primary */
--text-1: #A3A8B0      /* secondary */
--text-2: #6B717A      /* muted, labels */
--radius-sm: 8px  --radius-md: 14px  --radius-lg: 22px
--ease-out: cubic-bezier(.22,1,.36,1)
spacing scale: 4 8 12 16 24 32 48 64 96 128 160
```
- **Typography:** one display/sans + one mono. Suggested pairs (pick per prototype): *Geist + Geist Mono*, *Space Grotesk + JetBrains Mono*, *Instrument Serif (accents only) + Inter Tight + IBM Plex Mono*. Display headings 64–120px, tight tracking (-0.03em). Mono for labels, indices, code-like metadata (`PROJECT_01`, `~/parisa/work`), uppercase with +0.12em tracking at 11–12px.
- **Gradients:** only subtle — a radial glow behind the hero, gradient on 1–2 heading words, card border glow on hover. Never full-screen rainbow.
- **Grid:** 12-col, max-width 1240px, 24px gutters; generous vertical rhythm (section padding 128–160px desktop, 80px mobile).

### 3.2 IDE-inspired motifs (use sparingly, max 1–2 per section)
- Section headers as file tabs / breadcrumbs: `01 — about.tsx`, `~/parisa/projects`
- Line numbers in a faint gutter beside the About text
- Status bar-style footer (branch `main`, local time Tehran, "● available for freelance")
- `⌘K` command palette for navigation (sections, copy email, open GitHub/LinkedIn, switch theme)
- Blinking caret in the hero tagline; syntax-colored tokens in one code snippet

---

## 4. Global systems

### 4.1 Background + cursor (ref: yashwanth-patam-portfolio.vercel.app)
- Near-black background (#0A0A0A range) with a **faint grid or dot matrix** (1px lines at ~4% opacity, 32–48px cells) that is masked to fade at the edges.
- A soft **spotlight follows the mouse**: a large radial gradient (~500px, accent at 8–12% opacity) that reveals/brightens the grid under the cursor. Position lerped (smoothing ~0.12) so it trails gently.
- **Custom cursor:** small dot (6px) + lagging ring (32px). Ring grows and shows a label ("view", "open", "drag") over interactive elements; turns into a text caret over paragraphs. Use `mix-blend-mode: difference` only if contrast stays readable.
- Disable custom cursor + spotlight on touch devices and when `prefers-reduced-motion`.
- Implement with one `requestAnimationFrame` loop and CSS variables (`--mx`, `--my`), not React state per frame.

### 4.2 Scroll progress navbar (ref: aashishjaini.me)
- At top of page: transparent nav. After ~80px scroll, a **floating pill navbar** slides down (blurred glass: `backdrop-filter: blur(14px)`, `--bg-1` at 70%, 1px `--line` border).
- A **progress bar** along the top edge (or along the bottom edge of the pill) fills from 0 → 100% with page scroll, accent gradient, 2px tall. Use GSAP ScrollTrigger `scrub` or a `scaleX` transform on scroll — never `width`.
- Active section highlighted in the nav (IntersectionObserver). Nav items: Work · Skills · About · Experience · Contact · `⌘K`.

### 4.3 Diagonal marquee bands (ref: parthh.in)
- Two crossing bands that span the full viewport width, rotated ≈ **-4° and +3°**, placed between Hero→Projects and Skills→About.
- Band 1: solid accent background, dark bold uppercase text. Band 2: `--bg-2` with outlined/light text. They overlap in an X.
- Content: value words separated by ✦ — `RESPONSIVE ✦ ACCESSIBLE ✦ PIXEL-PERFECT ✦ FAST ✦ SEO-READY ✦ TYPE-SAFE ✦ TESTED ✦ CLIENT-FOCUSED ✦`.
- Opposite directions, infinite loop (duplicate content, GSAP `xPercent` tween), speed reacts to scroll velocity (slightly faster when scrolling, reverses direction with scroll direction). Pause on hover.

### 4.4 Motion rules (GSAP + ScrollTrigger + Lenis for smooth scroll)
- Section reveals: headings split by line/word (SplitText or custom), `y: 100% → 0`, stagger 0.04, 0.8s `--ease-out`. Once per element.
- Durations 200–400ms for micro-interactions, 600–900ms for reveals. Nothing loops except marquees, caret, and status dot.
- Everything respects `prefers-reduced-motion` (fall back to simple opacity fades, no Lenis).

---

## 5. Sections (order + spec)

### 5.1 Hero — interactive keyboard (ref: aayushbharti.in + keyboard reference image)
**Layout:** desktop: left 6 cols text, right 6 cols keyboard. **Mobile: keyboard first, spanning the full viewport width (edge to edge, no side padding). The eyebrow, H1, sub, CTAs and links all go below it.** Reserve the keyboard's height with `aspect-ratio` so hydration causes no layout shift.
- Mono eyebrow: `● Available for freelance · Tehran, Iran (UTC+3:30)` with a pulsing green dot.
- H1 (2–3 lines): `Parisa Adli` + role line *"Frontend developer crafting fast, polished React & Next.js products."* — gradient on one word.
- Short sub (≤ 2 lines), two CTAs: **View work** (primary) · **Get in touch** (ghost), plus GitHub/LinkedIn icon links.
- Tiny hint under the keyboard in mono: `try typing ⌨`.

**Keyboard:** a **full-sized mechanical keyboard**: every row and key, never trimmed on any screen size. It is modelled on the owner's reference photos **`docs/keyboard (1).webp`** and **`docs/keyboard (2).webp`** (ignore the `.jpeg`/`.png` files). Match their look: a translucent purple acrylic case, indigo keycaps, a coral spacebar, multicolour RGB light between the keys, and a few art keycaps (these slots hold the tech-stack icon keys).
- Build options (choose per prototype, see §6): (a) CSS 3D — each key a `<button>` with top face + side faces, perspective ~1200px, tilted `rotateX(28deg) rotateZ(-6deg)`; or (b) React Three Fiber with a lightweight GLB (< 400 KB, Draco) and baked lighting.
- **Interactions:**
  - Physical typing: listening to `keydown/keyup` presses the matching virtual key (translateY 3–4px, shadow shrink, 60ms).
  - Click/tap on keys presses them too.
  - Short **mechanical click sound** per key (Web Audio, 2–3 sampled variants with random pitch ±3%, preloaded, muted by default with a 🔊 toggle; unmute after first user interaction).
  - Accent keys (e.g. `Esc`, `Enter`, `Space`) are **tech-stack keycaps**: icons for React, Next.js, TypeScript, Tailwind, Node, GraphQL. Hovering/pressing one shows a small tooltip (`React — 3 yrs`, etc.).
  - Typing a secret word (`hire`, `next`, `react`) triggers an easter egg: keys light up in a wave and a toast appears ("Let's build something → contact").
  - Subtle idle animation: keyboard floats ±6px, cursor-based parallax tilt (max 6°).
- Performance: keyboard must not block LCP — render H1 first, lazy-hydrate keyboard; LCP element is the H1.

### 5.2 Projects (ref: yogprajapati.site cards + parthh.in mobile showcase)
- Section header: `02 — ~/parisa/projects` + title *"Selected work"* + "All repos ↗" link to GitHub.
- **Card layout:** featured cards full-width (1 per row, alternating text left/right) for top 3 projects; remaining as a 2-col grid of compact cards.
- **Card anatomy (top → bottom):**
  1. Mono label `PROJECT_01` + category chip (`E-COMMERCE`, `FULL-STACK`, `SaaS`) + status chip (`● live` / `in progress`)
  2. Title (32–40px) + one-line tagline
  3. **Visual: three phone mockups side by side** (thin bezels, 38px corner radius, slight overlap, center phone raised 24px and 4% larger). Screens = the 3 mobile screenshots from §2.4.
  4. Description (≤ 25 words), 3 key features as `→` bullets
  5. Tech chips (mono, 1px border, 11px)
  6. Buttons: **Live demo ↗** · **Source ⌥** (hide if missing, never `#` links)
- **Card style:** `--bg-1`, 1px `--line` border, `--radius-lg`, inner padding 32px, subtle noise texture at 3%.
- **Hover:**
  - Border brightens with an animated **conic/radial gradient border glow that follows the cursor** inside the card.
  - Card lifts 4px; tilt ≤ 3° toward cursor.
  - Phones **fan out** (side phones rotate ±6° and translate outward 16px; center phone rises 8px) with 400ms ease-out; screenshots inside scroll slowly upward to reveal the full page (`object-position` tween).
  - Cursor ring shows `view`.
- Click → case study page `/work/[slug]` (challenge, approach, stack, screenshots, outcome) — basic template is enough for prototypes.

### 5.3 Skills (ref: thvvamshi-dev.onrender.com + parthh.in)
- Header: `03 — skills.json` + title *"The stack behind the work"*.
- Layout combining both references:
  - **Left (4 cols):** a code-editor panel showing `skills.json` with syntax highlighting, line numbers, filter tabs above it: `All · Frontend · Backend · Tooling`. Selecting a tab rewrites the JSON with a typing animation.
  - **Right (8 cols):** a grid of **icon tiles** (64–80px squares, `--bg-1`, 1px border, monochrome icons that turn to brand color on hover, name label in mono below). Tiles not matching the active filter dim to 25% and scale 0.96.
  - A slowly rotating decorative 3D/metallic object or orbit ring behind the grid (parthh.in "rotating cover"), very low contrast, paused off-screen.
- Skills (from GitHub, confirm with LinkedIn): **Frontend** HTML, CSS3, JavaScript, TypeScript, React, Next.js, Tailwind CSS, (Redux/React Query/Framer Motion if present in repos) · **Backend** Node.js, MongoDB, GraphQL, REST APIs · **Tooling** Git, GitHub Actions, Playwright, Postman, Vercel, Netlify, ESLint/Prettier, Figma (if true), Claude Code / AI-assisted dev.
- Below: a slim auto-scrolling logo strip of the same icons (single row, mask-faded edges).

### 5.4 About (ref: portfolio-84ka terminal card)
- Left: short bio (3–4 sentences from LinkedIn About), with faint line-number gutter.
- Right: **terminal card** with window dots, prompt lines typed in on scroll:
  ```
  parisa@dev ~ $ whoami
  Frontend developer · React / Next.js · freelance
  parisa@dev ~ $ cat now.txt
  {{currently building / learning — from LinkedIn}}
  parisa@dev ~ $ _
  ```
- Stat counters (count-up on enter): public repos, years of experience, projects shipped — only real numbers.

### 5.5 Experience (ref: phyominthein / stackbyprakhar "mission log", toned down)
- Vertical timeline styled as a git log: each entry = commit dot + hash-like mono id (`a3f9c1`), role, company, dates, 2–3 bullets. Line draws itself on scroll (ScrollTrigger scrub on `scaleY`).
- Include education + certifications as smaller entries.

### 5.6 GitHub activity (optional, ref: stackbyprakhar)
- Contribution heatmap (fetched at build time, ISR daily) + language bar from repo stats. Keep it one compact row.

### 5.7 Contact
- Huge headline: *"Got an idea worth building?"* with an animated underline.
- Click-to-copy email button (toast "copied ✓"), LinkedIn, GitHub, optional Cal link.
- Simple form (name, email, message) styled as a terminal "transmission" — server action or Formspree. Validation messages inline.

### 5.8 Footer = IDE status bar
`⎇ main · ● available · Tehran 23:11 · built with Next.js + GSAP · © 2026 Parisa Adli` + back-to-top.

---

## 6. The three prototypes

All three share §2 content, §4 systems and §5 section order. They differ in:

| | **A — "Editor"** | **B — "Mechanical"** | **C — "Editorial"** |
|---|---|---|---|
| Idea | Whole site feels like a refined code editor | Tactile, hardware-inspired; the keyboard is the star | Minimal, typographic, gallery-like |
| Accent | Electric violet `#8B5CF6` → cyan `#22D3EE` | Warm amber `#F59E0B` + off-white keycaps | Lime `#C6F432` on pure black |
| Fonts | Geist + Geist Mono | Space Grotesk + JetBrains Mono | Instrument Serif (italic accents) + Inter Tight + IBM Plex Mono |
| Background | Dot matrix + violet spotlight | Fine grid + warm spotlight + subtle noise | Almost flat black, very faint grid, white spotlight |
| Keyboard | CSS 3D, dark case, violet-lit accent keys | React Three Fiber GLB, closest match to reference photo, RGB underglow | CSS 3D, isometric line-art style (outlined keys, lime on press) |
| IDE motifs | Strong (tabs, gutter, ⌘K, status bar) | Medium (terminal About, status bar) | Light (mono labels + ⌘K only) |
| Project cards | Glass card + gradient border glow | Solid card with "keycap" bevel edges | Borderless large cards, big index numbers `01` |
| Marquee bands | Violet / dark | Amber / dark, caution-tape feel | Lime / black |

Put a dev-only switcher bottom-left: `A · B · C` that keeps scroll position.

---

## 7. Tech stack

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4** (tokens as CSS variables)
- **GSAP 3** (ScrollTrigger, SplitText — free since 2025) + **Lenis** smooth scroll
- **React Three Fiber + drei** only for prototype B's keyboard (dynamic import, `ssr:false`)
- **Playwright** for screenshots of projects and for visual checks
- `next/image` with AVIF/WebP, `next/font` self-hosted fonts
- Content: typed TS files in `/content`; GitHub data fetched at build time
- Deploy target: Vercel

Folder sketch:
```
/app/(a|b|c)/page.tsx   /app/work/[slug]/page.tsx
/components/core/        (ScrollProgress, Cursor, Spotlight, Marquee, CommandMenu, PhoneMockup, Keyboard/*)
/themes/{a,b,c}/         (tokens.css, overrides)
/content/                (profile.ts, projects.ts, skills.ts, experience.ts, raw/)
/public/projects/{slug}/ /public/sounds/ /references/
/scripts/fetch-github.ts /scripts/screenshot-projects.ts
```

---

## 8. Do / Do not

**Do**
- Keep one clear focal point per section; lots of negative space.
- Use real content and real links only.
- Make every hover state also reachable by keyboard focus (`:focus-visible` ring in accent).
- Keep touch targets ≥ 44px; mobile layout designed, not just stacked.

**Do not**
- No generic template look (centered avatar + "Hi, I'm…" + 3 identical cards).
- No particle storms, no autoplaying sound, no scroll-jacking beyond Lenis smoothing, no more than one 3D object in view at a time.
- No neon-everywhere gradients, glassmorphism on every element, or emoji decoration.
- No placeholder `#` links, no fake testimonials, no invented metrics.
- No layout shift from fonts or images.

---

## 9. Quality bar / acceptance checks (run before calling a prototype done)

- Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- LCP < 2.0s, CLS < 0.05, INP < 200ms; total JS for first load < 200 KB gzipped (excluding lazy 3D chunk).
- WCAG AA contrast for all text; full keyboard navigation; reduced-motion mode verified.
- Tested at 390, 768, 1280, 1440, 1920 widths; Safari + Chrome.
- Meta: title, description, OG image (generated per prototype), favicon, `sitemap.xml`, `robots.txt`, JSON-LD `Person`.
- Produce `CONTENT_GAPS.md` (missing facts/screenshots) and `PROTOTYPES.md` (screenshots of each prototype's hero, projects, skills at desktop + mobile, and a 3-line rationale for each).

---

## 10. Reference sites (study before building)

| Element | Reference |
|---|---|
| Hero + interactive keyboard idea | https://aayushbharti.in/ (see its *Keythm* project: every key has its own sound) |
| Keyboard shape | owner's reference photos → `docs/keyboard (1).webp`, `docs/keyboard (2).webp` |
| Scroll progress navbar | https://www.aashishjaini.me/ |
| Background grid + mouse spotlight/cursor | https://yashwanth-patam-portfolio.vercel.app/ |
| Project cards + hover | https://www.yogprajapati.site/ |
| Skills section | https://thvvamshi-dev.onrender.com/ and https://parthh.in/ |
| Crossing marquee bands, mobile-screen project showcase | https://parthh.in/ |
| Terminal About card, numbered sections, stat counters | https://portfolio-84ka.vercel.app/ |
| Extra inspiration (HUD labels, GitHub heatmap, timeline) | https://stackbyprakhar.vercel.app/ , https://www.phyominthein.com/ |

Open each with Playwright, screenshot desktop + mobile, and note the exact behaviour (timings, easing, spacing) before re-creating it. **Take the interaction ideas, not the code or assets** — the result must be original.
