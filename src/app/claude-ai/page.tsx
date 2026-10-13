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
  title: "Claude AI Integration — Paistudio",
  description:
    "Structured Claude AI integration built on real reasoning and careful context design — not a bolted-on chatbot.",
};

// One of the 12 target pages — a tool page (SEC-07's own spec applies
// Tool Deep-Dive only to tool pages: Bubble, n8n, Softr, Airtable,
// Lovable, Claude AI — not offering pages; not built into any page yet).
// Hero/Why/Services/Process/FAQ content below is sourced verbatim (minus
// markdown emphasis markers, which these components render as plain
// text) from docs/page-content/final-claude-ai.md — real copy fetched
// from the live paistudio.co page, not generic filler. FAQ questions are
// the real ones from that page too; the source file left answers as
// "[PLACEHOLDER]" (the live page has no visible answers), so the answers
// here are newly written but grounded only in facts already established
// elsewhere on this page/site — no invented claims about specific Claude
// model capabilities or lineup. BusinessImpactSection and
// QualificationSection aren't covered by the source file, so they're
// left as they were.
export default function ClaudeAiPage() {
  return (
    <ScrollDriverProvider>
      <div className="relative w-full">
        <Nav theme="dark" chromeVariant="v2" />
        <main className="min-h-screen">
          <HeroSection
            eyebrow="Claude AI"
            headline="Claude AI Integration for Reliable, Production-Grade Features"
            subhead="Structured Claude AI integration built on real reasoning and careful context design — not a bolted-on chatbot."
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
                title: "Strong Reasoning & Instruction Following",
                description:
                  "Unlike generic AI widgets, Claude AI integration done right is well suited to structured tasks that require careful, literal instruction following.",
                previewLabel: "Structured task output",
              },
              {
                title: "Long-Context Handling",
                description:
                  "One of the key advantages of working with us is support for large amounts of context — ideal for document- and codebase-heavy use cases.",
                previewLabel: "Document context window",
              },
              {
                title: "Tool Use & Agentic Workflows",
                description:
                  "As your product's needs grow, structure matters. Our Claude AI integration approach supports function calling and multi-step agentic task execution.",
                previewLabel: "Tool-call execution trace",
              },
            ]}
          />

          <ServicesSection
            headline="Your Partner in Building With Claude, Efficiently."
            tools={[
              {
                label: "Feasibility & Model Scoping",
                description: "We assess whether Claude fits your use case and which model variant to use.",
                image: { src: "/services/strategy.png", alt: "Key architectural decisions — data structure, access control, automation, API-first approach" },
              },
              {
                label: "Prompt & Pipeline Development",
                description: "We design prompting, context management, and tool-use architecture.",
                image: { src: "/services/fullstack.png", alt: "App editor — pipeline logic, data, and workflows in one interface" },
              },
              {
                label: "Evaluation & Guardrails",
                description: "We build evaluation sets and safety guardrails before launch.",
                image: { src: "/services/mpmapping.png", alt: "Structured evaluation flow — ordered checks from step to step" },
              },
              {
                label: "Monitoring & Iteration",
                description: "We track real-world performance and refine after launch.",
                image: { src: "/services/scales.png", alt: "System health dashboard — workflows, API calls, database size, and error rate" },
              },
            ]}
          />

          <ProcessSection
            headline="Our Process"
            subhead="From first build to ongoing support — here's what powers every Claude-based feature we ship."
            items={[
              {
                title: "Feasibility & Scoping",
                description:
                  "We determine what's realistic given Claude's current capabilities and your data. This ensures your Claude AI integration starts from what's achievable, not assumed.",
              },
              {
                title: "Pipeline Design & Build",
                description:
                  "We design and implement prompting, context, and tool-use architecture, tested against a structured evaluation set.",
                // Overrides ProcessSection's default step-2 image
                // (process-2.png) with process-7.png — a connected
                // pipeline-stages diagram, a closer match for "pipeline
                // design" than the generic design/dev/AI default — on
                // request.
                image: { src: "/process/process-7.png", alt: "Connected pipeline stages — design, development, AI services, integration" },
              },
              {
                title: "Launch & Monitor",
                description: "We ship with monitoring in place and refine based on real usage data.",
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
                text: "No in-house AI team needed",
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
            headline="Is Claude the right fit for your AI feature?"
            intro="Not every product needs a frontier model — here's how to tell if Claude is the right match before we talk."
            goodFitHeader="We're a Great Fit If"
            goodFit={[
              "You need a production AI feature, not just a chat demo",
              "You want real reasoning over your own data and workflows",
              "You need to launch in weeks, not months",
              "You want ongoing support after launch, not a one-and-done build",
            ]}
            notGoodFitHeader="Not the Right Fit If"
            notGoodFit={[
              "You need a fully custom, self-hosted model outside a frontier API",
              "You just need a generic chatbot widget, not a real product feature",
              "You want the cheapest possible option over quality",
              "You're not ready to commit to a clear product scope",
            ]}
          />

          <FaqSection
            headline="Questions about Claude AI integration"
            faqs={[
              {
                question: "What is Claude AI integration?",
                answer:
                  "It's building real product features on Anthropic's Claude — prompting, context management, tool use, and evaluation — rather than dropping in a generic chat widget.",
              },
              {
                question: "Which Claude models do you work with?",
                answer:
                  "We work with Anthropic's current model lineup and pick the right variant for your use case, balancing reasoning depth, latency, and cost rather than defaulting to one model for everything.",
              },
              {
                question: "How do you reduce hallucination in Claude-powered features?",
                answer:
                  "Through careful context design and grounding — giving Claude the right data and instructions for the task — plus a structured evaluation set before anything ships, not manual spot-checking.",
              },
              {
                question: "How do you manage API costs at scale?",
                answer:
                  "We scope context and model choice to what the task actually needs, then monitor real usage after launch so cost stays predictable as traffic grows.",
              },
              {
                question: "Do you provide ongoing monitoring after launch?",
                answer:
                  "Yes — every build ships with monitoring in place, and we continue refining based on real usage data rather than treating launch as the finish line.",
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
