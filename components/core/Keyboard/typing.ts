// Typing logic shared by every keyboard (CSS 3D in A/C, WebGL in B): the echo buffer, the secret words
// that fire the easter egg (§5.1), and the keys that get the heavier click sound.
import { toast } from "../Toast";

const SECRETS = ["hire", "next", "react"];
export const HEAVY = new Set(["Space", "Enter", "Backspace"]);

/** Rolling buffer of typed characters → the text to echo, and whether a secret word just completed. */
export function typer() {
  let typed = "";
  return (ch: string) => {
    typed = (typed + ch).slice(-24);
    const echo = typed.slice(-9);
    const hit = SECRETS.some((s) => typed.toLowerCase().endsWith(s));
    if (hit) typed = "";
    return { echo, hit };
  };
}

export const eggToast = () => toast("Let's build something →", { href: "#contact", text: "contact" });
