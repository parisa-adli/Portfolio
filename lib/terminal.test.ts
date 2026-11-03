import { test } from "node:test";
import assert from "node:assert/strict";
import { schedule, MAX_TYPING_MS, PROMPT } from "./terminal.ts";

const entries = [
  { cmd: "whoami", out: ["Full-stack developer"] },
  { cmd: "cat stack.txt", out: ["a\tb", "c\td"] },
  { cmd: "cat focus.txt", out: ["x"] },
  { cmd: "ls ~/featured", out: [{ text: "a", href: "/work/a" }] },
];

test("terminal schedule: ordered, ends on the prompt, fits the time cap", () => {
  const rows = schedule(entries);
  assert.equal(rows.length, entries.length * 2 + 1);
  assert.equal(rows.at(-1)!.kind, "end");
  assert.equal(rows[0].n, PROMPT.length + "whoami".length);
  for (let i = 1; i < rows.length; i++) assert.ok(rows[i].d >= rows[i - 1].d + rows[i - 1].t - 1, `row ${i} overlaps`);
  const last = rows.at(-1)!;
  assert.ok(last.d + last.t <= MAX_TYPING_MS + 1);
});

test("short sequences are not stretched", () => {
  const rows = schedule([{ cmd: "ls", out: ["a"] }]);
  assert.equal(rows[0].t, (PROMPT.length + 2) * 24);
});
