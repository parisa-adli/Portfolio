import { projects } from "@/content/projects";
import { SectionHeader } from "../SectionHeader";
import { ProjectCard } from "../ProjectCard";
import { CardFX } from "../CardFX";

const GITHUB = "https://github.com/parisa-adli?tab=repositories";

// §5.2: top 3 featured full-width (alternating), the rest as a 2-col compact grid.
export function Projects({ base }: { base: string }) {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  return (
    <section id="work" className="section container-x cv-auto" aria-labelledby="work-title">
      <SectionHeader
        index="02"
        file="~/parisa/projects"
        id="work-title"
        title="Selected work"
        aside={
          <a href={GITHUB} className="text-link" target="_blank" rel="noopener noreferrer" data-cursor="open">
            All repos <span aria-hidden="true">↗</span>
          </a>
        }
      />
      <div className="projects">
        {featured.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} variant="featured" flip={i % 2 === 1} base={base} />
        ))}
        <div className="projects__grid">
          {rest.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={featured.length + i} variant="compact" base={base} />
          ))}
        </div>
      </div>
      <CardFX />
    </section>
  );
}
