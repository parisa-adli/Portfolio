import { projects } from "../content/projects.ts";

// Stack entries that count as a given keycap tech. Express apps run on Node, so they count as Node.js.
const ALIASES: Record<string, string[]> = { "Node.js": ["Node.js", "Express"] };

/** "React 19" matches React; "React Query" does not. */
const matches = (entry: string, name: string) => entry === name || (entry.startsWith(name + " ") && /^\d/.test(entry.slice(name.length + 1)));

export function projectCount(tech: string) {
  const names = ALIASES[tech] ?? [tech];
  return projects.filter((p) => p.stack.some((s) => names.some((n) => matches(s, n)))).length;
}

export const techTip = (tech: string) => {
  const n = projectCount(tech);
  return `${tech} — ${n} project${n === 1 ? "" : "s"}`;
};
