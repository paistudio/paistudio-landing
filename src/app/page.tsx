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

// Reverted to the static per-category gallery for now (on request) — see
// WorkGallery's own `projects` prop for the CMS-driven path this used to
// take; re-wire `getWorkProjects()` back in here when that's wanted again.
export default function Home() {
  return (
    <ScrollDriverProvider workBgHex="#09162f">
      <div className="relative w-full bg-ink text-text">
        <FixedBackground />
        <Nav chromeVariant="v2" />
        <ProgressRail />
        <Hero />
        <WorkGallery bgHex="#09162f" />
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
