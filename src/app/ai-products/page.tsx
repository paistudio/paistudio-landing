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
  title: "AI Products — Paistudio",
  description: "Structured AI product development built for reliability at real scale, not just a proof of concept.",
};

// One of the 12 offering/tool pages the section library (SEC-01–SEC-10,
// src/components/sections/) is meant to eventually assemble. Hero/Why/
// Services/Process/FAQ content below is sourced verbatim (minus markdown
// emphasis markers, which these components render as plain text) from
// docs/page-content/final-ai-products.md — real copy fetched from the
// live paistudio.co page, not generic filler. FAQ questions are the real
// ones from that page too; the source file left answers as
// "[PLACEHOLDER]" (the live page has no visible answers), so the answers
// here are newly written but grounded only in facts already established
// elsewhere on this page/site — no invented metrics or model claims.
// BusinessImpactSection and QualificationSection aren't covered by the
// source file, so they're left as they were.
export default function AiProductsPage() {
  return (
    <ScrollDriverProvider>
      <div className="relative w-full">
        <Nav theme="dark" chromeVariant="v2" />
        <main className="min-h-screen">
          <HeroSection
            eyebrow="AI Products"
            headline="AI Products Built to Perform Beyond the Demo"
            subhead="Structured AI product development built for reliability at real scale, not just a proof of concept."
            trustBadges={[
              // Same real trust content used across the rest of this site
              // (src/components/Hero.tsx's stats row) — not page-specific
              // fabrication, this is genuinely true company-wide.
              { label: "Top Rated+ on Upwork" },
              { label: "2 weeks avg. first release" },
              { label: "50+ projects completed" },
            ]}
            cta={{ label: "Start Your Project", href: "#contact" }}
            // Same real images as the homepage's "AI Products" WorkGallery
            // card, on request ("gunakan gambar yg dipake sesuai di work
            // gallery").
            images={getGalleryImages("ai-products")}
          />

          <ValuePillarsSection
            pillars={[
              {
                title: "Model-Aware Product Design",
                description:
                  "Unlike generic AI features, AI product development done right scopes features to what the model can actually do reliably.",
                previewLabel: "Feasibility scoping doc",
                previewImage: { src: "/prismatic-icons/v2-ai-1.png", alt: "Feasibility scoping doc" },
              },
              {
                title: "Grounded, Not Guessing",
                description:
                  "One of the key advantages of working with us is retrieval and grounding pipelines that reduce hallucination on your own data.",
                previewLabel: "Retrieval pipeline diagram",
                previewImage: { src: "/prismatic-icons/v2-ai-2.png", alt: "Retrieval pipeline diagram" },
              },
              {
                title: "Evaluated Before Launch",
                description:
                  "As AI features become core to your product, structure matters. Our AI product development approach uses structured evaluation, not manual spot-checking.",
                previewLabel: "Evaluation harness dashboard",
                previewImage: { src: "/prismatic-icons/v2-ai-3.png", alt: "Evaluation harness dashboard" },
              },
            ]}
          />

          <ServicesSection
            headline="Your Partner in Building AI Products, Efficiently."
            tools={[
              {
                label: "AI Feasibility & Scoping",
                description: "We assess what's realistically achievable with current models for your specific use case.",
                image: { src: "/services/strategy.png", alt: "Key architectural decisions — data structure, access control, automation, API-first approach" },
              },
              {
                label: "Model & Pipeline Development",
                description: "We build prompting, retrieval, and orchestration pipelines around your chosen model.",
                image: { src: "/services/fullstack.png", alt: "App editor — pipeline logic, data, and workflows in one interface" },
              },
              {
                label: "Evaluation & Guardrails",
                description: "We build evaluation harnesses and safety guardrails before anything ships.",
                image: { src: "/services/mpmapping.png", alt: "Structured evaluation flow — ordered checks from step to step" },
              },
              {
                label: "Monitoring & Iteration",
                description: "We track real-world performance and refine your AI product after launch.",
                image: { src: "/services/scales.png", alt: "System health dashboard — workflows, API calls, database size, and error rate" },
              },
            ]}
          />

          <ProcessSection
            headline="Our Process"
            subhead="From first build to ongoing support — here's what powers every AI product we ship."
            items={[
              {
                title: "Feasibility & Scoping",
                description:
                  "We determine what is realistic given current model capabilities and your data. This ensures your AI product development starts from what's actually achievable, not a demo reel.",
              },
              {
                title: "Pipeline Design & Build",
                description:
                  "We design and implement prompting, retrieval, and orchestration architecture, tested against a structured evaluation set before launch.",
              },
              {
                title: "Launch & Monitor",
                description:
                  "We ship with monitoring in place and continuously refine your AI product as real usage reveals what's working.",
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
            headline="Is Paistudio the right fit for your AI product?"
            intro="Not every project needs a dedicated Bubble team — here's how to tell if this is the right match before we talk."
            goodFitHeader="We're a Great Fit If"
            goodFit={[
              "You need a production-ready AI product built on Bubble, not just a prototype",
              "You want a dedicated team, not a rotating cast of freelancers",
              "You need to launch in weeks, not months",
              "You want ongoing support after launch, not a one-and-done build",
            ]}
            notGoodFitHeader="Not the Right Fit If"
            notGoodFit={[
              "You need a fully custom backend outside what Bubble can support",
              "You just need a quick AI demo, not a production product",
              "You want the cheapest possible option over quality",
              "You're not ready to commit to a clear product scope",
            ]}
          />

          <FaqSection
            headline="Questions about AI product development"
            faqs={[
              {
                question: "What is AI product development?",
                answer:
                  "It's building AI-powered features into a real, production product rather than a one-off demo — model and pipeline design, retrieval and grounding against your own data, evaluation and guardrails before launch, and monitoring after.",
              },
              {
                question: "Which AI models do you work with?",
                answer:
                  "We're model-agnostic — we choose whichever model or combination best fits your use case, latency, and cost requirements, rather than defaulting to a single vendor.",
              },
              {
                question: "How do you reduce hallucination in AI features?",
                answer:
                  "Through retrieval and grounding pipelines built against your own data, plus structured evaluation before anything ships — responses are checked against real sources, not left to the model's judgment alone.",
              },
              {
                question: "How do you control AI/API costs at scale?",
                answer:
                  "We scope features to what's actually achievable, choose cost-appropriate models per task, and keep monitoring in place after launch so cost stays predictable as usage grows.",
              },
              {
                question: "Do you provide ongoing monitoring after launch?",
                answer:
                  "Yes — every build ships with monitoring in place, and we continue refining the product as real-world usage shows what's working and what isn't.",
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
