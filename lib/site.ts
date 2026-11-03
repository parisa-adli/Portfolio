// Production origin. Set NEXT_PUBLIC_SITE_URL in Vercel (see CONTENT_GAPS.md).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

// The three design prototypes (docs/DESIGN.md §6). Each lives under its own prefix: /a, /b, /c (+ /x/work/[slug]).
export const PROTOS = ["a", "b", "c"] as const;
export type Proto = (typeof PROTOS)[number];
