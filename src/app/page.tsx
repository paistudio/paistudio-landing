import { CtaSection } from "@/components/CtaSection";
import { FinalCtaFooter } from "@/components/FinalCtaFooter";
import { FixedBackground } from "@/components/FixedBackground";
import { FooterUncover } from "@/components/FooterUncover";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/nav/Nav";
import { Pricing } from "@/components/Pricing";
import { ProgressRail } from "@/components/ProgressRail";
import { Testimonials } from "@/components/Testimonials";
import { WorkGallery } from "@/components/WorkGallery";
import { ScrollDriverProvider } from "@/lib/scroll/useScrollDriver";
import { getWorkProjects } from "@/lib/data/work-projects";

export default async function Home() {
  // Falls back to WorkGallery's own static per-category gallery when this
  // fails — e.g. a CMS schema migration (like `is_visible`) landed in code
  // before actually being run against the database. The homepage must
  // never 500 over that; a stale/placeholder gallery is an acceptable
  // degradation, a broken homepage isn't.
  let projects: Awaited<ReturnType<typeof getWorkProjects>> = [];
  try {
    projects = await getWorkProjects();
  } catch (error) {
    console.error("Home: getWorkProjects failed, falling back to static gallery", error);
  }

  return (
    <ScrollDriverProvider workBgHex="#A8D6E5">
      <div className="relative w-full bg-ink text-text">
        <FixedBackground />
        <Nav chromeVariant="v2" />
        <ProgressRail />
        <Hero />
        <WorkGallery bgHex="#A8D6E5" lightBg projects={projects} />
        <CtaSection />
        <Testimonials />
        <Pricing />
        <FooterUncover>
          <FinalCtaFooter />
        </FooterUncover>
      </div>
    </ScrollDriverProvider>
  );
}
