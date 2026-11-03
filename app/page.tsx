import { Suspense } from "react";
import { PointerFX } from "@/components/core/PointerFX";
import { MotionProvider } from "@/components/core/MotionProvider";
import { Nav } from "@/components/core/Nav";
import { Hero } from "@/components/core/sections/Hero";
import { Projects } from "@/components/core/sections/Projects";
import { Skills } from "@/components/core/sections/Skills";
import { About } from "@/components/core/sections/About";
import { Experience } from "@/components/core/sections/Experience";
import { Contact } from "@/components/core/sections/Contact";
import { Marquee } from "@/components/core/Marquee";
import { Footer } from "@/components/core/Footer";
import { CommandMenu } from "@/components/core/CommandMenu";
import { InView } from "@/components/core/InView";
import { Reveal } from "@/components/core/Reveal";
import { Toaster } from "@/components/core/Toast";
import { profile } from "@/content/profile";

export default function Home() {
  return (
    <>
      <MotionProvider />
      <PointerFX />
      <Nav brand={profile.name} />
      <main id="main">
        <Hero />
        {/* Each Suspense boundary hydrates as its own task, so hydration isn't one long block. */}
        <Suspense><Marquee /></Suspense>
        <Suspense><Projects /></Suspense>
        <Suspense><Skills /></Suspense>
        <Suspense><Marquee /></Suspense>
        <Suspense><About /></Suspense>
        <Suspense><Experience /></Suspense>
        <Suspense><Contact /></Suspense>
      </main>
      <Footer />
      <CommandMenu />
      <Toaster />
      <InView />
      <Reveal />
    </>
  );
}
