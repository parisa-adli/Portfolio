import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { SITE_URL, type Proto } from "@/lib/site";

const title = `${profile.name} — ${profile.headline}`;

// Shared <head> data for a prototype root (§9 meta). The OG image comes from app/<id>/opengraph-image.tsx.
export function protoMetadata(id: Proto): Metadata {
  return {
    title,
    description: profile.positioning,
    alternates: { canonical: `/${id}` },
    openGraph: { type: "website", title, description: profile.positioning, url: `/${id}`, siteName: profile.name },
    twitter: { card: "summary_large_image", title, description: profile.positioning },
  };
}

export function PersonLd({ id }: { id: Proto }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.headline,
    description: profile.positioning,
    url: `${SITE_URL}/${id}`,
    email: `mailto:${profile.email}`,
    sameAs: profile.links.map((l) => l.href),
    knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "Express", "MongoDB"],
    alumniOf: profile.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />;
}
