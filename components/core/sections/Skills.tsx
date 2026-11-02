import { skills, type SkillGroup } from "@/content/skills";
import { SectionHeader } from "../SectionHeader";
import { Icon, ICONS } from "../icons";
import { SkillsFilter } from "../SkillsFilter";

const GROUPS: SkillGroup[] = ["Frontend", "Backend", "Tooling"];

// Brand colours that vanish on a dark background fall back to the primary text colour.
function hoverColor(name: string) {
  const hex = ICONS[name]?.hex;
  if (!hex) return "var(--text-0)";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum < 0.25 ? "var(--text-0)" : `#${hex}`;
}

const initials = (name: string) => name.replace(/[^A-Za-z ]/g, "").split(" ").map((w) => w[0]).join("").slice(0, 3);

// §5.3: skills.json editor (left 4) + icon tiles (right 8) + logo strip. content/skills.ts is authoritative.
export function Skills() {
  const json = GROUPS.map((g) => ({ group: g, items: skills.filter((s) => s.group === g).map((s) => s.name) }));
  const iconSkills = skills.filter((s) => ICONS[s.name]);
  return (
    <section id="skills" className="section container-x cv-auto" aria-labelledby="skills-title">
      <SectionHeader index="03" file="skills.json" id="skills-title" title="The stack behind the work" />
      <SkillsFilter groups={GROUPS} json={json}>
        <div className="skills__tiles">
          <div className="orbit" aria-hidden="true">
            <div className="orbit__spin" />
          </div>
          <ul className="tiles" aria-label="Skills">
            {skills.map((s) => (
              <li key={s.name} className="tile" data-group={s.group} style={{ ["--brand" as string]: hoverColor(s.name) }}>
                <span className="tile__box" aria-hidden="true">
                  {ICONS[s.name] ? <Icon name={s.name} size={28} /> : <span className="tile__glyph">{initials(s.name)}</span>}
                </span>
                <span className="tile__name">{s.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </SkillsFilter>
      <div className="logo-strip" aria-hidden="true">
        <div className="logo-strip__track">
          {[0, 1].map((k) => (
            <span key={k} className="logo-strip__run">
              {iconSkills.map((s) => (
                <Icon key={s.name} name={s.name} size={22} />
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
