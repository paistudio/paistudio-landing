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
  title: "Lovable Development — Paistudio",
  description:
    "Structured Lovable development built to turn AI-generated scaffolding into a real, maintainable product.",
};

// One of the 12 target pages — a tool page (SEC-07's own spec applies
// Tool Deep-Dive only to tool pages: Bubble, n8n, Softr, Airtable,
// Lovable, Claude AI — not offering pages; not built into any page yet).
// Hero/Why/Services/Process/FAQ content below is sourced verbatim (minus
// markdown emphasis markers, which these components render as plain
// text) from docs/page-content/final-lovable.md — real copy fetched
// from the live paistudio.co page, not generic filler. FAQ questions are
// the real ones from that page too; the source file left answers as
// "[PLACEHOLDER]" (the live page has no visible answers), so the answers
// here are newly written but grounded only in facts already established
// elsewhere on this page/site — no invented facts about Lovable's
// platform terms. BusinessImpactSection and QualificationSection aren't
// covered by the source file, so they're left as they were.
export default function LovablePage() {
  return (
    <ScrollDriverProvider>
      <div className="relative w-full">
        <Nav theme="dark" chromeVariant="v2" />
        <main className="min-h-screen">
          <HeroSection
            eyebrow="Lovable"
            headline="Lovable Development From Idea to Working Prototype, Fast"
            subhead="Structured Lovable development built to turn AI-generated scaffolding into a real, maintainable product."
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
                title: "Fastest Path to a Working Prototype",
                description:
                  "Unlike manual scaffolding, Lovable development done right gets you from prompt to functioning full-stack app in hours.",
                previewLabel: "Generated app scaffold",
                previewImage: { src: "/prismatic-icons/v2-lovable-1.png", alt: "Generated app scaffold" },
              },
              {
                title: "Real Codebase, Not a Black Box",
                description:
                  "One of the key advantages of working with us is generated code that's standard and exportable, not locked to a proprietary runtime.",
                previewLabel: "Exportable source tree",
                previewImage: { src: "/prismatic-icons/v2-lovable-2.png", alt: "Exportable source tree" },
              },
              {
                title: "Human-Refined Output",
                description:
                  "As your product moves toward launch, structure matters. Our Lovable development approach treats AI-generated scaffolding as a starting point, then reviews and hardens it.",
                previewLabel: "Code review diff",
                previewImage: { src: "/prismatic-icons/v2-lovable-3.png", alt: "Code review diff" },
              },
            ]}
          />

          <ServicesSection
            headline="Your Partner in Building With Lovable, Efficiently."
            tools={[
              {
                label: "Prompt & Scope Strategy",
                description: "We define what to generate and what to build manually for the best result.",
                image: { src: "/services/strategy.png", alt: "Key architectural decisions — data structure, access control, automation, API-first approach" },
              },
              {
                label: "AI-Assisted Scaffolding",
                description: "We generate your initial application structure using Lovable.",
                image: { src: "/services/tool-lovable.png", alt: "Lovable app editor — generated layout and components" },
              },
              {
                label: "Human Review & Hardening",
                description: "We review, refactor, and harden the generated code for real use.",
                image: { src: "/services/mpmapping.png", alt: "Structured review flow — ordered checks from step to step" },
              },
              {
                label: "Extension & Production Readiness",
                description: "We extend features and prepare your app for real users.",
                image: { src: "/services/scales.png", alt: "System health dashboard — workflows, API calls, database size, and error rate" },
              },
            ]}
          />

          <ProcessSection
            headline="Our Process"
            subhead="From first prototype to ongoing support — here's what powers every Lovable build we ship."
            items={[
              {
                title: "Scope & Prompt Strategy",
                description:
                  "We define exactly what the AI-generated scaffold needs to cover. This ensures your Lovable development starts from a clear spec, not a vague prompt.",
              },
              {
                title: "Generate & Review",
                description:
                  "We generate the initial application and review the output critically, not just accept it as-is.",
                // Overrides ProcessSection's default step-2 image with a
                // generated-page template with a placeholder image block,
                // a closer match for "reviewing generated output" than
                // the generic design/dev/AI pipeline default — on
                // request.
                image: { src: "/process/process-f.png", alt: "Generated page template — heading, subheading, and image block" },
              },
              {
                title: "Refine, Extend & Launch",
                description:
                  "We refactor generated code into a maintainable state, add remaining features, and prepare it for real usage.",
              },
            ]}
          />

          <BusinessImpactSection
            headline="The Real Business Impact of a Dedicated Product Team"
            intro="Speed isn't just a feature — it's operational leverage. Less time spent managing hiring, tooling, and handoffs means more of your budget goes toward shipping product that actually moves the business forward."
            benefits={[
              {
                icon: "speed",
                text: "Prototype live in hours",
                description: "Lovable's AI-powered builder scaffolds a working first pass fast.",
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
            headline="Is Lovable the right fit for your idea?"
            intro="Not every idea needs an AI-assisted builder — here's how to tell if Lovable is the right match before we talk."
            goodFitHeader="We're a Great Fit If"
            goodFit={[
              "You need to turn a rough idea into a working prototype fast",
              "You want AI-assisted development, not a blank-page start",
              "You need to validate or launch in weeks, not months",
              "You want ongoing support after launch, not a one-and-done build",
            ]}
            notGoodFitHeader="Not the Right Fit If"
            notGoodFit={[
              "You need a fully custom backend outside what an AI-assisted builder can support",
              "You already have a validated, complex product and need to scale, not prototype",
              "You want the cheapest possible option over quality",
              "You're not ready to commit to a clear product scope",
            ]}
          />

          <FaqSection
            headline="Questions about Lovable development"
            faqs={[
              {
                question: "What is Lovable development?",
                answer:
                  "It's using Lovable's AI-powered builder to scaffold a working application fast, then treating that scaffold as a starting point — reviewed, refactored, and hardened by us into something maintainable, not shipped as-is.",
              },
              {
                question: "Is the code Lovable generates production-ready as-is?",
                answer:
                  "Generally not without review — AI-generated scaffolding is a fast starting point, not a finished product. Human review and hardening is a standard part of how we work with it, not an optional add-on.",
              },
              {
                question: "Can we own and export the generated codebase?",
                answer:
                  "Lovable generates a standard, exportable codebase rather than locking you into a proprietary runtime — we can confirm the exact ownership and export terms for your plan before you commit.",
              },
              {
                question: "How much manual work happens after generation?",
                answer:
                  "It varies by project, but expect real engineering — reviewing and refactoring the generated code, filling gaps the scaffold doesn't cover, and hardening it for real users rather than treating generation as the finish line.",
              },
              {
                question: "Do you provide ongoing support after the initial build?",
                answer:
                  "Yes — we extend features and prepare the app for real users past the initial generation and review pass, not just the first working version.",
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
