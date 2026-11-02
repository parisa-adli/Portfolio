"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { NAV_ITEMS } from "./Nav";
import { toast } from "./Toast";
import { scroller, scrollToTarget } from "@/lib/motion";

type Item = { id: string; label: string; hint: string; run: () => void };

// ⌘K / Ctrl+K command palette. Non-modal <dialog> + overlay on purpose: showModal() makes the whole page
// inert, which forced a full-document style recalc (~270ms at 4x CPU) and blew the INP budget. So focus
// trap, Esc and scroll lock are done here; the input is the only tab stop (options use activedescendant).
export function CommandMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const items = useMemo<Item[]>(() => {
    const close = () => dialog.current?.close();
    const list: Item[] = [
      ...NAV_ITEMS.map((n) => ({ id: n.id, label: `Go to ${n.label}`, hint: "section", run: () => (close(), scrollToTarget(`#${n.id}`)) })),
      {
        id: "copy",
        label: "Copy email",
        hint: profile.email,
        run: () => {
          close();
          navigator.clipboard.writeText(profile.email).then(() => toast("copied ✓"), () => (location.href = `mailto:${profile.email}`));
        },
      },
      ...profile.links.map((l) => ({ id: l.label, label: `Open ${l.label}`, hint: "↗", run: () => (close(), window.open(l.href, "_blank", "noopener")) })),
    ];
    if (process.env.NODE_ENV === "development")
      list.push({ id: "proto-a", label: "Switch prototype: A (current)", hint: "dev", run: close });
    return list;
  }, []);

  const shown = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const d = dialog.current!;
    let opener: HTMLElement | null = null;
    const open = () => {
      setQ("");
      setActive(0);
      opener = document.activeElement as HTMLElement | null;
      d.show();
      input.current?.focus();
      scroller.lenis?.stop();
    };
    const onClose = () => {
      scroller.lenis?.start();
      opener?.focus?.({ preventScroll: true });
    };
    d.addEventListener("close", onClose);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (d.open) d.close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("command-menu:open", open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("command-menu:open", open);
      d.removeEventListener("close", onClose);
    };
  }, []);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") (e.preventDefault(), setActive((a) => Math.min(a + 1, shown.length - 1)));
    else if (e.key === "ArrowUp") (e.preventDefault(), setActive((a) => Math.max(a - 1, 0)));
    else if (e.key === "Enter") shown[active]?.run();
    else if (e.key === "Escape") (e.preventDefault(), dialog.current?.close());
    else if (e.key === "Tab") e.preventDefault(); // focus stays in the palette
  };

  return (
    <>
    <dialog ref={dialog} className="cmdk" aria-label="Command menu" aria-modal="true">
      <div className="cmdk__inner">
        <div className="cmdk__search">
          <span className="label" aria-hidden="true">
            &gt;
          </span>
          <input
            ref={input}
            value={q}
            onChange={(e) => (setQ(e.target.value), setActive(0))}
            onKeyDown={onInputKey}
            placeholder="Type a command or section…"
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-activedescendant={shown[active] ? `cmdk-${shown[active].id}` : undefined}
            className="cmdk__input"
          />
          <kbd className="cmdk__esc">esc</kbd>
        </div>
        <ul id="cmdk-list" role="listbox" className="cmdk__list">
          {shown.map((it, i) => (
            <li
              key={it.id}
              id={`cmdk-${it.id}`}
              role="option"
              aria-selected={i === active}
              className="cmdk__item"
              onPointerMove={() => setActive(i)}
              onClick={it.run}
            >
              <span>{it.label}</span>
              <span className="cmdk__hint">{it.hint}</span>
            </li>
          ))}
          {!shown.length && <li className="cmdk__empty">No matches.</li>}
        </ul>
      </div>
    </dialog>
    <div className="cmdk-overlay" aria-hidden="true" onClick={() => dialog.current?.close()} />
    </>
  );
}
