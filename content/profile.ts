// Sources: docs/cv.pdf (owner's LinkedIn/CV export) + content/raw/github.json (fetched 2026-11-03).
// Anything not found in either is a {{TODO}} and is listed in CONTENT_GAPS.md.

export type Link = { label: string; href: string };

export type Profile = {
  name: string;
  headline: string;
  stackLine: string;
  positioning: string;
  about: string;
  location: string;
  timezone: string;
  available: boolean;
  email: string;
  links: Link[];
  education: { degree: string; field: string; school: string; year: number }[];
  certifications: string[];
  languages: string[];
  stats: { publicRepos: number; yearsExperience: string; projectsShipped: string };
  now: string;
};

export const profile: Profile = {
  name: "Parisa Adli",
  // Owner confirmed Full-Stack (2026-11-03).
  headline: "Full-Stack Developer",
  stackLine: "React · Next.js · TypeScript · Node.js · Express",
  positioning: "Frontend developer crafting fast, polished React & Next.js products.",
  about:
    "Full-stack developer specializing in modern React and Next.js front ends backed by Node.js/Express REST APIs and MongoDB. " +
    "I build complete products end-to-end — from role-based dashboards and e-commerce storefronts to authentication systems with OTP, JWT refresh rotation, and Telegram sign-in. " +
    "Strong focus on type-safe code (TypeScript, Zod), clean feature-based architecture, automated testing (Vitest, Supertest, Playwright), and polished, responsive UIs with Tailwind CSS.",
  location: "{{TODO: confirm location — DESIGN.md says Tehran, Iran; not in CV}}",
  timezone: "Asia/Tehran", // shortcut: assumed from DESIGN.md, drives the footer clock; confirm with location
  available: true, // DESIGN.md: "available for freelance" — confirm
  email: "parisa.adli.dev@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/parisa-adli" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/parisa-adli" },
    // Instagram (https://instagram.com/parisa__ad) left out until the owner confirms (DESIGN.md §1).
  ],
  education: [
    {
      degree: "Bachelor's Degree",
      field: "Software Engineering",
      school: "Iran's National University of Skill",
      year: 2019,
    },
  ],
  certifications: [], // none in CV
  languages: [], // {{TODO: spoken languages — not in CV}}
  stats: {
    publicRepos: 27, // GitHub API, 2026-11-03 (includes this Portfolio repo and an empty "test" repo)
    yearsExperience: "{{TODO: years of experience}}",
    projectsShipped: "{{TODO: projects shipped — no live deployments found}}",
  },
  now: "{{TODO: currently building / learning}}",
};
