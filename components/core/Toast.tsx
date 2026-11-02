"use client";
import { useEffect, useRef, useState } from "react";

type ToastMsg = { id: number; text: string; href?: string; linkText?: string };

/** Fire a toast from anywhere (keyboard easter egg, copy email, …). */
export function toast(text: string, link?: { href: string; text: string }) {
  window.dispatchEvent(new CustomEvent("toast", { detail: { text, href: link?.href, linkText: link?.text } }));
}

// One polite live region, bottom-centre. Each toast stays 3.2s.
export function Toaster() {
  const [msg, setMsg] = useState<ToastMsg | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent).detail;
      setMsg({ id: Date.now(), ...d });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMsg(null), 3200);
    };
    window.addEventListener("toast", on);
    return () => window.removeEventListener("toast", on);
  }, []);

  return (
    <div className="toaster" role="status" aria-live="polite">
      {msg && (
        <div key={msg.id} className="toast">
          <span>{msg.text}</span>
          {msg.href && (
            <a href={msg.href} className="toast__link">
              {msg.linkText}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
