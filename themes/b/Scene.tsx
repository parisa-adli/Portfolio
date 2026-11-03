"use client";
// Prototype B: procedural React Three Fiber keyboard (§5.1 option b). No GLB: instanced tapered keycaps
// (one InstancedMesh per key width), an extruded acrylic case, and an emissive RGB plate whose light shows
// between the keys. Legends are one canvas atlas drawn in layout space, mapped per key by an instanced UV
// rect. frameloop="demand": nothing renders unless a key moves, the pointer tilts the board or the egg plays.
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { KEYS, KB_WIDTH, KB_HEIGHT, CODE_ALIAS, type KeyDef } from "@/components/core/Keyboard/layout";
import { ICONS } from "@/components/core/icons";
import { click } from "@/components/core/Keyboard/sound";
import { HEAVY, eggToast, typer } from "@/components/core/Keyboard/typing";
import { onFrame, richPointer } from "@/lib/pointer";

const GAP = 0.1; // space between caps (where the RGB plate shows)
const CAP_H = 0.42;
const TAPER = 0.1; // top face inset per side
const TRAVEL = 0.16; // key press depth
const LIFT = 0.2; // caps sit on stems above the RGB plate, so its light spills out under them
const MAX_TILT = (6 * Math.PI) / 180;
const PX = 96; // atlas pixels per key unit

// Colours from the reference photos (indigo caps, coral space) + B's amber accent keys.
const CAP: Record<KeyDef["kind"], string> = {
  alpha: "#4a3fc4",
  arrow: "#4a3fc4",
  mod: "#3a2f9e",
  macro: "#3a2f9e",
  tech: "#251c6b",
  accent: "#f59e0b",
  space: "#ff5a6e",
};
const LEGEND_INK: Partial<Record<KeyDef["kind"], string>> = { accent: "#2a1704", arrow: "#fbbf24", mod: "#c9c3f7", macro: "#c9c3f7" };

const cx = (k: KeyDef) => k.x + k.w / 2 - KB_WIDTH / 2;
const cz = (k: KeyDef) => k.y + 0.5 - KB_HEIGHT / 2;

function capGeometry(w: number) {
  const g = new RoundedBoxGeometry(w - GAP, CAP_H, 1 - GAP, 2, 0.07);
  const p = g.attributes.position;
  const hw = (w - GAP) / 2;
  const hd = (1 - GAP) / 2;
  for (let i = 0; i < p.count; i++) {
    const t = (p.getY(i) + CAP_H / 2) / CAP_H; // 0 at the bottom, 1 at the top
    p.setX(i, p.getX(i) * (1 - (TAPER * t) / hw));
    p.setZ(i, p.getZ(i) * (1 - (TAPER * t) / hd));
  }
  g.translate(0, CAP_H / 2, 0);
  g.computeVertexNormals();
  return g;
}

const brandInk = (name: string) => {
  const hex = ICONS[name]?.hex ?? "ffffff";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.25 ? "#ffffff" : `#${hex}`;
};

// All legends on one canvas, laid out exactly like the keyboard (1u = PX px), so each key's UV rect is
// just its own top face in layout space.
function drawAtlas(mono: string) {
  const c = document.createElement("canvas");
  c.width = Math.ceil(KB_WIDTH * PX);
  c.height = Math.ceil(KB_HEIGHT * PX);
  const g = c.getContext("2d")!;
  const inset = (GAP / 2 + TAPER) * PX;
  for (const k of KEYS) {
    const x = k.x * PX + inset;
    const y = k.y * PX + inset;
    const w = k.w * PX - inset * 2;
    const h = PX - inset * 2;
    g.fillStyle = LEGEND_INK[k.kind] ?? "#ece9ff";
    g.textBaseline = "top";
    if (k.tech) {
      const s = h * 0.62;
      g.save();
      g.translate(x + (w - s) / 2, y + (h - s) / 2);
      g.scale(s / 24, s / 24);
      g.fillStyle = brandInk(k.tech);
      g.fill(new Path2D(ICONS[k.tech].path));
      g.restore();
    } else if (k.kind === "arrow") {
      g.font = `600 ${h * 0.5}px ${mono}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(k.label, x + w / 2, y + h / 2);
      g.textAlign = "left";
    } else if (k.kind === "alpha") {
      if (k.shift) {
        g.font = `500 ${h * 0.3}px ${mono}`;
        g.globalAlpha = 0.6;
        g.fillText(k.shift, x + 4, y + 3);
        g.globalAlpha = 1;
        g.font = `600 ${h * 0.36}px ${mono}`;
        g.fillText(k.label, x + 4, y + h * 0.48);
      } else {
        g.font = `700 ${h * 0.5}px ${mono}`;
        g.fillText(k.label.toUpperCase(), x + 4, y + 4);
      }
    } else if (k.label) {
      g.font = `700 ${h * 0.32}px ${mono}`;
      g.fillText(k.label, x + 4, y + 5);
    }
  }
  return c;
}

function makeTexture(canvas: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

// Hue sweep for the RGB plate and the front light strip.
function rainbow() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 1;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 256, 0);
  ["#22d3ee", "#6366f1", "#d946ef", "#f43f5e", "#f59e0b", "#a3e635", "#22d3ee"].forEach((col, i, a) => grad.addColorStop(i / (a.length - 1), col));
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 1);
  return makeTexture(c);
}

// Soft square falloff for the per-key LED glow.
function softGlow() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(32, 32, 4, 32, 32, 32);
  r.addColorStop(0, "rgba(255,255,255,0.9)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 64);
  return makeTexture(c);
}

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

type Props = { tips: Record<string, string> };

function Board({ tips }: Props) {
  const { invalidate, camera, size, gl } = useThree();
  const group = useRef<THREE.Group>(null!);
  const legends = useRef<THREE.InstancedMesh>(null!);
  const caps = useRef<THREE.InstancedMesh[]>([]);
  const screenTex = useRef<THREE.CanvasTexture>(null!);

  // Keys grouped by width: one InstancedMesh (and one tapered geometry) per width.
  const groups = useMemo(() => {
    const byW = new Map<number, number[]>();
    KEYS.forEach((k, i) => byW.set(k.w, [...(byW.get(k.w) ?? []), i]));
    return [...byW].map(([w, idx]) => ({ geo: capGeometry(w), idx }));
  }, []);
  const where = useMemo(() => {
    const m: [number, number][] = [];
    groups.forEach((g, gi) => g.idx.forEach((ki, j) => (m[ki] = [gi, j])));
    return m;
  }, [groups]);
  const byCode = useMemo(() => new Map(KEYS.map((k, i) => [k.code, i])), []);

  const capMat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.05 }), []);
  const legendMat = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, toneMapped: false });
    m.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nattribute vec4 aRect;")
        .replace("#include <uv_vertex>", "#include <uv_vertex>\nvMapUv = aRect.xy + uv * aRect.zw;");
    };
    return m;
  }, []);
  const legendGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1);
    const rect = new Float32Array(KEYS.length * 4);
    const W = Math.ceil(KB_WIDTH * PX);
    const H = Math.ceil(KB_HEIGHT * PX);
    const inset = (GAP / 2 + TAPER) * PX;
    KEYS.forEach((k, i) => {
      rect.set([(k.x * PX + inset) / W, 1 - ((k.y + 1) * PX - inset) / H, (k.w * PX - 2 * inset) / W, (PX - 2 * inset) / H], i * 4);
    });
    g.setAttribute("aRect", new THREE.InstancedBufferAttribute(rect, 4));
    return g;
  }, []);
  const rgb = useMemo(rainbow, []);
  const leds = useRef<THREE.InstancedMesh>(null!);
  const ledGeo = useMemo(() => new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), []);
  const ledMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: softGlow(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    [],
  );
  const caseShape = useMemo(() => roundedRect(KB_WIDTH + 0.9, KB_HEIGHT + 0.9, 0.45), []);
  const rimShape = useMemo(() => {
    const s = roundedRect(KB_WIDTH + 0.9, KB_HEIGHT + 0.9, 0.45);
    s.holes.push(roundedRect(KB_WIDTH + 0.3, KB_HEIGHT + 0.3, 0.22));
    return s;
  }, []);

  const depth = useMemo(() => new Float32Array(KEYS.length), []);
  const target = useMemo(() => new Float32Array(KEYS.length), []);
  const glow = useRef(-1); // easter-egg wave clock (s); -1 = off
  const tilt = useRef({ x: 0, y: 0 });

  const place = useMemo(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    return (i: number) => {
      const k = KEYS[i];
      const [gi, j] = where[i];
      caps.current[gi].setMatrixAt(j, m.makeTranslation(cx(k), LIFT - depth[i], cz(k)));
      caps.current[gi].instanceMatrix.needsUpdate = true;
      p.set(cx(k), LIFT + CAP_H + 0.004 - depth[i], cz(k));
      s.set(k.w - GAP - 2 * TAPER, 1 - GAP - 2 * TAPER, 1);
      legends.current.setMatrixAt(i, m.compose(p, q, s));
      legends.current.instanceMatrix.needsUpdate = true;
    };
  }, [where, depth]);

  const baseColor = useMemo(() => KEYS.map((k) => new THREE.Color(CAP[k.kind])), []);
  const paint = useMemo(() => {
    const c = new THREE.Color();
    const hot = new THREE.Color("#fde68a");
    return (i: number, amount: number) => {
      const [gi, j] = where[i];
      caps.current[gi].setColorAt(j, c.copy(baseColor[i]).lerp(hot, amount));
      caps.current[gi].instanceColor!.needsUpdate = true;
    };
  }, [where, baseColor]);

  // Initial placement, LED hues (same hue sweep as A's CSS keyboard), legend atlas (after fonts load).
  useEffect(() => {
    KEYS.forEach((_, i) => (place(i), paint(i, 0)));
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    KEYS.forEach((k, i) => {
      leds.current.setMatrixAt(i, m.makeScale(k.w + 0.35, 1, 1.35).setPosition(cx(k), 0.1, cz(k)));
      leds.current.setColorAt(i, c.setHSL((((k.x / KB_WIDTH) * 300 + k.y * 12) % 360) / 360, 0.95, 0.55));
    });
    leds.current.instanceMatrix.needsUpdate = true;
    leds.current.instanceColor!.needsUpdate = true;
    let tex: THREE.CanvasTexture | undefined;
    const mono = getComputedStyle(document.querySelector(".label") ?? document.body).fontFamily;
    document.fonts.ready.then(() => {
      tex = makeTexture(drawAtlas(mono));
      legendMat.map = tex;
      legendMat.needsUpdate = true;
      invalidate();
    });
    return () => tex?.dispose();
  }, [place, paint, legendMat, invalidate]);

  // Screen echo (top-right, like A's): a tiny canvas redrawn on each typed character.
  const screen = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 384;
    c.height = 128;
    const mono = getComputedStyle(document.querySelector(".label") ?? document.body).fontFamily;
    const draw = (text: string) => {
      const g = c.getContext("2d")!;
      g.fillStyle = "#0c0a1c";
      g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = "#fbbf24";
      g.font = `500 44px ${mono}`;
      g.textBaseline = "middle";
      g.fillText(text, 22, 66);
      if (screenTex.current) screenTex.current.needsUpdate = true;
    };
    draw("~/parisa");
    return { canvas: c, draw };
  }, []);

  const tipEl = useMemo(() => gl.domElement.closest(".kb3d")?.querySelector<HTMLElement>(".kb__tip") ?? null, [gl]);
  const tipAt = useMemo(() => {
    const v = new THREE.Vector3();
    return (i: number) => {
      const k = KEYS[i];
      if (!tipEl || !tips[k.code]) return;
      v.set(cx(k), LIFT + CAP_H, cz(k) - 0.5);
      group.current.localToWorld(v).project(camera);
      tipEl.textContent = tips[k.code];
      tipEl.style.transform = `translate(calc(${((v.x + 1) / 2) * size.width}px - 50%), calc(${((1 - v.y) / 2) * size.height}px - 100% - 10px))`;
      tipEl.classList.add("is-on");
    };
  }, [tipEl, tips, camera, size]);
  const hideTip = () => tipEl?.classList.remove("is-on");

  const press = (i: number) => {
    if (target[i] === 0) click(HEAVY.has(KEYS[i].code));
    target[i] = TRAVEL;
    tipAt(i);
    invalidate();
  };
  const release = (i: number) => {
    target[i] = 0;
    invalidate();
  };

  // Physical typing (ignored in form fields and while the keyboard is off-screen).
  useEffect(() => {
    const type = typer();
    const box = gl.domElement.closest(".kb3d")!;
    let inView = true;
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
    io.observe(box);
    const editable = (t: EventTarget | null) =>
      t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    const idx = (code: string) => byCode.get(CODE_ALIAS[code] ?? code);
    const down = (e: KeyboardEvent) => {
      if (!inView || editable(e.target) || e.metaKey || e.ctrlKey) return;
      const i = idx(e.code);
      if (i !== undefined) press(i);
      if (e.key.length === 1 && !e.repeat) {
        const { echo, hit } = type(e.key);
        screen.draw(`> ${echo}_`);
        if (hit && glow.current < 0) {
          glow.current = 0;
          eggToast();
        }
        invalidate();
      }
    };
    const up = (e: KeyboardEvent) => {
      const i = idx(e.code);
      if (i !== undefined) release(i);
    };
    const blur = () => KEYS.forEach((_, i) => (target[i] = 0), invalidate());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);

    // Cursor parallax tilt (≤ 6°) on the shared pointer loop; off for touch and reduced motion.
    let offTilt = () => {};
    if (richPointer()) {
      offTilt = onFrame((p) => {
        if (!inView) return;
        tilt.current.x = (p.sy / innerHeight - 0.5) * MAX_TILT;
        tilt.current.y = (p.sx / innerWidth - 0.5) * MAX_TILT;
        invalidate();
      });
    }
    return () => {
      io.disconnect();
      offTilt();
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30); // on-demand frames: the first delta spans the whole idle gap
    let busy = false;
    const k = 1 - Math.exp(-dt * 50); // ~60ms press
    for (let i = 0; i < KEYS.length; i++) {
      if (depth[i] === target[i]) continue;
      depth[i] += (target[i] - depth[i]) * k;
      if (Math.abs(target[i] - depth[i]) < 0.002) depth[i] = target[i];
      place(i);
      busy = true;
    }
    // Easter egg: a light wave sweeps left → right across the caps (1.2s).
    if (glow.current >= 0) {
      glow.current += dt;
      const front = (glow.current / 1.2) * (KB_WIDTH + 6) - 3;
      KEYS.forEach((key, i) => paint(i, Math.max(0, 1 - Math.abs(key.x + key.w / 2 - front) / 2.5)));
      if (glow.current > 1.2) {
        glow.current = -1;
        KEYS.forEach((_, i) => paint(i, 0));
      }
      busy = true;
    }
    group.current.rotation.x = tilt.current.x;
    group.current.rotation.y = -0.16 + tilt.current.y;
    if (busy) invalidate();
  });

  const onDown = (gi: number) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const i = groups[gi].idx[e.instanceId!];
    press(i);
    const up = () => {
      release(i);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };
  const onMove = (gi: number) => (e: ThreeEvent<PointerEvent>) => {
    const i = groups[gi].idx[e.instanceId!];
    if (tips[KEYS[i].code]) tipAt(i);
    else hideTip();
  };

  return (
    <group ref={group} rotation={[0, -0.16, 0]}>
      {/* acrylic base slab + raised rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]}>
        <extrudeGeometry args={[caseShape, { depth: 0.7, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 2 }]} />
        <meshStandardMaterial color="#2c2280" emissive="#1b1166" emissiveIntensity={0.8} roughness={0.15} transparent opacity={0.82} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <extrudeGeometry args={[rimShape, { depth: 0.22, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2 }]} />
        <meshStandardMaterial color="#7d6bff" emissive="#3a26b8" emissiveIntensity={0.5} roughness={0.1} transparent opacity={0.45} />
      </mesh>
      {/* dark plate + one soft LED glow per switch, spilling out between the raised caps */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.09, 0]}>
        <planeGeometry args={[KB_WIDTH + 0.3, KB_HEIGHT + 0.3]} />
        <meshBasicMaterial color="#120d36" />
      </mesh>
      <instancedMesh ref={leds} args={[ledGeo, ledMat, KEYS.length]} raycast={() => null} />
      {/* front light strip */}
      <mesh position={[0, -0.42, (KB_HEIGHT + 0.9) / 2 + 0.07]}>
        <planeGeometry args={[KB_WIDTH - 0.4, 0.08]} />
        <meshBasicMaterial map={rgb} toneMapped={false} transparent opacity={0.85} />
      </mesh>
      {/* screen, top-right (same slot as A's) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[KB_WIDTH / 2 - 1.5, 0.12, -KB_HEIGHT / 2 + 0.5]}>
        <planeGeometry args={[2.8, 0.85]} />
        <meshBasicMaterial toneMapped={false}>
          <canvasTexture ref={screenTex} attach="map" args={[screen.canvas]} colorSpace={THREE.SRGBColorSpace} />
        </meshBasicMaterial>
      </mesh>
      {groups.map((g, gi) => (
        <instancedMesh
          key={gi}
          ref={(m) => {
            if (m) caps.current[gi] = m;
          }}
          args={[g.geo, capMat, g.idx.length]}
          onPointerDown={onDown(gi)}
          onPointerMove={onMove(gi)}
          onPointerOut={hideTip}
        />
      ))}
      <instancedMesh ref={legends} args={[legendGeo, legendMat, KEYS.length]} raycast={() => null} renderOrder={1} />
    </group>
  );
}

export default function Scene({ tips }: Props) {
  return (
    <Canvas
      frameloop="demand"
      flat
      dpr={[1, 2]}
      camera={{ position: [0, 19.5, 16.5], fov: 27 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "pan-y" }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(0, -0.6, 0.6);
        gl.domElement.closest(".kb3d")?.classList.add("is-ready");
        if (richPointer()) gl.domElement.closest(".kb3d")?.classList.add("is-alive");
      }}
    >
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#d9d4ff", "#120a3a", 0.7]} />
      <directionalLight position={[-7, 12, 10]} intensity={2.2} />
      <directionalLight position={[8, 4, -6]} intensity={0.6} color="#f59e0b" />
      <Board tips={tips} />
    </Canvas>
  );
}
