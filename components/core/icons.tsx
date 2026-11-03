import {
  siGithub, siInstagram, siReact, siNextdotjs, siTypescript, siTailwindcss, siNodedotjs, siMongodb,
  siHtml5, siCss, siJavascript, siShadcnui, siReactquery, siRedux, siReacthookform, siZod, siGsap,
  siExpress, siMongoose, siJsonwebtokens, siGit, siVercel, siGithubactions, siVitest, siPostman,
  siFigma, siEslint, siClaude, siTelegram,
} from "simple-icons";

type SI = { path: string; hex: string; title: string };

// simple-icons has no LinkedIn mark; a plain "in" glyph instead.
const linkedin: SI = {
  title: "LinkedIn",
  hex: "0A66C2",
  path: "M4 9h3.6v11H4zM5.8 3.4a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2zM9.6 9h3.4v1.6c.5-.9 1.7-1.9 3.6-1.9 3.7 0 4.4 2.4 4.4 5.5V20h-3.6v-5.1c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20H9.6z",
};

// Skill / tech name (content/skills.ts, keycapStack, profile.links) → icon. Missing = mono glyph tile.
export const ICONS: Record<string, SI> = {
  GitHub: siGithub, Instagram: siInstagram, LinkedIn: linkedin, Telegram: siTelegram,
  React: siReact, "Next.js": siNextdotjs, TypeScript: siTypescript, "Tailwind CSS": siTailwindcss,
  "Node.js": siNodedotjs, MongoDB: siMongodb, HTML: siHtml5, CSS3: siCss, JavaScript: siJavascript,
  "shadcn/ui": siShadcnui, "TanStack Query": siReactquery, "Redux Toolkit": siRedux,
  "React Hook Form": siReacthookform, Zod: siZod, GSAP: siGsap, Express: siExpress, Mongoose: siMongoose,
  "JWT auth & RBAC": siJsonwebtokens, Git: siGit, Vercel: siVercel, "GitHub Actions": siGithubactions,
  Vitest: siVitest, Postman: siPostman, Figma: siFigma, "ESLint / Prettier": siEslint, "Claude Code": siClaude,
};

export function Icon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}
