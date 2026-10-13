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
  title: "Marketplace Development — Paistudio",
  description: "Structured marketplace development built for buyers and sellers to transact with confidence.",
};

// One of the 12 offering/tool pages the section library (SEC-01–SEC-10,
// src/components/sections/) is meant to eventually assemble. Hero/Why/
// Services/Process/FAQ content below is sourced verbatim (minus markdown
// emphasis markers, which these components render as plain text) from
// docs/page-content/final-marketplace-development.md — real copy
// fetched from the live paistudio.co page, not generic filler. FAQ
// questions are the real ones from that page too; the source file left
// answers as "[PLACEHOLDER]" (the live page has no visible answers), so
// the answers here are newly written but grounded only in facts already
// established elsewhere on this page/site — no invented case studies or
// metrics. BusinessImpactSection and QualificationSection aren't covered
// by the source file, so they're left as they were.
export default function MarketplaceDevelopmentPage() {
  return (
    <ScrollDriverProvider>
      <div className="relative w-full">
        <Nav theme="dark" chromeVariant="v2" />
        <main className="min-h-screen">
          <HeroSection
            eyebrow="Marketplace Development"
            headline="Marketplace Development for Two-Sided Platforms That Actually Work"
            subhead="Structured marketplace development built for buyers and sellers to transact with confidence."
            trustBadges={[
              // Same real trust content used across the rest of this site
              // (src/components/Hero.tsx's stats row) — not page-specific
              // fabrication, this is genuinely true company-wide.
              { label: "Top Rated+ on Upwork" },
              { label: "2 weeks avg. first release" },
              { label: "50+ projects completed" },
            ]}
            cta={{ label: "Start Your Project", href: "#contact" }}
            // Same real images as the homepage's "Marketplace" WorkGallery
            // card, on request ("gunakan gambar yg dipake sesuai di work
            // gallery") — was 2 dedicated /hero/marketplace-hero-{a,b}.png
            // stills, now the full 6-image gallery reused 1:1.
            images={getGalleryImages("marketplace")}
          />

          <ValuePillarsSection
            pillars={[
              {
                title: "Two-Sided Flow Design",
                description:
                  "Unlike single-sided apps, marketplace development done right treats buyer and seller experiences as one interdependent system.",
                previewLabel: "Buyer/seller flow map",
                previewImage: { src: "/prismatic-icons/v2-mp-1.png", alt: "Buyer/seller flow map" },
              },
              {
                title: "Payments & Trust Built In",
                description:
                  "One of the key advantages of working with us is escrow, split payments, and verification handled correctly from day one.",
                previewLabel: "Escrow payment flow",
                previewImage: { src: "/prismatic-icons/v2-mp-2.png", alt: "Escrow payment flow" },
              },
              {
                title: "Matching Tuned for Liquidity",
                description:
                  "As your platform grows, structure matters. Our marketplace development approach tunes search and discovery for real liquidity, not just search.",
                previewLabel: "Search/discovery ranking",
                previewImage: { src: "/prismatic-icons/v2-mp-3.png", alt: "Search/discovery ranking" },
              },
            ]}
          />

          <ServicesSection
            headline="Your Partner in Building Marketplaces, Efficiently."
            tools={[
              {
                label: "Marketplace Strategy & Flow Mapping",
                description: "We define buyer, seller, and admin flows before writing a single line of code.",
                image: { src: "/services/mpmapping.png", alt: "Buyer-side user flow — checkout, product details, and payment steps" },
              },
              {
                label: "Platform Development",
                description: "We build listings, search, messaging, and transaction flows as one connected system.",
                image: { src: "/services/fullstack.png", alt: "Full-stack app editor — listings, search, and messaging in one interface" },
              },
              {
                label: "Payments & Trust Integration",
                description: "We integrate payment processing, escrow, and verification the right way, the first time.",
                image: {
                  src: "/services/integration.png",
                  alt: "Integrations panel — payment processing and verification connected to your marketplace",
                },
              },
              {
                label: "Growth & Liquidity Optimization",
                description:
                  "As your business grows, we continuously refine matching and discovery to keep both sides transacting.",
                image: { src: "/services/scales.png", alt: "System health dashboard — workflows, API calls, database size, and error rate" },
              },
            ]}
          />

          <ProcessSection
            headline="Our Process"
            subhead="From first build to ongoing support — here's what powers every marketplace we ship."
            items={[
              {
                title: "Flow Mapping & Architecture",
                description:
                  "We map both sides of your marketplace and how they interact before any development starts. This ensures your marketplace development is structured around real transactions, not assumptions.",
                // Overrides ProcessSection's default step-1 image
                // (process-1.png) with process-4.png — a checkout-flow
                // shot, a better match for a marketplace's buyer-side
                // transaction step than the generic scoping-checklist
                // default — on request.
                image: { src: "/process/process-d.png", alt: "Marketplace checkout flow" },
              },
              {
                title: "Build & Payment Integration",
                description:
                  "We build the platform and integrate the full transaction lifecycle — payments, payouts, and trust systems — designed for real volume, not just a demo.",
              },
              {
                title: "Launch & Liquidity Iteration",
                description:
                  "We ship your marketplace, monitor supply and demand, and continuously refine matching as your platform grows.",
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
            headline="Is Paistudio the right fit for your marketplace?"
            intro="Not every project needs a dedicated Bubble team — here's how to tell if this is the right match before we talk."
            goodFitHeader="We're a Great Fit If"
            goodFit={[
              "You need a production-ready marketplace built on Bubble, not just a prototype",
              "You want a dedicated team, not a rotating cast of freelancers",
              "You need to launch in weeks, not months",
              "You want ongoing support after launch, not a one-and-done build",
            ]}
            notGoodFitHeader="Not the Right Fit If"
            notGoodFit={[
              "You need a fully custom backend outside what Bubble can support",
              "You just need a simple directory listing, not a full two-sided marketplace",
              "You want the cheapest possible option over quality",
              "You're not ready to commit to a clear product scope",
            ]}
          />

          <FaqSection
            headline="Questions about marketplace development"
            faqs={[
              {
                question: "What is marketplace development?",
                answer:
                  "It's building a two-sided platform — listings, search, messaging, payments, and trust — as one connected system, rather than a single-sided app with a directory bolted on.",
              },
              {
                question: "How do you handle payment splitting between buyers and sellers?",
                answer:
                  "Payment processing, escrow, and split payouts are integrated as part of the transaction lifecycle from the start, using established payment infrastructure rather than a custom-built solution unless your case genuinely needs one.",
              },
              {
                question: "Can you integrate with Stripe Connect or similar?",
                answer:
                  "Yes — connecting to established marketplace payment infrastructure like Stripe Connect is exactly the kind of payments and trust integration we build in from day one.",
              },
              {
                question: "How do you handle disputes and refunds?",
                answer:
                  "Trust and verification systems are part of the platform design, not an afterthought — we scope dispute and refund handling into the transaction flow during flow mapping, before any development starts.",
              },
              {
                question: "Do you provide ongoing support after launch?",
                answer:
                  "Yes — we monitor supply and demand and continuously refine matching and discovery as your platform grows, rather than stopping at initial launch.",
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
