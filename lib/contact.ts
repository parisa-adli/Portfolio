import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell me your name.").max(100, "That name is a bit long."),
  email: z.email("That email doesn't look right.").max(200),
  message: z.string().trim().min(10, "A little more detail, please (10+ characters).").max(4000, "Keep it under 4000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof ContactInput, string[]>>;
  values?: Partial<ContactInput>;
};

export function validateContact(data: Record<string, unknown>) {
  const r = contactSchema.safeParse(data);
  return r.success ? { data: r.data } : { fieldErrors: z.flattenError(r.error).fieldErrors };
}

// shortcut: in-memory per-instance limit (3 per 10 min per IP); move to Upstash/Vercel KV if spam gets through.
const WINDOW = 10 * 60 * 1000;
const LIMIT = 3;
const hits = new Map<string, number[]>();

export function allow(ip: string, now = Date.now()) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}
