// Source: owner decision 2026-11-03. No paid roles: the timeline is a git log of independent projects
// (dated by repo creation month, content/raw/github.json) on one branch, plus education from docs/cv.pdf.
// Newest first.

export type ExperienceEntry = {
  kind: "project" | "branch" | "education";
  title: string;
  date: string; // "YYYY-MM", "YYYY" or a range for the branch entry
  line?: string;
  slug?: string; // links to /work/[slug]
};

export const experience: ExperienceEntry[] = [
  { kind: "project", title: "WorkBridge", date: "2026-10", slug: "workbridge",
    line: "Three roles in one app: role-guarded routes over a per-role Express API." },
  { kind: "project", title: "NEXAIVON", date: "2026-10", slug: "nexaivon",
    line: "Payments and stock that holds under concurrent checkouts." },
  { kind: "project", title: "Inventory Manager", date: "2026-09", slug: "inventory-manager",
    line: "TypeScript monorepo, Telegram sign-in, Playwright E2E in CI." },
  { kind: "project", title: "Blog App", date: "2025-01", slug: "rblog",
    line: "Server-rendered pages for SEO, React Query admin desk." },
  { kind: "project", title: "Stays", date: "2024-11", slug: "stays",
    line: "URL-driven search state, list + map view." },
  { kind: "branch", title: "independent-projects", date: "2024 – present", line: "Independent projects" },
  // School name left off the site (owner decision 2026-11-03).
  { kind: "education", title: "B.Sc. Software Engineering", date: "2019" },
];
