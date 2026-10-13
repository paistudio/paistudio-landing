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
  title: "Softr Development — Paistudio",
  description: "Structured Softr development built to turn your existing data into a polished, permissioned front end — fast.",
};

// One of the 12 target pages — a tool page (SEC-07's own spec applies
// Tool Deep-Dive only to tool pages: Bubble, n8n, Softr, Airtable,
// Lovable, Claude AI — not offering pages; not built into any page yet).
// Hero/Why/Services/Process/FAQ content below is sourced verbatim (minus
// markdown emphasis markers, which these components render as plain
// text) from docs/page-content/final-softr.md — real copy fetched from
// the live paistudio.co page, not generic filler. FAQ questions are the
// real ones from that page too; the source file left answers as
// "[PLACEHOLDER]" (the live page has no visible answers), so the answers
// here are newly written but grounded only in facts already established
// elsewhere on this page/site — no invented facts about Softr's platform
// capabilities. BusinessImpactSection and QualificationSection aren't
// covered by the source file, so they're left as they were.
export default function SoftrPage() {
  return (
    <ScrollDriverProvider>
      <div className="relative w-full">
        <Nav theme="dark" chromeVariant="v2" />
        <main className="min-h-screen">
          <HeroSection
            eyebrow="Softr"
            headline="Softr Development for Fast, Data-Driven Client Portals"
            subhead="Structured Softr development built to turn your existing data into a polished, permissioned front end — fast."
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
                title: "Fast Front-End Delivery",
                description:
                  "Unlike full custom builds, Softr development done right ships a polished interface on your existing data in days, not months.",
                previewLabel: "Portal launch timeline",
              },
              {
                title: "Native Airtable & Sheets Integration",
                description:
                  "One of the key advantages of working with us is building directly on data you likely already have — no migration required.",
                previewLabel: "Connected data source",
              },
              {
                title: "Built-In Access Control",
                description:
                  "As your user base grows, structure matters. Our Softr development approach handles permissions and gated content natively.",
                previewLabel: "Permission level list",
              },
            ]}
          />

          <ServicesSection
            headline="Your Partner in Building With Softr, Efficiently."
            tools={[
              {
                label: "Data Source & Access Planning",
                description: "We structure your Airtable or Sheets data and define user permission levels.",
                image: { src: "/services/strategy.png", alt: "Key architectural decisions — data structure, access control, automation, API-first approach" },
              },
              {
                label: "Portal & Interface Build",
                description: "We build your client portal, directory, or dashboard interface.",
                image: { src: "/services/softr-automation.png", alt: "Softr site editor — portal layout and pages" },
              },
              {
                label: "Integration & Automation",
                description: "We connect Softr to your other tools and automate data flow.",
                image: { src: "/services/integration.png", alt: "Integrations panel connecting Softr to your other tools" },
              },
              {
                label: "Refinement & Expansion",
                description: "We extend your portal as user needs grow.",
                image: { src: "/services/scales.png", alt: "System health dashboard — workflows, API calls, database size, and error rate" },
              },
            ]}
          />

          <ProcessSection
            headline="Our Process"
            subhead="From first build to ongoing support — here's what powers every Softr app we ship."
            items={[
              {
                title: "Data & Access Mapping",
                description:
                  "We structure your underlying data source and define who sees what. This ensures your Softr development starts from a clean data foundation, not a patched-together one.",
              },
              {
                title: "Interface Design & Build",
                description: "We design and build the portal or directory layout, connected to your live data source.",
              },
              {
                title: "Refine & Extend",
                description: "We adjust the portal based on real user feedback as your needs evolve.",
              },
            ]}
          />

          <BusinessImpactSection
            headline="The Real Business Impact of a Dedicated Product Team"
            intro="Speed isn't just a feature — it's operational leverage. Less time spent managing hiring, tooling, and handoffs means more of your budget goes toward shipping product that actually moves the business forward."
            benefits={[
              {
                icon: "speed",
                text: "Live in days, not weeks",
                description: "Most Softr builds ship fast since there's no separate backend to build from scratch.",
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
            headline="Is Softr the right fit for your project?"
            intro="Not every project needs a full custom app — here's how to tell if Softr is the right match before we talk."
            goodFitHeader="We're a Great Fit If"
            goodFit={[
              "You need a client portal, directory, or internal tool live fast",
              "You already have (or want) Airtable as your data backend",
              "You need to launch in days, not weeks",
              "You want ongoing support after launch, not a one-and-done build",
            ]}
            notGoodFitHeader="Not the Right Fit If"
            notGoodFit={[
              "You need complex custom logic a no-code app layer can't support",
              "You need a public-facing consumer app at large scale",
              "You want the cheapest possible option over quality",
              "You're not ready to commit to a clear product scope",
            ]}
          />

          <FaqSection
            headline="Questions about Softr development"
            faqs={[
              {
                question: "What is Softr development?",
                answer:
                  "It's building a polished, permissioned front end on top of data you likely already have — a client portal, directory, or dashboard — rather than a raw spreadsheet view or a full custom app built from scratch.",
              },
              {
                question: "Does Softr require Airtable, or can it use other data sources?",
                answer:
                  "Softr natively integrates with both Airtable and Google Sheets, so it can build on whichever one your data already lives in without requiring a migration.",
              },
              {
                question: "How does Softr handle user permissions?",
                answer:
                  "Access control and gated content are handled natively — we define user permission levels during data and access planning, before the interface gets built.",
              },
              {
                question: "Can Softr sites be white-labeled?",
                answer:
                  "Softr supports custom domains and branding for your portal — we can confirm the exact white-labeling options available on your plan before you commit.",
              },
              {
                question: "Do you provide ongoing support for Softr sites?",
                answer:
                  "Yes — we extend the portal as user needs grow rather than treating initial launch as the finish line.",
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
