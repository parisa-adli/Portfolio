import Image from "next/image";
import { KEYS } from "@/components/core/Keyboard/layout";
import { techTip } from "@/lib/techCount";
import { SceneLoader } from "./SceneLoader";

const TIPS = Object.fromEntries(KEYS.filter((k) => k.tech).map((k) => [k.code, techTip(k.tech!)]));

// Prototype B hero keyboard (§5.1 option b, §6): the box and its label are server-rendered with a fixed
// aspect ratio (no layout shift); a poster stands in until the WebGL scene loads on first interaction.
// Decorative-interactive like A's: everything a key offers is in the label.
export function KeyboardB() {
  return (
    <div className="kb3d" role="img" aria-label={`Mechanical keyboard you can type on. Tech keycaps: ${Object.values(TIPS).join(", ")}.`}>
      <div className="kb3d__float">
        {/* Render of the WebGL scene at rest (scripts/kb-poster.mjs); the live canvas fades in over it. */}
        <Image src="/b/keyboard.png" alt="" fill sizes="(max-width: 1023px) 100vw, 620px" className="kb3d__poster" priority />
        <SceneLoader tips={TIPS} />
      </div>
      <div className="kb__tip" aria-hidden="true" />
    </div>
  );
}
