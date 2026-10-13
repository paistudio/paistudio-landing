"use client";

import { CtaSection } from "@/components/CtaSection";
import { FinalCtaFooter } from "@/components/FinalCtaFooter";
import { FixedBackground } from "@/components/FixedBackground";
import { FooterUncover } from "@/components/FooterUncover";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/nav/Nav";
import { Pricing } from "@/components/Pricing";
import { ProgressRail } from "@/components/ProgressRail";
import { ServicesAccordion } from "@/components/ServicesAccordion";
import { SelectedWork } from "@/components/SelectedWork";
import { SelectedWorkV3 } from "@/components/SelectedWorkV3";
import { Testimonials } from "@/components/Testimonials";
import { WorkGallery } from "@/components/WorkGallery";
import { ScrollDriverProvider } from "@/lib/scroll/useScrollDriver";

export default function HomePlayground() {
  return (
    <ScrollDriverProvider workBgHex="#A8D6E5">
      <div className="relative w-full bg-ink text-text">
        <FixedBackground />
        <Nav chromeVariant="v2" />
        <ProgressRail />
        <Hero />
        <WorkGallery bgHex="#A8D6E5" lightBg showBrandLogos />
        <SelectedWork />
        <SelectedWorkV3 />
        <ServicesAccordion
          id="our-work-v4"
          services={[
            {
              id: "discovery",
              title: "Discovery & Scoping",
              description:
                "We map requirements and technical constraints before writing a single line of code, so the build matches the real problem.",
              image: { src: "/work-gallery/ai-2-lawservice-contract-details.png", alt: "Discovery and scoping" },
            },
            {
              id: "design",
              title: "Design & Architecture",
              description:
                "Clean data models and interface flows, planned together so the product scales without a rewrite later.",
              image: { src: "/work-gallery/mp-2-aedigo-mp.png", alt: "Design and architecture" },
            },
            {
              id: "development",
              title: "Development & QA",
              description:
                "Features ship in small, reviewed increments with automated checks catching regressions before they reach users.",
              image: { src: "/work-gallery/internal-tools-5-dispro.png", alt: "Development and QA" },
            },
            {
              id: "launch",
              title: "Launch & Support",
              description: "We monitor real usage after launch and keep refining the product as your operations grow.",
              image: { src: "/work-gallery/saas-3-qrafter-orders.png", alt: "Launch and support" },
            },
          ]}
        />
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
