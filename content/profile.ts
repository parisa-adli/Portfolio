// Sources: docs/cv.pdf (owner's LinkedIn/CV export) + content/raw/github.json (fetched 2026-11-03),
// plus owner decisions from the 2026-11-03 review. Location, availability, languages, certifications,
// stats and a now.txt line are deliberately absent (owner decision; see DESIGN.md §5).

import { projects } from "./projects";

export type Link = { label: string; href: string };
/** One terminal command; each `out` entry is an output line, links render inline as a row. A tab splits a line into aligned columns. */
export type TerminalEntry = { cmd: string; out: (string | { text: string; href: string })[] };

export type Profile = {
  name: string;
  headline: string;
  stackLine: string;
  positioning: string;
  sub: string;
  about: string;
  email: string;
  links: Link[];
  education: { degree: string; field: string; school: string; year: number }[];
  terminal: TerminalEntry[];
  /** Shown as `$ cat status.txt` when set. Unset = availability stays off the site (owner decision 2026-11-03). */
  status?: string;
  /** Path under /public. If the field or the file is missing, About renders no photo. */
  photo?: { src: string; alt: string };
};

export const profile: Profile = {
  name: "Parisa Adli",
  // Owner confirmed Full-Stack (2026-11-03).
  headline: "Full-Stack Developer",
  stackLine: "React · Next.js · TypeScript · Node.js · Express",
  positioning: "Full-stack developer building polished, tested products — React and Next.js up front, Node behind it.",
  sub: "Auth, dashboards, payments, the hard parts done properly.",
  about:
    "I build web products end to end — React and Next.js on the front, Node, Express, and MongoDB behind it.\n\n" +
    "I focus on the parts that need careful engineering: OTP authentication, token rotation, role-based dashboards, and inventory systems that prevent negative stock.\n\n" +
    "I value type-safe code, tests that run in CI, and interfaces that feel finished.\n\n" +
    "Proof is in the repos, not the adjectives.",
  email: "parisa.adli.dev@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/parisa-adli" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/parisa-adli" },
    { label: "Instagram", href: "https://www.instagram.com/parisa.adli.dev" },
  ],
  education: [
    {
      degree: "Bachelor's Degree",
      field: "Software Engineering",
      school: "Iran's National University of Skill",
      year: 2019, // graduation year (owner confirmed single year)
    },
  ],
  // Owner decision 2026-11-03: data-driven About terminal.
  terminal: [
    { cmd: "whoami", out: ["Full-stack developer"] },
    {
      cmd: "cat stack.txt",
      out: ["front	React · Next.js · TypeScript", "back	Node · Express · MongoDB", "tests	Vitest · Playwright · GitHub Actions"],
    },
    { cmd: "cat focus.txt", out: ["auth & RBAC, payments, inventory that holds under load"] },
  ],
  photo: { src: "/parisa.jpg", alt: "Portrait of Parisa Adli" },
};
