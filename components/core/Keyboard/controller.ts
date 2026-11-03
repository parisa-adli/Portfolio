// Keyboard behaviour (§5.1), attached to the server-rendered markup after idle. Plain DOM, no React:
// one delegated pointer listener, one window key listener, transforms only.
import { CODE_ALIAS } from "./layout";
import { click } from "./sound";
import { HEAVY, eggToast, typer } from "./typing";
import { onFrame, richPointer } from "@/lib/pointer";

const MAX_TILT = 6;

export function initKeyboard(kb: HTMLElement) {
  const keyEl = (code: string) => kb.querySelector<HTMLElement>(`.key[data-code="${CODE_ALIAS[code] ?? code}"]`);
  const screen = kb.querySelector<HTMLElement>("[data-kb-screen]")!;
  const tip = kb.querySelector<HTMLElement>("[data-kb-tip]")!;
  const parallax = kb.querySelector<HTMLElement>(".kb__parallax")!;
  const typed = typer();
  let inView = true;
  let waving = false;

  const press = (el: HTMLElement) => {
    if (!el.classList.contains("is-down")) click(HEAVY.has(el.dataset.code!));
    el.classList.add("is-down");
    if (el.dataset.tip) showTip(el);
  };
  const release = (el: HTMLElement | null) => el?.classList.remove("is-down");
  const tap = (el: HTMLElement) => {
    press(el);
    setTimeout(() => release(el), 90);
  };

  function showTip(el: HTMLElement) {
    const k = el.getBoundingClientRect();
    const b = kb.getBoundingClientRect();
    tip.textContent = el.dataset.tip!;
    tip.style.transform = `translate(calc(${k.left - b.left + k.width / 2}px - 50%), calc(${k.top - b.top}px - 100% - 10px))`;
    tip.classList.add("is-on");
  }
  const hideTip = () => tip.classList.remove("is-on");

  function type(ch: string) {
    const { echo, hit } = typed(ch);
    screen.textContent = `> ${echo}_`;
    if (hit && !waving) wave();
  }

  function wave() {
    waving = true;
    kb.classList.add("is-wave");
    eggToast();
    setTimeout(() => {
      kb.classList.remove("is-wave");
      waving = false;
    }, 1200);
  }

  // Pointer: click/tap presses keys; tech keys show their tooltip on hover/focus.
  const onDown = (e: PointerEvent) => {
    const el = (e.target as Element).closest<HTMLElement>(".key");
    if (!el) return;
    press(el);
    const up = () => {
      release(el);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };
  const onOver = (e: PointerEvent) => {
    const el = (e.target as Element).closest<HTMLElement>(".key--tech");
    if (el) showTip(el);
    else hideTip();
  };
  const onFocusIn = (e: FocusEvent) => {
    const el = (e.target as Element).closest<HTMLElement>(".key--tech");
    if (el) showTip(el);
  };
  // Enter/Space on a focused tech key = a click; give it the press feedback too.
  const onClick = (e: MouseEvent) => {
    const el = (e.target as Element).closest<HTMLElement>(".key");
    if (el && e.detail === 0) tap(el);
  };

  // Physical typing. Ignored while typing in a form field or when the keyboard is off-screen.
  const editable = (t: EventTarget | null) =>
    t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  const onKeyDown = (e: KeyboardEvent) => {
    if (!inView || editable(e.target) || e.metaKey || e.ctrlKey) return;
    const el = keyEl(e.code);
    if (el) press(el);
    if (e.key.length === 1 && !e.repeat) type(e.key);
  };
  const onKeyUp = (e: KeyboardEvent) => release(keyEl(e.code));
  const onBlur = () => kb.querySelectorAll(".is-down").forEach((k) => k.classList.remove("is-down"));

  const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
  io.observe(kb);

  kb.addEventListener("pointerdown", onDown);
  kb.addEventListener("pointerover", onOver);
  kb.addEventListener("pointerleave", hideTip);
  kb.addEventListener("focusin", onFocusIn);
  kb.addEventListener("focusout", hideTip);
  kb.addEventListener("click", onClick);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);

  // Cursor parallax tilt (≤ 6°) on the shared pointer loop.
  let offTilt = () => {};
  if (richPointer()) {
    kb.classList.add("is-alive");
    offTilt = onFrame((p) => {
      if (!inView) return;
      const nx = p.sx / innerWidth - 0.5;
      const ny = p.sy / innerHeight - 0.5;
      parallax.style.transform = `rotateX(${(-ny * MAX_TILT).toFixed(2)}deg) rotateY(${(nx * MAX_TILT).toFixed(2)}deg)`;
    });
  }

  return () => {
    io.disconnect();
    offTilt();
    kb.removeEventListener("pointerdown", onDown);
    kb.removeEventListener("pointerover", onOver);
    kb.removeEventListener("pointerleave", hideTip);
    kb.removeEventListener("focusin", onFocusIn);
    kb.removeEventListener("focusout", hideTip);
    kb.removeEventListener("click", onClick);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", onBlur);
  };
}
