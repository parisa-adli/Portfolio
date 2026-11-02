import { KEYS, KB_WIDTH, KB_HEIGHT } from "./layout";
import { Icon } from "../icons";
import { techTip } from "@/lib/techCount";

const TECH_TIPS = KEYS.filter((k) => k.tech).map((k) => techTip(k.tech!));

// Server-rendered CSS 3D keyboard (§5.1 option a). Interactivity is attached later by the controller
// through one delegated listener, so this markup ships no JS. The board is decorative-interactive
// (§5.1): keys are pointer/physical-keyboard toys, not tab stops (on mobile they are ~20px, under the
// target size). Everything a key offers is in the board's accessible label, so nothing is only
// reachable through it.
export function Keyboard() {
  return (
    <div
      className="kb"
      style={{ ["--kb-w" as string]: KB_WIDTH, ["--kb-h" as string]: KB_HEIGHT }}
      role="img"
      aria-label={`Mechanical keyboard you can type on. Tech keycaps: ${TECH_TIPS.join(", ")}.`}
    >
      <div className="kb__parallax">
        <div className="kb__float">
          <div className="kb__tilt">
            <div className="kb__case">
              <div className="kb__plate" />
              <div className="kb__sweep" />
              <div className="kb__screen">
                <span className="kb__screen-text" data-kb-screen>
                  ~/parisa
                </span>
              </div>
              {KEYS.map((k) => (
                <span
                  key={k.code}
                  className={`key key--${k.kind}`}
                  data-code={k.code}
                  data-tip={k.tech ? techTip(k.tech) : undefined}
                  style={{
                    ["--x" as string]: k.x,
                    ["--y" as string]: k.y,
                    ["--w" as string]: k.w,
                    ["--h" as string]: Math.round((k.x / 18.5) * 300 + k.y * 12) % 360,
                  }}
                >
                  <span className="key__cap">
                    {k.tech ? (
                      <Icon name={k.tech} className="key__icon" />
                    ) : (
                      <>
                        {k.shift && <span className="key__shift">{k.shift}</span>}
                        <span className="key__legend">{k.label}</span>
                      </>
                    )}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="kb__tip" aria-hidden="true" data-kb-tip />
    </div>
  );
}
