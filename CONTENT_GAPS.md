# Content gaps

Everything that is missing or unverified after the §2 content pipeline (2026-11-03). Each item is either a `{{TODO}}` in `/content` or a decision for the owner.

## Blocking: owner input needed

- [ ] **Live URLs:** none found for any project. No repo has a `homepage`, a GitHub deployment record, or a deploy link in its README. DESIGN.md claims `Next.js-next-shop-panel` is "deployed on Vercel", but this is unverified. Without live URLs there are no project screenshots and no "Live demo" buttons.
- [ ] **Project screenshots (§2.4):** 0 of 18 captured, because no project has a live URL. The fallback is to run repos locally:
  - Feasible without secrets: `React-Booking-Hotel_App` (JSON Server data) and `React-rick-and-morty-app` (public API).
  - Need MongoDB + env secrets: the other four.
  - Otherwise use "screenshot pending" placeholder frames.
- [ ] **Work experience:** the CV has no experience section. `experience.ts` needs role, company/clients, dates and 2–3 bullets per role.
- [x] **Headline:** owner chose **Full-Stack Developer** (2026-11-03). Still to do: `profile.positioning` and DESIGN.md §1/§5.1/§5.4 still say "Frontend developer…", so they need rewording.
- [ ] **CV error:** the WorkBridge entry in the CV repeats the NEXAIVON bullets (e-commerce, Zarinpal, Next.js 15). WorkBridge is actually a freelancing platform (React + Vite + Express). `projects.ts` follows the repo README; fix the CV/LinkedIn too.

## Profile facts

- [ ] Location: DESIGN.md says Tehran, Iran (UTC+3:30). It's not in the CV. Also drives the footer clock (`timezone`).
- [ ] **Not cleared for public use (2026-11-03):** location and "available for freelance" must stay off the site (hero eyebrow, footer status bar, `profile.available`) until the owner confirms.
- [ ] Availability: "available for freelance" (DESIGN.md) needs confirming.
- [ ] Years of experience (About stat counter + keycap tooltips like "React — 3 yrs"). Earliest public React repo is Oct 2024, but that's no proof of start date.
- [ ] Projects shipped (stat counter): no deployments found, so there's no honest number yet.
- [ ] `now.txt` line for the About terminal: what you're currently building or learning.
- [ ] Spoken languages: not in the CV.
- [ ] Certifications: none in the CV. Confirm there are none.
- [ ] Instagram (`instagram.com/parisa__ad`): excluded until you confirm (DESIGN.md §1).
- [ ] Phone number: it's in the CV but deliberately not used on the site. Confirm you don't want it public.
- [ ] Education year: the CV says only "2019", which is read as the graduation year. Confirm start/end.

## Skills

- [ ] **GraphQL:** on the GitHub README badges, but not in the CV or any repo's dependencies. Left out of `skills.ts`. DESIGN.md wants a GraphQL keycap; `keycapStack` uses MongoDB instead until confirmed.
- [ ] **Vercel / Netlify:** listed in DESIGN.md §5.3, but no deployments found. Left out.
- [ ] **GSAP / Lenis:** in NEXAIVON's dependencies but usage not verified. Left out.
- [ ] Redux / Framer Motion: only a small Redux Toolkit repo (`React-noteApp-RTK`). Redux Toolkit is included; Framer Motion is not found anywhere.

## Projects

- [ ] Project choice: 6 picked. The following were left out and need owner confirmation:
  - `Next.js-next-shop-panel` and `React-freelancer-app`: they look like earlier versions of NEXAIVON and WorkBridge.
  - `React-inventory-app`: overlaps the Inventory Manager.
  - The 6th slot went to `React-rick-and-morty-app` (pinned on GitHub) over those.
- [ ] Challenge → solution sentences missing for **Blog App** and **Rick and Morty Explorer**.
- [ ] Repo name `-inventory-app-ai` starts with a hyphen. Consider renaming it before linking it from the site.
- [ ] Commit counts are from the default branch on 2026-11-03 (DESIGN.md's "80+" and "68+" are out of date). Re-run `node scripts/fetch-github.mjs` before launch.
- [ ] Lighthouse scores (DESIGN.md §2.1 honest signal) need live URLs.

## Keyboard reference

- [ ] The reference photos are a ~75% board. The site keyboard is full-sized per the owner, so rows that aren't in the photos (numpad, nav cluster) have to be designed rather than copied. See `references/keyboard-notes.md`.
