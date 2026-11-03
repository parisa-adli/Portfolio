"use client";
import { useEffect, useState } from "react";
import { setSound } from "./sound";

// Sound toggle + lazy attach of the keyboard controller once the browser is idle (keeps it off the LCP path).
export function KeyboardIsland() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    // Only the CSS keyboard (A, C) uses the DOM controller; B's WebGL keyboard drives itself.
    const kb = document.querySelector<HTMLElement>(".kb");
    const start = () =>
      kb &&
      import("./controller").then(({ initKeyboard }) => {
        if (!cancelled) cleanup = initKeyboard(kb);
      });
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    const id = idle(start);
    return () => {
      cancelled = true;
      (window.cancelIdleCallback ?? clearTimeout)(id as number);
      cleanup?.();
    };
  }, []);

  return (
    <button
      type="button"
      className="sound-toggle"
      aria-pressed={on}
      onClick={() => {
        setSound(!on);
        setOn(!on);
      }}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9h4l5-4v14l-5-4H4z" />
        {on ? <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /> : <path d="M17 9l5 6M22 9l-5 6" />}
      </svg>
      <span className="label">{on ? "sound on" : "sound off"}</span>
    </button>
  );
}
