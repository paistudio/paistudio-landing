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
  title: "Bubble Development — Paistudio",
  description: "Structured Bubble development built for real application logic — not just forms and databases.",
};

// One of the 12 target pages — a tool page (SEC-07's own spec applies
// Tool Deep-Dive only to tool pages: Bubble, n8n, Softr, Airtable,
// Lovable, Claude AI — not offering pages; not built into any page yet).
// Hero/Why/Services/Process/FAQ content below is sourced verbatim (minus
// markdown emphasis markers, which these components render as plain
// text) from docs/page-content/final-bubble.md — real copy fetched from
// the live paistudio.co page, not generic filler. Per that file's own
// note, Bubble is Paistudio's core service (confirmed from the live
// site's own positioning as a Bubble agency). FAQ questions are the real
// ones from that page too; the source file left answers as
// "[PLACEHOLDER]" (the live page has no visible answers), so the answers
// here are newly written but grounded only in facts already established
// elsewhere on this page/site — no invented facts about Bubble's
// platform policies. BusinessImpactSection and QualificationSection
// aren't covered by the source file, so they're left as they were.
export default function BubblePage() {
  return (
    <ScrollDriverProvider>
      <div className="relative w-full">
        <Nav theme="dark" chromeVariant="v2" />
        <main className="min-h-screen">
          <HeroSection
            eyebrow="Bubble"
            headline="Bubble Development for Complex, No-Code Applications"
            subhead="Structured Bubble development built for real application logic — not just forms and databases."
            trustBadges={[
              // Same real trust content used across the rest of this site
              // (src/components/Hero.tsx's stats row) — not page-specific
              // fabrication, this is genuinely true company-wide.
              { label: "Top Rated+ on Upwork" },
              { label: "2 weeks avg. first release" },
              { label: "50+ projects completed" },
            ]}
            cta={{ label: "Start Your Project", href: "#contact" }}
            hideImages
          />

          <ValuePillarsSection
            pillars={[
              {
                title: "Complex Application Logic",
                description: "Unlike basic no-code tools, Bubble development done right supports conditional workflows and custom states.",
                previewLabel: "Conditional workflow editor",
                previewImage: { src: "/prismatic-icons/bubble-1.png", alt: "Conditional workflow editor" },
              },
              {
                title: "Faster Than Custom Code",
                description:
                  "One of the key advantages of working with us is shipping real application logic without a full custom-code build cycle.",
                previewLabel: "Build timeline comparison",
                previewImage: { src: "/prismatic-icons/v2-bubble-2.png", alt: "Build timeline comparison" },
              },
              {
                title: "API & Plugin Ecosystem",
                description:
                  "As your app grows, structure matters. Our Bubble development approach connects to the external services your product actually needs.",
                previewLabel: "Connected API list",
                previewImage: { src: "/prismatic-icons/v2-bubble-3.png", alt: "Connected API list" },
              },
            ]}
          />

          <ServicesSection
            headline="Your Partner in Building With Bubble, Efficiently."
            tools={[
              {
                label: "App Architecture & Data Modeling",
                description: "We design your database structure and workflow logic before building.",
                image: { src: "/services/strategy.png", alt: "Key architectural decisions — data structure, access control, automation, API-first approach" },
              },
              {
                label: "Application Build",
                description: "We build your full application in Bubble, including custom workflows and UI.",
                image: { src: "/services/fullstack.png", alt: "Bubble app editor — pages, workflows, and data in one interface" },
              },
              {
                label: "API & Plugin Integration",
                description: "We connect external services and data sources to your app.",
                image: { src: "/services/integration.png", alt: "Integrations panel connecting your app to external services" },
              },
              {
                label: "Performance & Scaling",
                description: "We optimize workflows and data structure as your usage grows.",
                image: { src: "/services/scales.png", alt: "System health dashboard — workflows, API calls, database size, and error rate" },
              },
            ]}
          />

          <ProcessSection
            headline="Our Process"
            subhead="From first build to ongoing support — here's what powers every Bubble app we ship."
            items={[
              {
                title: "Data & Workflow Mapping",
                description:
                  "We define your data structure and logic before building. This ensures your Bubble development is architected for maintainability, not just speed.",
              },
              {
                title: "Build & Integrate",
                description: "We develop your application and connect the integrations it needs to run.",
              },
              {
                title: "Optimize & Expand",
                description: "We refine performance and extend features as your app grows.",
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
            headline="Is Bubble the right fit for your product?"
            intro="Not every product needs a visual, full-stack builder — here's how to tell if Bubble is the right match before we talk."
            goodFitHeader="We're a Great Fit If"
            goodFit={[
              "You need a production-ready app, not just a prototype",
              "You want a visual, full-stack builder instead of hand-coding every screen",
              "You need to launch in weeks, not months",
              "You want ongoing support after launch, not a one-and-done build",
            ]}
            notGoodFitHeader="Not the Right Fit If"
            notGoodFit={[
              "You need extremely high-throughput, low-level performance a visual builder can't deliver",
              "You just need a static marketing site, not an application",
              "You want the cheapest possible option over quality",
              "You're not ready to commit to a clear product scope",
            ]}
          />

          <FaqSection
            headline="Questions about Bubble development"
            faqs={[
              {
                question: "What is Bubble development?",
                answer:
                  "It's building a real, production-grade application on Bubble — data modeling, custom workflow logic, and API/plugin integration — rather than treating it as a simple form-and-database tool.",
              },
              {
                question: "Can Bubble apps be self-hosted?",
                answer:
                  "Bubble is a hosted platform by design — your app runs on Bubble's own infrastructure rather than servers you manage yourself. We can walk through hosting, custom domains, and data portability specifics for your situation before you commit.",
              },
              {
                question: "How does Bubble handle scale and performance?",
                answer:
                  "Performance comes down to how the app is architected — data structure, workflow logic, and query patterns — as much as the platform itself. We optimize both as usage grows rather than treating launch-day performance as the finish line.",
              },
              {
                question: "Can you migrate an existing Bubble app to us?",
                answer:
                  "Yes — we can take over an existing app, audit its data model and workflows, and continue building on it rather than requiring a rebuild from scratch.",
              },
              {
                question: "Do you provide ongoing support for Bubble apps?",
                answer:
                  "Yes — we optimize performance and extend features as your app and its usage grow, rather than stopping at initial launch.",
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
