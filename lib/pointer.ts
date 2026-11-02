// One shared rAF loop for pointer-driven effects (§4.1). Subscribers write CSS vars / transforms
// directly to their own elements; nothing goes through React state. The loop sleeps when settled.
export type Pointer = { x: number; y: number; sx: number; sy: number };
type Fn = (p: Pointer) => void;

export const pointer: Pointer = { x: -1000, y: -1000, sx: -1000, sy: -1000 };
const subs = new Set<Fn>();
let raf = 0;
let listening = false;

function tick() {
  pointer.sx += (pointer.x - pointer.sx) * 0.12;
  pointer.sy += (pointer.y - pointer.sy) * 0.12;
  subs.forEach((f) => f(pointer));
  const settled = Math.abs(pointer.x - pointer.sx) < 0.2 && Math.abs(pointer.y - pointer.sy) < 0.2;
  raf = settled ? 0 : requestAnimationFrame(tick);
}

function wake() {
  if (!raf && subs.size) raf = requestAnimationFrame(tick);
}

function onMove(e: PointerEvent) {
  if (pointer.sx === -1000) {
    pointer.sx = e.clientX;
    pointer.sy = e.clientY;
  }
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  wake();
}

export function onFrame(fn: Fn) {
  subs.add(fn);
  if (!listening) {
    window.addEventListener("pointermove", onMove, { passive: true });
    listening = true;
  }
  wake();
  return () => {
    subs.delete(fn);
  };
}

/** Fine pointer and motion allowed: the only case where cursor, spotlight and tilt run. */
export const richPointer = () =>
  matchMedia("(pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches;
