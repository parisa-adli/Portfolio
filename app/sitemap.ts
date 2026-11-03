import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { PROTOS, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PROTOS.flatMap((id) => [
    { url: `${SITE_URL}/${id}`, priority: 1 },
    ...projects.map((p) => ({ url: `${SITE_URL}/${id}/work/${p.slug}`, priority: 0.7 })),
  ]);
}
