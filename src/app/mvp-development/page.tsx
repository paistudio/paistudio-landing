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
  title: "MVP Development — Paistudio",
  description: "Structured MVP development built to answer the one question that matters — will people actually use this.",
};

// One of the 12 offering/tool pages the section library (SEC-01–SEC-10,
// src/components/sections/) is meant to eventually assemble. Hero/Why/
// Services/Process/FAQ content below is sourced verbatim (minus markdown
// emphasis markers, which these components render as plain text) from
// docs/page-content/final-mvp-development.md — real copy fetched from
// the live paistudio.co page, not generic filler. FAQ questions are the
// real ones from that page too; the source file left answers as
// "[PLACEHOLDER]" (the live page has no visible answers), so the answers
// here are newly written but grounded only in facts already established
// elsewhere on this page/site — no invented case studies or metrics.
// BusinessImpactSection and QualificationSection aren't covered by the
// source file, so they're left as they were.
export default function MvpDevelopmentPage() {
  return (
    <ScrollDriverProvider>
      <div className="relative w-full">
        <Nav theme="dark" chromeVariant="v2" />
        <main className="min-h-screen">
          <HeroSection
            eyebrow="MVP Development"
            headline="MVP Development to Validate Your Idea, Fast"
            subhead="Structured MVP development built to answer the one question that matters — will people actually use this."
            trustBadges={[
              // Same real trust content used across the rest of this site
              // (src/components/Hero.tsx's stats row) — not page-specific
              // fabrication, this is genuinely true company-wide.
              { label: "Top Rated+ on Upwork" },
              { label: "2 weeks avg. first release" },
              { label: "50+ projects completed" },
            ]}
            cta={{ label: "Start Your Project", href: "#contact" }}
            // Same real images as the homepage's "MVP" WorkGallery card,
            // on request ("gunakan gambar yg dipake sesuai di work
            // gallery").
            images={getGalleryImages("mvp")}
          />

          <ValuePillarsSection
            pillars={[
              {
                title: "Scope Discipline",
                description: "Unlike open-ended builds, MVP development done right defines what NOT to build first.",
                previewLabel: "Scope cut list",
                previewImage: { src: "/prismatic-icons/v2-mvp-1.png", alt: "Scope cut list" },
              },
              {
                title: "Right-Sized Tooling",
                description:
                  "One of the key advantages of working with us is choosing whichever tool gets you a real test the fastest — no-code, low-code, or full-code.",
                previewLabel: "Tooling decision matrix",
                previewImage: { src: "/prismatic-icons/v2-mvp-2.png", alt: "Tooling decision matrix" },
              },
              {
                title: "Built to Extend",
                description: "As your idea gets validated, structure matters. Our MVP development approach means a \"yes\" doesn't mean starting over.",
                previewLabel: "Post-validation roadmap",
                previewImage: { src: "/prismatic-icons/v2-mvp-3.png", alt: "Post-validation roadmap" },
              },
            ]}
          />

          <ServicesSection
            headline="Your Partner in Building MVPs, Efficiently."
            tools={[
              {
                label: "Scope & Validation Strategy",
                description: "We define the smallest build that answers your real question.",
                image: { src: "/services/strategy.png", alt: "Key architectural decisions — data structure, access control, automation, API-first approach" },
              },
              {
                label: "Rapid Build",
                description: "We build your MVP using the fastest appropriate stack for your validation goal.",
                image: { src: "/services/fullstack.png", alt: "Full-stack app editor — data, workflows, and pages in one interface" },
              },
              {
                label: "Launch & Data Instrumentation",
                description: "We ship with analytics in place so you actually learn from real usage.",
                image: { src: "/services/scales.png", alt: "System health dashboard — workflows, API calls, database size, and error rate" },
              },
              {
                label: "Post-Validation Roadmapping",
                description: "We turn validated learnings into a real product roadmap.",
                image: { src: "/services/scales.png", alt: "System health dashboard — workflows, API calls, database size, and error rate" },
              },
            ]}
          />

          <ProcessSection
            headline="Our Process"
            subhead="From first build to ongoing support — here's what powers every MVP we ship."
            items={[
              {
                title: "Scope Definition",
                description:
                  "We identify the single riskiest assumption to test and scope only that. This ensures your MVP development stays focused on validation, not feature creep.",
              },
              {
                title: "Rapid Prototyping & Launch",
                description:
                  "We build and ship the smallest working version of your core flow, instrumented to capture real user behavior from day one.",
              },
              {
                title: "Learn & Decide",
                description: "We review real usage data with you and help you decide what to build next.",
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
            headline="Is Paistudio the right fit for your MVP?"
            intro="Not every project needs a dedicated Bubble team — here's how to tell if this is the right match before we talk."
            goodFitHeader="We're a Great Fit If"
            goodFit={[
              "You need a production-ready MVP built on Bubble, not just a prototype",
              "You want a dedicated team, not a rotating cast of freelancers",
              "You need to launch in weeks, not months",
              "You want ongoing support after launch, not a one-and-done build",
            ]}
            notGoodFitHeader="Not the Right Fit If"
            notGoodFit={[
              "You need a fully custom backend outside what Bubble can support",
              "You already have a validated product and need to scale, not test an idea",
              "You want the cheapest possible option over quality",
              "You're not ready to commit to a clear product scope",
            ]}
          />

          <FaqSection
            headline="Questions about MVP development"
            faqs={[
              {
                question: "What is MVP development?",
                answer:
                  "It's building the smallest working version of your product that can actually answer whether people will use it — scoped tightly around one riskiest assumption, not a stripped-down version of the full product.",
              },
              {
                question: "How fast can you build an MVP?",
                answer:
                  "It depends on scope, but the whole point of scope discipline is getting a real test in front of users fast — often in weeks by deliberately defining what not to build first.",
              },
              {
                question: "Do you use no-code tools or custom code for MVPs?",
                answer:
                  "Whichever gets you a real test the fastest — no-code, low-code, or full-code — chosen based on your validation goal rather than a default preference for one approach.",
              },
              {
                question: "Can the MVP be extended into a full product later?",
                answer:
                  "Yes — that's a deliberate part of how we build it. A validated MVP is meant to be extended, not thrown away and rebuilt from scratch once you get a \"yes.\"",
              },
              {
                question: "Do you help interpret the validation data after launch?",
                answer:
                  "Yes — we ship with analytics instrumented from day one and review real usage data with you to turn what you learned into an actual product roadmap.",
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
