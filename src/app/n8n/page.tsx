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
  title: "n8n Automation — Paistudio",
  description: "Scalable n8n automation built for real business workflows.",
};

// One of the 12 target pages — a tool page (SEC-07's own spec applies
// Tool Deep-Dive only to tool pages: Bubble, n8n, Softr, Airtable,
// Lovable, Claude AI — not offering pages; not built into any page yet).
// Hero/Why/Services/Process/FAQ content below is sourced verbatim (minus
// markdown emphasis markers, which these components render as plain
// text) from docs/page-content/final-n8n.md — real copy fetched from
// the live paistudio.co page, not generic filler. That file's own notes:
// the live page actually ships 4 "why" pillars/4 process steps
// (condensed to 3/3 here per this project's fixed-count section specs —
// see its condensing-choice notes), and separately flags a real
// copy-paste bug on the live page (its "why" intro wrongly said
// "Framer development services") which this rewrite does not carry
// over. FAQ questions are the real ones from that page too; the source
// file left answers as "[PLACEHOLDER]" (the live page has no visible
// answers), so the answers here are newly written but grounded only in
// facts already established elsewhere on this page/site.
// BusinessImpactSection and QualificationSection aren't covered by the
// source file, so they're left as they were.
export default function N8nPage() {
  return (
    <ScrollDriverProvider>
      <div className="relative w-full">
        <Nav theme="dark" chromeVariant="v2" />
        <main className="min-h-screen">
          <HeroSection
            eyebrow="n8n"
            headline="N8N Automation for Scalable AI & Business Workflows"
            subhead="Scalable n8n automation built for real business workflows."
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
                title: "Advanced Workflow Logic",
                description:
                  "Unlike basic trigger-based tools, n8n automation supports multi-step workflows, conditional branching, looping, and custom scripting.",
                previewLabel: "Conditional branch editor",
              },
              {
                title: "Self-Hosted & Secure Infrastructure",
                description:
                  "One of the key advantages of n8n automation is deployment flexibility — self-host for full control over data security, performance, and compliance.",
                previewLabel: "Self-hosted deployment diagram",
              },
              {
                title: "AI-Powered Workflows",
                description:
                  "Modern operations demand intelligent systems. n8n automation integrates directly with AI services and APIs for smart routing, content generation, and data handling.",
                previewLabel: "AI routing workflow",
              },
            ]}
          />

          <ServicesSection
            headline="Your Partner in Automating With n8n, Efficiently."
            tools={[
              {
                label: "Strategy & Workflow Design",
                description: "We map your operations and identify high-impact automation opportunities before building any workflow.",
                image: { src: "/services/mpmapping.png", alt: "Process flow map — ordered steps in a current operation" },
              },
              {
                label: "Custom Workflow Development",
                description: "We build advanced n8n automation workflows using modular logic, API integrations, and structured error handling.",
                image: { src: "/services/custom-workflow.png", alt: "n8n workflow canvas — trigger, data, and AI transform steps" },
              },
              {
                label: "AI & System Integration",
                description:
                  "From AI-powered routing to automated content processing, we integrate intelligent systems directly into your automation environment.",
                image: { src: "/services/integration.png", alt: "Integrations panel connecting AI services to your automation environment" },
              },
              {
                label: "Optimization & Expansion",
                description:
                  "As your business grows, we continuously refine and expand your n8n automation infrastructure to maintain stability and scalability.",
                image: { src: "/services/scales.png", alt: "System health dashboard — workflows, API calls, database size, and error rate" },
              },
            ]}
          />

          <ProcessSection
            headline="Our Process"
            subhead="From first build to ongoing support — here's what powers every automation we ship."
            items={[
              {
                title: "Workflow Audit & Opportunity Mapping",
                description:
                  "We analyze your existing processes, identify repetitive tasks, and uncover automation opportunities with the highest operational impact.",
              },
              {
                title: "Architecture & Implementation",
                description:
                  "We define logic structures, system integrations, and modular components — then develop custom n8n automation workflows, integrate APIs, configure error handling, and test reliability across environments.",
              },
              {
                title: "Optimization & Expansion",
                description:
                  "Automation is not static. We continuously refine and expand your n8n automation system as operations grow and complexity increases.",
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
            headline="Is n8n the right fit for automating your ops?"
            intro="Not every automation needs a full workflow engine — here's how to tell if n8n is the right match before we talk."
            goodFitHeader="We're a Great Fit If"
            goodFit={[
              "You need production-ready automations, not just a proof of concept",
              "You want an open-source tool with no vendor lock-in",
              "You need to launch in weeks, not months",
              "You want ongoing support after launch, not a one-and-done build",
            ]}
            notGoodFitHeader="Not the Right Fit If"
            notGoodFit={[
              "You need automations only a fully custom backend can support",
              "You just need a one-off script, not an ongoing automated workflow",
              "You want the cheapest possible option over quality",
              "You're not ready to commit to a clear scope of what should be automated",
            ]}
          />

          <FaqSection
            headline="Questions about n8n automation"
            faqs={[
              {
                question: "What is n8n automation?",
                answer:
                  "It's building multi-step, production-grade workflows on n8n — conditional branching, looping, custom scripting, and API integrations — rather than simple one-trigger-to-one-action zaps.",
              },
              {
                question: "Why choose n8n automation over other tools?",
                answer:
                  "n8n supports genuinely advanced workflow logic and can be self-hosted for full control over data security, performance, and compliance — advantages that matter once automations get more complex than basic triggers.",
              },
              {
                question: "Can n8n automation be self-hosted?",
                answer:
                  "Yes — self-hosting is one of n8n's core deployment options, giving you full control over data security, performance, and compliance rather than relying solely on a hosted instance.",
              },
              {
                question: "Can n8n automation integrate with AI tools?",
                answer:
                  "Yes — n8n integrates directly with AI services and APIs for smart routing, content generation, and data handling, which is exactly the kind of AI & system integration work we build in.",
              },
              {
                question: "Do you provide ongoing support for n8n automation systems?",
                answer:
                  "Yes — we continuously refine and expand your n8n infrastructure as operations grow and complexity increases, rather than treating launch as the finish line.",
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
