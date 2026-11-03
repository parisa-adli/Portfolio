// Production origin. Set NEXT_PUBLIC_SITE_URL in Vercel (see CONTENT_GAPS.md).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
