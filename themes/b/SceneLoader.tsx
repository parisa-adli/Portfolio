"use client";
import { useEffect, useState, type ComponentType } from "react";

type SceneProps = { tips: Record<string, string> };

const WAKE = ["pointermove", "pointerdown", "touchstart", "keydown", "wheel", "scroll"] as const;

// Loads the three.js chunk on the visitor's first interaction. Until then the server-rendered poster (a
// render of this same scene) stands in, so booting WebGL never competes with first load: on a throttled
// phone it cost seconds of main-thread time.
export function SceneLoader(props: SceneProps) {
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const go = () => {
      WAKE.forEach((e) => window.removeEventListener(e, go));
      import("./Scene").then((m) => !cancelled && setScene(() => m.default));
    };
    WAKE.forEach((e) => window.addEventListener(e, go, { passive: true }));
    return () => {
      cancelled = true;
      WAKE.forEach((e) => window.removeEventListener(e, go));
    };
  }, []);

  return Scene ? <Scene {...props} /> : null;
}
