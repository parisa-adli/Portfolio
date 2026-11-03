import { existsSync } from "node:fs";
import path from "node:path";

export const SHOTS = ["m1", "m2", "m3"] as const;

const EXTS = ["webp", "avif", "png", "jpg", "jpeg"];

// Server-only (node:fs): resolved at build time, so dropping a file into /public/projects/{slug}/ is enough.
export function screenshotSrc(slug: string, shot: (typeof SHOTS)[number]): string | undefined {
  for (const ext of EXTS) {
    const rel = `/projects/${slug}/${shot}.${ext}`;
    if (existsSync(path.join(process.cwd(), "public", rel))) return rel;
  }
}
