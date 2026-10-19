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
import { ScrollDriverProvider } from "@/lib/scroll/useScrollDriver";

export const metadata: Metadata = {
  title: "Airtable Development — Paistudio",
  description: "Structured Airtable development built to be the operational backbone your team actually uses.",
};

// One of the 12 target pages — a tool page (SEC-07's own spec applies
// Tool Deep-Dive only to tool pages: Bubble, n8n, Softr, Airtable,
// Lovable, Claude AI — not offering pages; not built into any page yet).
// Hero/Why/Services/Process/FAQ content below is sourced verbatim (minus
// markdown emphasis markers, which these components render as plain
// text) from docs/page-content/final-airtable.md — real copy fetched
// from the live paistudio.co page, not generic filler. FAQ questions are
// the real ones from that page too; the source file left answers as
// "[PLACEHOLDER]" (the live page has no visible answers), so the answers
// here are newly written but grounded only in facts already established
// elsewhere on this page/site — no invented facts about Airtable's
// platform limits. BusinessImpactSection and QualificationSection aren't
// covered by the source file, so they're left as they were.
export default function AirtablePage() {
  return (
    <ScrollDriverProvider>
      <div className="relative w-full">
        <Nav theme="dark" chromeVariant="v2" />
        <main className="min-h-screen">
          <HeroSection
            eyebrow="Airtable"
            headline="Airtable Development for Structured Operational Data"
            subhead="Structured Airtable development built to be the operational backbone your team actually uses."
            trustBadges={[
              // Same real trust content used across the rest of this site
              // (src/components/Hero.tsx's stats row) — not page-specific
              // fabrication, this is genuinely true company-wide.
              { label: "Top Rated+ on Upwork" },
              { label: "2 weeks avg. first release" },
              { label: "50+ projects completed" },
            ]}
            cta={{ label: "Start Your Project", href: "#contact" }}
            // No matching real WorkGallery gallery for this tool page, and
            // no real screenshot lined up yet — hide the image row rather
            // than show an empty placeholder, on request.
            hideImages
          />

          <ValuePillarsSection
            pillars={[
              {
                title: "Real Relational Data",
                description: "Unlike a flat spreadsheet, Airtable development done right uses linked records and structured relationships.",
                previewLabel: "Linked records view",
                previewImage: { src: "/prismatic-icons/v2-airtable-1.png", alt: "Linked records view" },
              },
              {
                title: "Non-Technical Accessibility",
                description:
                  "One of the key advantages of working with us is a base your team can view, filter, and update without needing SQL.",
                previewLabel: "Filtered team view",
                previewImage: { src: "/prismatic-icons/v2-airtable-2.png", alt: "Filtered team view" },
              },
              {
                title: "Fast to Deploy, Fast to Change",
                description:
                  "As your operations evolve, structure matters. Our Airtable development approach means restructuring a base is far faster than migrating a traditional database.",
                previewLabel: "Base restructure diff",
                previewImage: { src: "/prismatic-icons/v2-airtable-3.png", alt: "Base restructure diff" },
              },
            ]}
          />

          <ServicesSection
            headline="Your Partner in Building With Airtable, Efficiently."
            tools={[
              {
                label: "Data Modeling & Base Architecture",
                description: "We design a relational base structure that holds up as your data grows.",
                image: { src: "/services/strategy.png", alt: "Key architectural decisions — data structure, access control, automation, API-first approach" },
              },
              {
                label: "Automation & Interface Build",
                description: "We build native Airtable automations and interfaces for your team.",
                image: { src: "/services/airtable.png", alt: "Airtable base interface — views, tabs, and automations" },
              },
              {
                label: "External Integration",
                description: "We connect Airtable to your other tools via API or automation platforms.",
                image: { src: "/services/integration.png", alt: "Integrations panel connecting your base to other tools" },
              },
              {
                label: "Structure Refinement",
                description: "We refactor and extend your base as your operational needs evolve.",
                image: { src: "/services/scales.png", alt: "System health dashboard — workflows, API calls, database size, and error rate" },
              },
            ]}
          />

          <ProcessSection
            headline="Our Process"
            subhead="From first build to ongoing support — here's what powers every Airtable base we ship."
            items={[
              {
                title: "Data & Relationship Mapping",
                description:
                  "We model your data and its relationships before building the base. This ensures your Airtable development reflects how your operations actually work.",
              },
              {
                title: "Base Architecture & Build",
                description:
                  "We design tables, views, and permission structure, then build the base and configure native automations.",
              },
              {
                title: "Refine & Extend",
                description: "We adjust the structure as your data and processes grow.",
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
            headline="Is Airtable the right fit for your project?"
            intro="Not every project needs a custom database — here's how to tell if Airtable is the right match before we talk."
            goodFitHeader="We're a Great Fit If"
            goodFit={[
              "You need a flexible data backend fast, not a custom database",
              "You want a spreadsheet-simple interface your team can actually use",
              "You need to launch in weeks, not months",
              "You want ongoing support after launch, not a one-and-done build",
            ]}
            notGoodFitHeader="Not the Right Fit If"
            notGoodFit={[
              "You need to handle data at a scale Airtable's row limits can't support",
              "You need complex relational logic a spreadsheet-database hybrid can't model well",
              "You want the cheapest possible option over quality",
              "You're not ready to commit to a clear product scope",
            ]}
          />

          <FaqSection
            headline="Questions about Airtable development"
            faqs={[
              {
                question: "What is Airtable development?",
                answer:
                  "It's building a real operational backend on Airtable — relational base architecture, native automations and interfaces, and external integrations — rather than treating it as a plain spreadsheet.",
              },
              {
                question: "Can Airtable handle large datasets?",
                answer:
                  "Airtable is built for structured operational data rather than big-data scale, and its record limits vary by plan — we'll size a base against your actual data volume during scoping so it fits comfortably, and flag it early if a project would outgrow it.",
              },
              {
                question: "Can Airtable integrate with automation tools like n8n?",
                answer:
                  "Yes — Airtable connects cleanly to automation platforms and other tools via API, which is exactly how we handle external integration work on top of a base.",
              },
              {
                question: "Do you migrate existing spreadsheets into Airtable?",
                answer:
                  "Yes — we model your existing spreadsheet data into a proper relational structure (linked records instead of flat rows) as part of base architecture, not just an import.",
              },
              {
                question: "Do you provide ongoing support for Airtable bases?",
                answer:
                  "Yes — we refine and extend the base as your operational needs evolve rather than treating launch as the finish line.",
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
