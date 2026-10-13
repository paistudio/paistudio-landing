import type { Metadata } from "next";
import { FinalCtaFooter } from "@/components/FinalCtaFooter";
import { FooterUncover } from "@/components/FooterUncover";
import { Nav } from "@/components/nav/Nav";
import { BusinessImpactSection } from "@/components/sections/BusinessImpactSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { QualificationSection } from "@/components/sections/QualificationSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ValuePillarsSection } from "@/components/sections/ValuePillarsSection";
import { getGalleryImages } from "@/lib/data/projects";
import { ScrollDriverProvider } from "@/lib/scroll/useScrollDriver";

export const metadata: Metadata = {
  title: "Internal Tools Development — Paistudio",
  description:
    "Structured internal tools development built to replace spreadsheets and workarounds with something your team actually uses.",
};

// One of the 12 offering/tool pages the section library (SEC-01–SEC-10,
// src/components/sections/) is meant to eventually assemble. Hero/Why/
// Services/Process/FAQ content below is sourced verbatim (minus markdown
// emphasis markers, which these components render as plain text) from
// docs/page-content/final-internal-tools-development.md — real copy
// fetched from the live paistudio.co page, not generic filler. FAQ
// questions are the real ones from that page too; the source file left
// answers as "[PLACEHOLDER]" (the live page has no visible answers), so
// the answers here are newly written but grounded only in facts already
// established elsewhere on this page/site — no invented case studies or
// metrics. BusinessImpactSection and QualificationSection aren't covered
// by the source file, so they're left as they were.
export default function InternalToolsDevelopmentPage() {
  return (
    <ScrollDriverProvider>
      <div className="relative w-full">
        <Nav theme="dark" chromeVariant="v2" />
        <main className="min-h-screen">
          <HeroSection
            eyebrow="Internal Tools Development"
            headline="Internal Tools Built Around How Your Team Actually Works"
            subhead="Structured internal tools development built to replace spreadsheets and workarounds with something your team actually uses."
            trustBadges={[
              // Same real trust content used across the rest of this site
              // (src/components/Hero.tsx's stats row) — not page-specific
              // fabrication, this is genuinely true company-wide.
              { label: "Top Rated+ on Upwork" },
              { label: "2 weeks avg. first release" },
              { label: "50+ projects completed" },
            ]}
            cta={{ label: "Start Your Project", href: "#contact" }}
            // Same real images as the homepage's "Internal Tools"
            // WorkGallery card, on request ("gunakan gambar yg dipake
            // sesuai di work gallery").
            images={getGalleryImages("internal-tools")}
          />

          <ValuePillarsSection
            pillars={[
              {
                title: "Built Around Your Workflow",
                description: "Unlike generic SaaS tools, internal tools development done right adapts to your process, not the other way around.",
                previewLabel: "Custom workflow layout",
                previewImage: { src: "/prismatic-icons/v2-internal-1.png", alt: "Custom workflow layout" },
              },
              {
                title: "Direct Data Integration",
                description:
                  "One of the key advantages of working with us is pulling directly from your existing databases — no manual re-entry.",
                previewLabel: "Live database connection",
                previewImage: { src: "/prismatic-icons/v2-internal-2.png", alt: "Live database connection" },
              },
              {
                title: "Low Long-Term Overhead",
                description:
                  "As your team grows, structure matters. Our internal tools development approach is built to be maintained by a small team, not a dedicated engineering org.",
                previewLabel: "Maintenance checklist",
                previewImage: { src: "/prismatic-icons/v2-internal-3.png", alt: "Maintenance checklist" },
              },
            ]}
          />

          <ServicesSection
            headline="Your Partner in Building Internal Tools, Efficiently."
            tools={[
              {
                label: "Workflow & Requirements Mapping",
                description: "We understand how your team actually works before designing anything.",
                image: { src: "/services/mpmapping.png", alt: "Process flow map — ordered steps in a real team workflow" },
              },
              {
                label: "Tool Development",
                description: "We build dashboards, admin panels, or ops tools tailored to your process.",
                image: { src: "/services/fullstack.png", alt: "Full-stack app editor — data, workflows, and pages in one interface" },
              },
              {
                label: "Data & System Integration",
                description: "We connect your tool directly to existing databases and services.",
                image: { src: "/services/scales.png", alt: "System health dashboard — workflows, API calls, database size, and error rate" },
              },
              {
                label: "Iteration & Expansion",
                description: "We extend your tool as your internal processes evolve.",
                image: { src: "/services/scales.png", alt: "System health dashboard — workflows, API calls, database size, and error rate" },
              },
            ]}
          />

          <ProcessSection
            headline="Our Process"
            subhead="From first build to ongoing support — here's what powers every internal tool we ship."
            items={[
              {
                title: "Workflow Mapping",
                description:
                  "We map the actual day-to-day process the tool needs to support. This ensures your internal tools development solves the real problem, not an assumed one.",
              },
              {
                title: "Design & Build",
                description:
                  "We design the interface and access model, then build and connect it to your existing data sources.",
              },
              {
                title: "Roll Out & Refine",
                description: "We deploy internally and adjust the tool based on real team usage.",
              },
            ]}
          />

          <BusinessImpactSection
            headline="The Real Business Impact of a Dedicated Product Team"
            intro="Speed isn't just a feature — it's operational leverage. Less time spent managing hiring, tooling, and handoffs means more of your budget goes toward shipping product that actually moves the business forward."
            benefits={[
              {
                icon: "speed",
                text: "Live in weeks, not months",
                description: "Most first releases ship in about 2 weeks from kickoff.",
              },
              {
                icon: "efficiency",
                text: "No in-house dev team needed",
                description: "Skip the hiring, tooling, and management overhead of building one.",
              },
              {
                icon: "accuracy",
                text: "Fewer bugs after launch",
                description: "Ongoing support catches issues before they reach your users.",
              },
            ]}
          />

          <QualificationSection
            headline="Is Paistudio the right fit for your internal tool?"
            intro="Not every project needs a dedicated Bubble team — here's how to tell if this is the right match before we talk."
            goodFitHeader="We're a Great Fit If"
            goodFit={[
              "You need a production-ready internal tool built on Bubble, not just a spreadsheet",
              "You want a dedicated team, not a rotating cast of freelancers",
              "You need to launch in weeks, not months",
              "You want ongoing support after launch, not a one-and-done build",
            ]}
            notGoodFitHeader="Not the Right Fit If"
            notGoodFit={[
              "You need a fully custom backend outside what Bubble can support",
              "You just need a shared spreadsheet, not a real internal tool",
              "You want the cheapest possible option over quality",
              "You're not ready to commit to a clear product scope",
            ]}
          />

          <FaqSection
            headline="Questions about internal tools development"
            faqs={[
              {
                question: "What is internal tools development?",
                answer:
                  "It's building dashboards, admin panels, or ops tools around how your team actually works — mapped to your real workflow and connected to your existing data, rather than a generic off-the-shelf tool you have to adapt to.",
              },
              {
                question: "Can you build on top of our existing database?",
                answer:
                  "Yes — direct integration with your existing databases and services is core to how we build, so your team isn't re-entering data that already lives somewhere else.",
              },
              {
                question: "Do you use no-code tools or custom code for internal tools?",
                answer:
                  "We choose whichever is right sized for the tool — no-code/low-code platforms for most internal tools, custom code where the requirements genuinely need it, rather than defaulting to one approach regardless of fit.",
              },
              {
                question: "How do you handle role-based permissions?",
                answer:
                  "Access levels are part of the design phase, not an afterthought — we define who sees and can edit what before the interface gets built.",
              },
              {
                question: "Do you provide ongoing support after launch?",
                answer:
                  "Yes — we adjust the tool based on real team usage after rollout rather than treating launch as the finish line.",
              },
            ]}
          />
        </main>
        <FooterUncover>
          <FinalCtaFooter />
        </FooterUncover>
      </div>
    </ScrollDriverProvider>
  );
}
