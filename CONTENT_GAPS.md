# Content gaps

What is still open after the owner review on 2026-11-03. Resolved decisions are recorded in `docs/DESIGN.md` and `/content`.

## Owner to-dos before launch

- [ ] **Deploy the 3 featured projects** (Inventory Manager, NEXAIVON, WorkBridge) as seeded demos, e.g. Vercel + MongoDB Atlas. Then send the URLs: they set `liveUrl`, the "● live" chip and the "Live demo ↗" button.
- [ ] **Rename `-inventory-app-ai` → `inventory-manager` on GitHub.** `projects.ts` already uses the new name. Tell Claude if you choose a different one.
- [ ] **Fix the WorkBridge entry on the CV/LinkedIn:** it repeats the NEXAIVON bullets. The site follows the repo README.
- [ ] Optional: unpin `React-rick-and-morty-app` and remove the GraphQL badge from the GitHub profile README, so the profile matches the site.

## Before launch (Claude)

- [ ] **Project screenshots:** 0 of 15. The cards show placeholder "screenshot pending" frames. Capture all of them at 390×844 @2x before launch: the featured ones from the live demos, Stays and Blog App locally.
- [ ] **Commit counts** (`signals.commits`) are from 2026-11-03. Re-run `node scripts/fetch-github.mjs` before launch.
- [ ] **Lighthouse scores** for the Proof block need the live demo URLs.
- [ ] Set `RESEND_API_KEY` in Vercel. Until then, the contact form only logs messages, yet it still tells the visitor "sent ✓".
- [ ] Set `RESEND_FROM` to an address on a domain verified in Resend. The fallback, `onboarding@resend.dev`, only delivers to the Resend account owner.
- [ ] Set `NEXT_PUBLIC_SITE_URL` (the production origin) in Vercel. Without it, canonical URLs, the OG image, `sitemap.xml`, `robots.txt` and the JSON-LD all point to `http://localhost:3000`.
- [ ] **Real Safari / iOS check.** Only Playwright's Windows WebKit has been tested. Confirm the Geist heading weight (Windows WebKit draws it too thin), the keyboard and Lenis on a real iPhone and a Mac.
