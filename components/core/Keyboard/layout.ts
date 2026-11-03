// 75% keyboard layout (§5.1): F-row, full alpha block,
// right-edge 3×3 macro column (tech-stack art keys) and an inverted-T arrow cluster.
// Units: 1u = one standard key. `code` matches KeyboardEvent.code so physical typing maps 1:1.

export type KeyKind = "alpha" | "mod" | "accent" | "space" | "tech" | "macro" | "arrow";
export type KeyDef = {
  code: string;
  label: string;
  shift?: string; // secondary legend
  w: number;
  x: number;
  y: number;
  kind: KeyKind;
  tech?: string; // keycapStack name for tech keys
};

export const KB_WIDTH = 18.5; // 15u main block + 0.5u gap + 3u macro column
export const KB_HEIGHT = 6.25; // F-row + 0.25u gap + 5 rows

type Row = (Omit<KeyDef, "x" | "y" | "w" | "kind"> & { w?: number; kind?: KeyKind; gap?: number })[];

const letters = (s: string) => s.split("").map((c) => ({ code: `Key${c}`, label: c }));
const sym = (code: string, label: string, shift: string) => ({ code, label, shift });

const rows: Row[] = [
  [
    { code: "Escape", label: "esc", kind: "accent" },
    ...["F1", "F2", "F3", "F4"].map((f, i) => ({ code: f, label: f, kind: "mod" as const, gap: i === 0 ? 0.25 : 0 })),
    ...["F5", "F6", "F7", "F8"].map((f, i) => ({ code: f, label: f, kind: "mod" as const, gap: i === 0 ? 0.25 : 0 })),
    ...["F9", "F10", "F11", "F12"].map((f, i) => ({ code: f, label: f, kind: "mod" as const, gap: i === 0 ? 0.25 : 0 })),
    { code: "Delete", label: "del", kind: "mod", gap: 0.25 },
  ],
  [
    sym("Backquote", "`", "~"),
    ...[["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"]].map(
      ([d, s]) => sym(`Digit${d}`, d, s),
    ),
    sym("Minus", "-", "_"),
    sym("Equal", "=", "+"),
    { code: "Backspace", label: "backspace", w: 2, kind: "accent" },
  ],
  [
    { code: "Tab", label: "tab", w: 1.5, kind: "mod" },
    ...letters("QWERTYUIOP"),
    sym("BracketLeft", "[", "{"),
    sym("BracketRight", "]", "}"),
    { ...sym("Backslash", "\\", "|"), w: 1.5 },
  ],
  [
    { code: "CapsLock", label: "caps", w: 1.75, kind: "mod" },
    ...letters("ASDFGHJKL"),
    sym("Semicolon", ";", ":"),
    sym("Quote", "'", '"'),
    { code: "Enter", label: "enter", w: 2.25, kind: "accent" },
  ],
  [
    { code: "ShiftLeft", label: "shift", w: 2.25, kind: "mod" },
    ...letters("ZXCVBNM"),
    sym("Comma", ",", "<"),
    sym("Period", ".", ">"),
    sym("Slash", "/", "?"),
    { code: "ShiftRight", label: "shift", w: 2.75, kind: "mod" },
  ],
  [
    { code: "ControlLeft", label: "ctrl", w: 1.5, kind: "mod" },
    { code: "MetaLeft", label: "⌘", w: 1.25, kind: "mod" },
    { code: "AltLeft", label: "alt", w: 1.5, kind: "mod" },
    { code: "Space", label: "", w: 7, kind: "space" },
    { code: "AltRight", label: "alt", w: 1.25, kind: "mod" },
    { code: "Fn", label: "fn", w: 1.25, kind: "mod" },
    { code: "ControlRight", label: "ctrl", w: 1.25, kind: "mod" },
  ],
];

const rowY = [0, 1.25, 2.25, 3.25, 4.25, 5.25];

const main: KeyDef[] = rows.flatMap((row, r) => {
  let x = 0;
  return row.map(({ gap = 0, w = 1, kind = "alpha", ...k }) => {
    x += gap;
    const key = { ...k, w, kind, x, y: rowY[r] };
    x += w;
    return key;
  });
});

// Right edge: 3×3 macro block (rows 1–3) with the six tech keycaps, then the inverted-T arrows.
const MX = 15.5;
const tech = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB"];
const macro: KeyDef[] = [
  ...tech.map((t, i) => ({
    code: `Tech${i}`,
    label: t,
    tech: t,
    w: 1,
    x: MX + (i % 3),
    y: rowY[1 + Math.floor(i / 3)],
    kind: "tech" as const,
  })),
  { code: "Home", label: "home", w: 1, x: MX, y: rowY[3], kind: "macro" },
  { code: "PageUp", label: "pg↑", w: 1, x: MX + 1, y: rowY[3], kind: "macro" },
  { code: "PageDown", label: "pg↓", w: 1, x: MX + 2, y: rowY[3], kind: "macro" },
  { code: "ArrowUp", label: "↑", w: 1, x: MX + 1, y: rowY[4], kind: "arrow" },
  { code: "ArrowLeft", label: "←", w: 1, x: MX, y: rowY[5], kind: "arrow" },
  { code: "ArrowDown", label: "↓", w: 1, x: MX + 1, y: rowY[5], kind: "arrow" },
  { code: "ArrowRight", label: "→", w: 1, x: MX + 2, y: rowY[5], kind: "arrow" },
];

export const KEYS: KeyDef[] = [...main, ...macro];

/** Physical key code → our key code, for keys whose events differ from layout ids. */
export const CODE_ALIAS: Record<string, string> = {
  MetaRight: "MetaLeft",
  OSLeft: "MetaLeft",
  NumpadEnter: "Enter",
};
