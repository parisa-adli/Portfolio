"use client";
import { toast } from "./Toast";

// Click-to-copy email (§5.7). Falls back to opening the mail app if the clipboard is unavailable.
export function CopyEmail({ email, className = "" }: { email: string; className?: string }) {
  return (
    <button
      type="button"
      className={`copy-email ${className}`}
      data-cursor="copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          toast("copied ✓");
        } catch {
          location.href = `mailto:${email}`;
        }
      }}
    >
      <span className="copy-email__addr">{email}</span>
      <span className="label copy-email__hint">copy</span>
    </button>
  );
}
