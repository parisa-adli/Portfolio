import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { CaseStudy } from "@/components/core/CaseStudy";
import { PrototypeSwitcher } from "@/components/core/PrototypeSwitcher";
import type { Proto } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

// Case study route (/<id>/work/[slug]): one shared template, styled by the prototype's layout (§5.2).
export function workRoute(id: Proto) {
  const base = `/${id}`;
  return {
    generateStaticParams: () => projects.map((p) => ({ slug: p.slug })),
    async generateMetadata({ params }: Params): Promise<Metadata> {
      const { slug } = await params;
      const p = projects.find((x) => x.slug === slug);
      if (!p) return {};
      return {
        title: `${p.title} — case study · Parisa Adli`,
        description: p.description,
        alternates: { canonical: `${base}/work/${p.slug}` },
      };
    },
    async Page({ params }: Params) {
      const { slug } = await params;
      const i = projects.findIndex((x) => x.slug === slug);
      if (i < 0) notFound();
      return (
        <>
          <CaseStudy project={projects[i]} index={i} next={projects[(i + 1) % projects.length]} base={base} />
          <PrototypeSwitcher current={id} />
        </>
      );
    },
  };
}
