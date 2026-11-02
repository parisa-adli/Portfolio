"use server";
import { headers } from "next/headers";
import { Resend } from "resend";
import { allow, validateContact, type ContactState } from "@/lib/contact";
import { profile } from "@/content/profile";

// §5.7: Zod validation → honeypot → per-IP rate limit → Resend. Without RESEND_API_KEY it only logs.
export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const values = {
    name: String(form.get("name") ?? ""),
    email: String(form.get("email") ?? ""),
    message: String(form.get("message") ?? ""),
  };
  if (form.get("website")) return { ok: true }; // honeypot filled: pretend success, send nothing

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!allow(ip)) return { ok: false, error: "Too many messages. Try again in a few minutes.", values };

  const v = validateContact(values);
  if (!v.data) return { ok: false, fieldErrors: v.fieldErrors, values };

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log("[contact] RESEND_API_KEY not set; message not sent:", v.data);
    return { ok: true };
  }
  const { error } = await new Resend(key).emails.send({
    from: process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>",
    to: profile.email,
    replyTo: v.data.email,
    subject: `Portfolio message from ${v.data.name}`,
    text: `${v.data.message}\n\n— ${v.data.name} <${v.data.email}>`,
  });
  if (error) {
    console.error("[contact] resend failed:", error);
    return { ok: false, error: `Couldn't send right now. Email me directly at ${profile.email}.`, values };
  }
  return { ok: true };
}
