import type { TerminalEntry } from "../content/profile";

// Typing schedule for the About terminal: commands type per character, output appears at once (like a real shell).
const CHAR = 24; // ms per typed character
const PAUSE = 150; // command typed → output shows
const GAP = 250; // output shown → next command starts
export const MAX_TYPING_MS = 3400; // the whole sequence is scaled down to fit this
export const PROMPT = "parisa@dev ~ $ ";

export type TermRow = { kind: "cmd" | "out" | "end"; entry?: TerminalEntry; n: number; d: number; t: number };

/** n = steps (characters), d = start delay ms, t = duration ms. The last row is the empty prompt with the caret. */
export function schedule(entries: TerminalEntry[]): TermRow[] {
  const rows: TermRow[] = [];
  let at = 0;
  for (const entry of entries) {
    const n = PROMPT.length + entry.cmd.length;
    rows.push({ kind: "cmd", entry, n, d: at, t: n * CHAR });
    at += n * CHAR + PAUSE;
    rows.push({ kind: "out", entry, n: 1, d: at, t: CHAR });
    at += CHAR + GAP;
  }
  const endN = PROMPT.length + 1;
  rows.push({ kind: "end", n: endN, d: at, t: endN * CHAR });
  const k = Math.min(1, MAX_TYPING_MS / (at + endN * CHAR));
  return rows.map((r) => ({ ...r, d: Math.round(r.d * k), t: Math.max(1, Math.round(r.t * k)) }));
}
