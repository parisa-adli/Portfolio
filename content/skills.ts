// Source: docs/cv.pdf skills list, cross-checked against repo dependencies (content/raw/github.json).
// Skills claimed on the GitHub README but not found in any repo or the CV are left out (see CONTENT_GAPS.md).

export type SkillGroup = "Frontend" | "Backend" | "Tooling";
export type Skill = { name: string; group: SkillGroup; years?: string };

export const skills: Skill[] = [
  // Frontend
  { name: "HTML", group: "Frontend" },
  { name: "CSS3", group: "Frontend" },
  { name: "JavaScript", group: "Frontend" },
  { name: "TypeScript", group: "Frontend" },
  { name: "React", group: "Frontend" },
  { name: "Next.js", group: "Frontend" },
  { name: "Tailwind CSS", group: "Frontend" },
  { name: "shadcn/ui", group: "Frontend" },
  { name: "TanStack Query", group: "Frontend" },
  { name: "Redux Toolkit", group: "Frontend" }, // React-noteApp-RTK
  { name: "React Hook Form", group: "Frontend" },
  { name: "Zod", group: "Frontend" },
  // Backend
  { name: "Node.js", group: "Backend" },
  { name: "Express", group: "Backend" },
  { name: "REST APIs", group: "Backend" },
  { name: "MongoDB", group: "Backend" },
  { name: "Mongoose", group: "Backend" },
  { name: "JWT auth & RBAC", group: "Backend" },
  // Tooling
  { name: "Git", group: "Tooling" },
  { name: "GitHub Actions", group: "Tooling" }, // -inventory-app-ai, WorkBridge
  { name: "Vitest", group: "Tooling" },
  { name: "Playwright", group: "Tooling" },
  { name: "Postman", group: "Tooling" },
  { name: "Figma", group: "Tooling" },
  { name: "ESLint / Prettier", group: "Tooling" },
  { name: "Claude Code", group: "Tooling" }, // CLAUDE.md in -inventory-app-ai, NEXAIVON, WorkBridge
];

// Hero tech-stack keycaps (DESIGN.md §5.1). Tooltip years are TODO until the owner confirms.
export const keycapStack = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB"] as const;
