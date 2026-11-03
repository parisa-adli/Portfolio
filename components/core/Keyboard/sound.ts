// Mechanical click sounds (§5.1). No sample files: three short click buffers are synthesised the first
// time the visitor unmutes, then played with ±3% random pitch. Muted by default; never auto-unmutes.
let ctx: AudioContext | null = null;
let buffers: AudioBuffer[] = [];
let enabled = false;

function synth(ac: AudioContext, seed: number, thumpHz: number, len = 0.05) {
  const n = Math.floor(ac.sampleRate * len);
  const buf = ac.createBuffer(1, n, ac.sampleRate);
  const d = buf.getChannelData(0);
  let s = seed;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647) * 2 - 1;
  let prev = 0;
  for (let i = 0; i < n; i++) {
    const t = i / ac.sampleRate;
    const noise = rand();
    const hp = noise - prev * 0.85; // crude high-pass for the "tick"
    prev = noise;
    const tick = hp * Math.exp(-t * 900) * 0.6;
    const thump = Math.sin(2 * Math.PI * thumpHz * t) * Math.exp(-t * 120) * 0.5;
    d[i] = tick + thump;
  }
  return buf;
}

export function setSound(on: boolean) {
  enabled = on;
  if (!on) return;
  // Creating the AudioContext + buffers is slow (~50–70ms on mobile): do it right after the toggle has
  // painted, not inside the click, so the tap stays responsive. The page already has user activation.
  requestAnimationFrame(() =>
    setTimeout(() => {
      if (!ctx) {
        ctx = new AudioContext();
        buffers = [synth(ctx, 7, 170), synth(ctx, 13, 190), synth(ctx, 29, 120, 0.07)];
      }
      void ctx.resume();
    }),
  );
}

/** heavy = space/enter/backspace, uses the deeper variant. */
export function click(heavy = false) {
  if (!enabled || !ctx) return;
  const src = ctx.createBufferSource();
  src.buffer = heavy ? buffers[2] : buffers[Math.random() < 0.5 ? 0 : 1];
  src.playbackRate.value = 1 + (Math.random() * 2 - 1) * 0.03;
  const gain = ctx.createGain();
  gain.gain.value = 0.35;
  src.connect(gain).connect(ctx.destination);
  src.start();
}
