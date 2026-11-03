import type { Metadata } from "next";
import "./globals.css";
import { ThemeA } from "@/themes/a/ThemeA";
import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";

const title = `${profile.name} — ${profile.headline}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description: profile.positioning,
  alternates: { canonical: "/" },
  openGraph: { type: "website", title, description: profile.positioning, url: "/", siteName: profile.name },
  twitter: { card: "summary_large_image", title, description: profile.positioning },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.headline,
  description: profile.positioning,
  url: SITE_URL,
  email: `mailto:${profile.email}`,
  sameAs: profile.links.map((l) => l.href),
  knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "Express", "MongoDB"],
  alumniOf: profile.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeA>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
          {children}
        </ThemeA>
      </body>
    </html>
  );
}
