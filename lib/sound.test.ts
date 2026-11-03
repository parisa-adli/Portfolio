import { test } from "node:test";
import assert from "node:assert/strict";
import { synth, pick, PRESS, HEAVY, RELEASE } from "../components/core/Keyboard/sound.ts";

const rate = 48000;
const rms = (d: Float32Array, a: number, b: number) => Math.sqrt(d.slice(a, b).reduce((s, x) => s + x * x, 0) / (b - a));

test("every voice is finite, peak-normalised and decays to silence", () => {
  for (const v of [...PRESS, ...HEAVY, ...RELEASE]) {
    const d = synth(rate, v);
    assert.ok(d.every(Number.isFinite));
    assert.ok(Math.abs(Math.max(...d.map(Math.abs)) - 0.9) < 0.01);
    assert.ok(rms(d, d.length - 96, d.length) < 0.02, `seed ${v.seed} tail too loud`);
  }
});

test("heavy voices carry more low end than release voices (body vs upstroke)", () => {
  // Crude low-pass energy: average of adjacent samples kills the kHz clack, keeps the 90–140 Hz body.
  const low = (d: Float32Array) => rms(Float32Array.from(d, (x, i) => (x + (d[i - 1] ?? 0) + (d[i - 2] ?? 0) + (d[i - 3] ?? 0)) / 4), 0, d.length);
  assert.ok(low(synth(rate, HEAVY[0])) > low(synth(rate, RELEASE[0])));
});

test("pick never repeats the previous variant", () => {
  for (const r of [0, 0.3, 0.5, 0.99]) for (let last = 0; last < 4; last++) assert.notEqual(pick(4, last, r), last);
  assert.equal(pick(1, 0), 0);
});
