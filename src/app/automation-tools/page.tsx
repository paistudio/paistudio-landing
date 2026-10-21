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
  title: "Automation Tools — Paistudio",
  description: "Structured workflow automation built for real operations — not just connected triggers.",
};

// One of the 12 offering/tool pages the section library (SEC-01–SEC-10,
// src/components/sections/) is meant to eventually assemble. Hero/Why/
// Services/Process/FAQ content below is sourced verbatim (minus markdown
// emphasis markers, which these components render as plain text) from
// docs/page-content/final-automation-tools.md — real copy fetched from
// the live paistudio.co page, not generic filler. Per that file's own
// note, this offering is deliberately platform-agnostic (n8n, Make,
// Zapier, custom) — distinct from the dedicated /n8n tool page — so it
// stays general rather than n8n-specific, avoiding duplicate content
// between the two pages. FAQ questions are the real ones from that page
// too; the source file left answers as "[PLACEHOLDER]" (the live page
// has no visible answers), so the answers here are newly written but
// grounded only in facts already established elsewhere on this
// page/site. BusinessImpactSection and QualificationSection aren't
// covered by the source file, so they're left as they were.
export default function AutomationToolsPage() {
  return (
    <ScrollDriverProvider>
      <div className="relative w-full">
        <Nav theme="dark" chromeVariant="v2" />
        <main className="min-h-screen">
          <HeroSection
            eyebrow="Automation Tools"
            headline="Automation Tools Built Around Your Actual Workflow"
            subhead="Structured workflow automation built for real operations — not just connected triggers."
            trustBadges={[
              // Same real trust content used across the rest of this site
              // (src/components/Hero.tsx's stats row) — not page-specific
              // fabrication, this is genuinely true company-wide.
              { label: "Top Rated+ on Upwork" },
              { label: "2 weeks avg. first release" },
              { label: "50+ projects completed" },
            ]}
            cta={{ label: "Start Your Project", href: "#contact" }}
            // Same real images as the homepage's "Automations" WorkGallery
            // card, on request ("gunakan gambar yg dipake sesuai di work
            // gallery").
            images={getGalleryImages("automations")}
          />

          <ValuePillarsSection
            pillars={[
              {
                title: "Platform-Agnostic Selection",
                description:
                  "Unlike agencies locked into one tool, automation tools done right start with your requirements, not a preferred platform.",
                previewLabel: "Platform comparison matrix",
                previewImage: { src: "/prismatic-icons/v2-automation-1.png", alt: "Platform comparison matrix" },
              },
              {
                title: "Complex Logic Handled Properly",
                description:
                  "One of the key advantages of working with us is conditional branching, error handling, and retries built correctly — not left to default behavior.",
                previewLabel: "Branching workflow diagram",
                previewImage: { src: "/prismatic-icons/v2-automation-2.png", alt: "Branching workflow diagram" },
              },
              {
                title: "Maintainable by Design",
                description:
                  "As your operations grow, structure matters. Our automation tools approach is documented and modular, so a future team member can actually understand it.",
                previewLabel: "Documented workflow map",
                previewImage: { src: "/prismatic-icons/v2-automation-3.png", alt: "Documented workflow map" },
              },
            ]}
          />

          <ServicesSection
            headline="Your Partner in Automating Your Operations, Efficiently."
            tools={[
              {
                label: "Automation Audit",
                description: "We identify which manual processes are actually worth automating.",
                image: { src: "/services/mpmapping.png", alt: "Process flow map — ordered steps in a current workflow" },
              },
              {
                label: "Platform Selection & Architecture",
                description: "We choose and design the right automation platform and structure for your needs.",
                image: { src: "/services/strategy.png", alt: "Key architectural decisions — data structure, access control, automation, API-first approach" },
              },
              {
                label: "Workflow Build & Integration",
                description: "We build your automations and connect them to your existing systems.",
                image: { src: "/services/custom-workflow.png", alt: "Automation workflow — trigger, data, and AI transform steps" },
              },
              {
                label: "Monitoring & Refinement",
                description: "We monitor for failures and refine your workflows as your processes change.",
                image: { src: "/services/scales.png", alt: "System health dashboard — workflows, API calls, database size, and error rate" },
              },
            ]}
          />

          <ProcessSection
            headline="Our Process"
            subhead="From first build to ongoing support — here's what powers every automation we ship."
            items={[
              {
                title: "Audit & Opportunity Mapping",
                description:
                  "We review your current processes and rank automation opportunities by impact. This ensures your automation tools investment goes where it actually matters.",
                // Overrides ProcessSection's default step-1 image with an
                // opportunity/impact ranking view, a better match for an
                // audit step than the generic scoping-checklist default —
                // on request.
                image: { src: "/process/process-e.png", alt: "Automation opportunity ranking by impact" },
              },
              {
                title: "Platform & Architecture Design",
                description: "We choose the right tool and define the logic structure before building anything.",
              },
              {
                title: "Build, Integrate & Expand",
                description:
                  "We implement your workflows with proper error handling, then monitor and extend them as your operations grow.",
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
            headline="Is Paistudio the right fit for automating your ops?"
            intro="Not every project needs a dedicated automation team — here's how to tell if this is the right match before we talk."
            goodFitHeader="We're a Great Fit If"
            goodFit={[
              "You need production-ready automations, not just a proof of concept",
              "You want a dedicated team, not a rotating cast of freelancers",
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
            headline="Questions about automation tools"
            faqs={[
              {
                question: "What automation tools do you work with?",
                answer:
                  "We're platform-agnostic — n8n, Make, Zapier, or a fully custom build, chosen based on your requirements rather than a preferred platform we default to for every project.",
              },
              {
                question: "How do you decide which automation platform to use?",
                answer:
                  "It starts with an audit of what's actually worth automating, then platform selection driven by your existing systems, complexity, and budget — not by which tool we'd rather build in.",
              },
              {
                question: "Can you work with our existing Zapier/Make setup?",
                answer:
                  "Yes — we can extend or refine an existing setup rather than requiring a rebuild from scratch, and we'll tell you honestly if the current platform is the wrong fit going forward.",
              },
              {
                question: "How do you handle errors in automated workflows?",
                answer:
                  "Conditional branching, error handling, and retries are built in deliberately rather than left to a platform's default behavior, so a failed step doesn't silently break the rest of the workflow.",
              },
              {
                question: "Do you provide ongoing support for automation systems?",
                answer:
                  "Yes — we monitor for failures and refine workflows as your processes change, rather than treating launch as the end of the engagement.",
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
