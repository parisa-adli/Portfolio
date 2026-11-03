// Linear switch sounds, tuned toward a heavy linear (Cherry MX Black-like, ~60 g, no click jacket) (§5.1).
// No sample files: a few short buffers are synthesised the first time the visitor unmutes, then played with
// ±3% random pitch. Muted by default; never auto-unmutes.

export type Voice = {
  seed: number;
  bandHz: number; // centre of the plastic "clack" (band-passed noise)
  clackDecay: number; // 1/s, exp(-t*k)
  bodyHz: number; // low thump of the keycap bottoming out
  bodyDecay: number; // 1/s
  bodyGain: number;
  len: number; // seconds
  rattle?: boolean; // stabiliser: tiny second transient ~10 ms after the first
};

/** Pure synthesis (testable without Web Audio). Peak-normalised to 0.9. */
export function synth(rate: number, v: Voice) {
  const n = Math.floor(rate * v.len);
  const d = new Float32Array(n);
  let s = v.seed;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647) * 2 - 1;
  // RBJ band-pass (constant 0 dB peak), Q ~1.2: dense, not ringing.
  const bp = (hz: number) => {
    const w = (2 * Math.PI * hz) / rate;
    const al = Math.sin(w) / (2 * 1.2);
    const a0 = 1 + al;
    const [b0, b2, a1, a2] = [al / a0, -al / a0, (-2 * Math.cos(w)) / a0, (1 - al) / a0];
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    return (x: number) => {
      const y = b0 * x + b2 * x2 - a1 * y1 - a2 * y2;
      [x2, x1, y2, y1] = [x1, x, y1, y];
      return y;
    };
  };
  const clack = bp(v.bandHz);
  const rattle = bp(v.bandHz * 1.4);
  const rattleAt = 0.008 + (v.seed % 5) * 0.001; // 8–12 ms
  let peak = 0;
  for (let i = 0; i < n; i++) {
    const t = i / rate;
    const attack = 1 - Math.exp(-t * 6000); // ~0.2 ms ramp, avoids a DC step
    let x = clack(rand()) * Math.exp(-t * v.clackDecay) * attack;
    x += Math.sin(2 * Math.PI * v.bodyHz * t) * Math.exp(-t * v.bodyDecay) * v.bodyGain * attack;
    const rx = rattle(rand());
    if (v.rattle && t >= rattleAt) x += rx * Math.exp(-(t - rattleAt) * v.clackDecay * 1.6) * 0.3;
    d[i] = x;
    peak = Math.max(peak, Math.abs(x));
  }
  for (let i = 0; i < n; i++) d[i] *= 0.9 / (peak || 1);
  // Short fade-out so the buffer never ends on a step.
  const fade = Math.min(n, Math.floor(rate * 0.004));
  for (let i = 0; i < fade; i++) d[n - 1 - i] *= i / fade;
  return d;
}

// Press: clack ~1.5–2.5 kHz dying in ~20 ms, body 110–140 Hz over ~50 ms.
export const PRESS: Voice[] = [
  { seed: 7, bandHz: 1600, clackDecay: 210, bodyHz: 112, bodyDecay: 65, bodyGain: 0.9, len: 0.07 },
  { seed: 13, bandHz: 1900, clackDecay: 230, bodyHz: 122, bodyDecay: 70, bodyGain: 0.85, len: 0.07 },
  { seed: 29, bandHz: 2150, clackDecay: 250, bodyHz: 131, bodyDecay: 72, bodyGain: 0.8, len: 0.065 },
  { seed: 41, bandHz: 2400, clackDecay: 220, bodyHz: 140, bodyDecay: 68, bodyGain: 0.85, len: 0.065 },
];
// Heavy keys (space, enter, backspace): deeper, a bit longer, stabiliser rattle.
export const HEAVY: Voice[] = [
  { seed: 53, bandHz: 1500, clackDecay: 180, bodyHz: 92, bodyDecay: 45, bodyGain: 1, len: 0.1, rattle: true },
  { seed: 61, bandHz: 1700, clackDecay: 190, bodyHz: 100, bodyDecay: 48, bodyGain: 0.95, len: 0.1, rattle: true },
];
// Release (upstroke): higher, shorter, little body. Played at ~40% of press volume.
export const RELEASE: Voice[] = [
  { seed: 71, bandHz: 2800, clackDecay: 320, bodyHz: 190, bodyDecay: 110, bodyGain: 0.3, len: 0.035 },
  { seed: 83, bandHz: 3200, clackDecay: 340, bodyHz: 210, bodyDecay: 120, bodyGain: 0.25, len: 0.035 },
];

const MASTER = 0.3;
const RELEASE_GAIN = 0.4;

type Pool = { bufs: AudioBuffer[]; last: number };
let ctx: AudioContext | null = null;
let out: GainNode | null = null;
let pools: Record<"press" | "heavy" | "release", Pool> | null = null;
let enabled = false;

export function setSound(on: boolean) {
  enabled = on;
  if (!on) return;
  // Creating the AudioContext + buffers is slow (~50–70ms on mobile): do it right after the toggle has
  // painted, not inside the toggle's handler, so the tap stays responsive. The page already has user activation.
  requestAnimationFrame(() =>
    setTimeout(() => {
      if (!ctx) {
        const ac = (ctx = new AudioContext());
        // Soft limiter so fast typing (overlapping voices) never clips.
        const lim = new DynamicsCompressorNode(ac, { threshold: -14, knee: 8, ratio: 12, attack: 0.002, release: 0.08 });
        out = new GainNode(ac, { gain: MASTER });
        out.connect(lim).connect(ac.destination);
        const pool = (vs: Voice[]): Pool => ({
          last: -1,
          bufs: vs.map((v) => {
            const b = ac.createBuffer(1, Math.floor(ac.sampleRate * v.len), ac.sampleRate);
            b.copyToChannel(synth(ac.sampleRate, v), 0);
            return b;
          }),
        });
        pools = { press: pool(PRESS), heavy: pool(HEAVY), release: pool(RELEASE) };
      }
      void ctx.resume();
    }),
  );
}

/** Random variant, never the same buffer twice in a row. */
export function pick(n: number, last: number, r = Math.random()) {
  if (n < 2) return 0;
  return last < 0 ? Math.floor(r * n) : (last + 1 + Math.floor(r * (n - 1))) % n;
}

function play(pool: Pool, gain: number) {
  if (!enabled || !ctx || !out) return;
  pool.last = pick(pool.bufs.length, pool.last);
  const src = new AudioBufferSourceNode(ctx, { buffer: pool.bufs[pool.last], playbackRate: 1 + (Math.random() * 2 - 1) * 0.03 });
  src.connect(new GainNode(ctx, { gain })).connect(out);
  src.start();
}

/** Key bottoms out. heavy = space/enter/backspace. */
export function keyDownSound(heavy = false) {
  if (pools) play(heavy ? pools.heavy : pools.press, 1);
}

/** Key returns (upstroke); only call for a key that was pressed. */
export function keyUpSound() {
  if (pools) play(pools.release, RELEASE_GAIN);
}
