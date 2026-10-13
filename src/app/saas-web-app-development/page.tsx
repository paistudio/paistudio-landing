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
  title: "SaaS & Web App Development — Paistudio",
  description: "Structured SaaS development built for real business growth — not just a working demo.",
};

// First of the 12 offering/tool pages the section library (SEC-01–SEC-10,
// src/components/sections/) is meant to eventually assemble. Currently
// wires up SEC-01 (Hero), SEC-02 (Value Pillars), SEC-03 (Services),
// SEC-04 (Services — scroll-driven accordion), SEC-06 (Business Impact),
// SEC-08 (Qualification), and SEC-10 (FAQ) — the rest (Proof, Pricing)
// isn't built into this page yet; adding those wasn't asked for here.
// Hero/Why/Services/Process/FAQ content below is sourced verbatim (minus
// markdown emphasis markers, which these components render as plain
// text) from docs/page-content/saas-web-app-development-final.md — real
// copy fetched live from paistudio.co (homepage + /n8n-development, used
// as tone reference), not generic filler, matching how the other 11
// offering/tool pages were sourced from their own final-*.md files. FAQ
// questions are the real ones from that source too; it left answers as
// "[PLACEHOLDER]" (the live n8n page it cross-checked against also ships
// FAQ questions with no visible answers — a real content gap, not
// laziness), so the answers here are newly written but grounded only in
// facts already established elsewhere on this page/site — no invented
// case studies, pricing, or metrics.
//
// Positioning tension flagged by the source file itself, worth surfacing
// rather than silently resolving: this page's real copy leans general
// full-stack/custom-code language ("frontend, backend, database,"
// "modern frameworks") without mentioning Bubble or no-code, while the
// rest of this site (and every other offering page here) positions
// Paistudio as Bubble/no-code-first. That's carried through faithfully
// as written in the source rather than "corrected" toward Bubble-specific
// language that isn't actually in the real copy — SEC-04 below still
// consolidates the same Bubble-flavored capabilities it did before this
// update for exactly that reason (SEC-03 above no longer mentions Bubble
// by name, so SEC-04 doesn't either). If custom-code and no-code are
// meant to be two distinct service lines, this page's copy should say so
// explicitly — right now a visitor could reasonably wonder which one
// "SaaS Development" refers to here.
//
// SEC-06's benefits are grounded the same way as before — this page has
// no SEC-05 (Proof) cases to trace them to, so they're tied instead to
// facts already established elsewhere on this page rather than to
// unsupported claims. SEC-08's good-fit/not-a-fit rows are similarly
// unchanged from the prior pass. SEC-04 no longer has an eyebrow or a
// link/button (both removed on request) — just a headline + subheader
// above the accordion.
export default function SaasWebAppDevelopmentPage() {
  return (
    <ScrollDriverProvider>
      <div className="relative w-full">
        <Nav theme="dark" chromeVariant="v2" />
        <main className="min-h-screen">
          <HeroSection
            eyebrow="SaaS & Web App Development"
            headline="SaaS & Web App Development for Products Built to Scale"
            subhead="Structured SaaS development built for real business growth — not just a working demo."
            trustBadges={[
              // Same real trust content used across the rest of this site
              // (src/components/Hero.tsx's stats row) — not page-specific
              // fabrication, this is genuinely true company-wide.
              { label: "Top Rated+ on Upwork" },
              { label: "2 weeks avg. first release" },
              { label: "50+ projects completed" },
            ]}
            cta={{ label: "Start Your Project", href: "#contact" }}
            // Same real images as the homepage's "SaaS & Web Apps"
            // WorkGallery card, on request ("gunakan gambar yg dipake
            // sesuai di work gallery") — was 2 dedicated
            // /hero/saas-web-app-development-{a,b}.png stills, now the
            // full 6-image gallery reused 1:1.
            images={getGalleryImages("saas-web-apps")}
          />

          <ValuePillarsSection
            pillars={[
              {
                title: "Production-Grade Architecture",
                description:
                  "Unlike a quick prototype, SaaS development done right is built to handle real users and real load from day one.",
                previewLabel: "Load-tested architecture diagram",
                previewImage: { src: "/prismatic-icons/v2-saas-1.png", alt: "Load-tested architecture diagram" },
              },
              {
                title: "Full-Stack Ownership",
                description:
                  "One of the key advantages of working with us is full ownership of your stack — frontend, backend, and infrastructure handled as one coherent system.",
                previewLabel: "Full-stack system map",
                previewImage: { src: "/prismatic-icons/v2-saas-2.png", alt: "Full-stack system map" },
              },
              {
                title: "Scalable, API-First Design",
                description:
                  "As your product grows, structure matters. Our SaaS development approach uses API-first design and modular architecture, so your product scales without a rewrite.",
                previewLabel: "API-first module diagram",
                previewImage: { src: "/prismatic-icons/v2-saas-3.png", alt: "API-first module diagram" },
              },
            ]}
          />

          <ServicesSection
            headline="Custom SaaS & Web App Development Services"
            tools={[
              {
                label: "Product Strategy & Architecture",
                description: "We define your technical architecture and data model before writing a single line of code.",
                image: { src: "/services/strategy.png", alt: "Key architectural decisions — data structure, access control, automation, API-first approach" },
              },
              {
                label: "Full-Stack Development",
                description: "We build your frontend, backend, and database as one connected system, not disconnected pieces.",
                image: { src: "/services/fullstack.png", alt: "Full-stack app editor — data, workflows, and pages in one interface" },
              },
              {
                label: "API & AI Integration",
                description: "From payments to AI services, we connect the tools your product actually needs to run.",
                image: {
                  src: "/services/integration.png",
                  alt: "Integrations panel — Stripe, Supabase, and Claude connected to your product",
                },
              },
              {
                label: "Scaling & Maintenance",
                description:
                  "As your business grows, we continuously refine and expand your product to maintain stability and performance.",
                image: { src: "/services/scales.png", alt: "System health dashboard — workflows, API calls, database size, and error rate" },
              },
            ]}
          />

          <ProcessSection
            headline="How We Build Scalable SaaS Products"
            subhead="From first architecture decision to ongoing iteration — here's what powers every SaaS product we ship."
            items={[
              {
                title: "Discovery & Architecture",
                description:
                  "We map your requirements and define the technical foundation before any development starts. This ensures your SaaS development is structured, scalable, and aligned with business goals — not built on assumptions.",
              },
              {
                title: "Design & Development",
                description:
                  "We design and build your product using modern frameworks, clean API architecture, and structured error handling — designed for long-term performance, not just launch day.",
              },
              {
                title: "Launch & Iteration",
                description:
                  "We ship your product, monitor real usage, and continuously refine it as your operations grow and complexity increases.",
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
            headline="Is Paistudio the right fit for your SaaS?"
            intro="Not every project needs a dedicated Bubble team — here's how to tell if this is the right match before we talk."
            goodFitHeader="We're a Great Fit If"
            goodFit={[
              "You need a production-ready SaaS built on Bubble, not just a prototype",
              "You want a dedicated team, not a rotating cast of freelancers",
              "You need to launch in weeks, not months",
              "You want ongoing support after launch, not a one-and-done build",
            ]}
            notGoodFitHeader="Not the Right Fit If"
            notGoodFit={[
              "You need a fully custom backend outside what Bubble can support",
              "You just need a quick landing page, not a full application",
              "You want the cheapest possible option over quality",
              "You're not ready to commit to a clear product scope",
            ]}
          />

          <FaqSection
            headline="SaaS & Web App Development Frequently Asked Questions"
            faqs={[
              {
                question: "What is SaaS development?",
                answer:
                  "It's building a software product as a hosted, scalable service — architecture, data model, and infrastructure designed to handle real users and real load from day one, not just a working demo.",
              },
              {
                question: "Why choose custom SaaS development over no-code tools?",
                answer:
                  "It depends on what your product actually needs. Custom development gives you full ownership of your stack when performance, integrations, or scale genuinely require it; for many products, a fast, well-built no-code foundation is the better first move. We recommend whichever approach fits your specific case rather than defaulting to one.",
              },
              {
                question: "Can you take over an existing codebase?",
                answer:
                  "Yes — we can audit an existing codebase and continue building on it rather than requiring a rebuild from scratch, as long as its foundation is sound enough to extend.",
              },
              {
                question: "What tech stack do you use for SaaS development?",
                answer:
                  "We choose modern, well-supported frameworks and API-first architecture suited to your product's specific requirements, rather than forcing every project through one fixed stack.",
              },
              {
                question: "Do you provide ongoing support after launch?",
                answer:
                  "Yes — we monitor real usage after launch and continuously refine the product as your operations grow and complexity increases, rather than treating launch as the finish line.",
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
