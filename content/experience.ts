// Source: docs/cv.pdf. The CV has no work-experience section, so roles are TODO (see CONTENT_GAPS.md).

export type ExperienceEntry = {
  kind: "work" | "education" | "certification";
  role: string;
  org: string;
  start: string; // "YYYY" or "YYYY-MM"
  end: string | null; // null = present
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    kind: "work",
    role: "{{TODO: role — e.g. freelance frontend developer}}",
    org: "{{TODO: company / clients}}",
    start: "{{TODO}}",
    end: null,
    bullets: ["{{TODO: 2–3 bullets}}"],
  },
  {
    kind: "education",
    role: "Bachelor's Degree, Software Engineering",
    org: "Iran's National University of Skill",
    start: "2019", // CV gives only "2019", read here as the graduation year
    end: "2019",
    bullets: [],
  },
];
