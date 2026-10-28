import type { Project } from "@/types/content";

export const PROJECTS: Project[] = [
  {
    id: "saas-web-apps",
    name: "SaaS & Web Apps",
    desc: "Design and build scalable SaaS platforms, customer portals, dashboards, and business applications that are fast, intuitive, and ready to grow with your business.",
    skills: ["User Auth & Roles", "Billing & Subscriptions", "Dashboards", "Admin Panel", "Scalable Data Model"],
    gallery: [
      { label: "1", src: "/work-gallery/saas-1-aedigo-contract-details.png", alt: "AEdiGo — contract details view" },
      { label: "2", src: "/work-gallery/saas-2-lawservice-dashboard.png", alt: "LawService — dashboard" },
      { label: "3", src: "/work-gallery/saas-3-qrafter-orders.png", alt: "Qrafter — orders management" },
      { label: "4", src: "/work-gallery/saas-4-ledgr-dashboard.png", alt: "Ledgr — dashboard" },
      { label: "5", src: "/work-gallery/saas-5-surte.png", alt: "Surte" },
      { label: "6", src: "/work-gallery/saas-6-stg-agreement-details.png", alt: "STG — agreement details" },
    ],
  },
  {
    id: "marketplace",
    name: "Marketplace",
    desc: "Build complex multi-sided marketplaces with role-based experiences, payments, messaging, bookings, approvals, and workflow automation for buyers, sellers, and service providers.",
    skills: ["Multi-Role Flows", "Matching Logic", "Payments & Payouts", "Reviews & Trust", "Search & Filters"],
    gallery: [
      { label: "1", src: "/work-gallery/mp-1-rooma-product-details.png", alt: "Rooma — product details" },
      { label: "2", src: "/work-gallery/mp-2-aedigo-mp.png", alt: "AEdiGo — marketplace" },
      { label: "3", src: "/work-gallery/mp-3-wwaave-browse.png", alt: "Wwaave — browse venues" },
      { label: "4", src: "/work-gallery/mp-4-dispro-property-details.png", alt: "Discovery Property — property details" },
      { label: "5", src: "/work-gallery/mp-5-kamily-browse-provider.png", alt: "Kamily — browse provider" },
    ],
  },
  {
    id: "ai-products",
    name: "AI Products",
    desc: "Turn AI into a practical product by integrating LLMs, AI agents, document analysis, image generation, semantic search, and intelligent workflows into your application.",
    skills: ["LLM Integration", "RAG / Your Data", "Prompt Pipelines", "AI Agents", "Human-in-the-Loop"],
    gallery: [
      { label: "1", src: "/work-gallery/ai-1-capit-dashboard.png", alt: "Capit — dashboard" },
      { label: "2", src: "/work-gallery/ai-2-lawservice-contract-details.png", alt: "LawService — contract details" },
      { label: "3", src: "/work-gallery/ai-3-linkgenius-shotgun.png", alt: "LinkGenius — Shotgun" },
      { label: "4", src: "/work-gallery/ai-4-teliti-catatan-bulanan.png", alt: "Teliti — monthly notes" },
    ],
  },
  {
    id: "automations",
    name: "Automations",
    desc: "Connect your business tools and automate repetitive operations—from lead management and CRM updates to notifications, approvals, and AI-powered workflows.",
    skills: ["n8n Workflows", "App Integrations", "Data Sync", "Scheduled Jobs", "Alerts & Triggers"],
    gallery: [
      { label: "1", src: "/work-gallery/automation-1-persyon-ab.png", alt: "Persyon" },
      { label: "2", src: "/work-gallery/automation-2-saleshub.png", alt: "SalesHub" },
      { label: "3", src: "/work-gallery/automation-3-surte.png", alt: "Surte" },
      { label: "4", src: "/work-gallery/automation-4-dispro-dashboard.png", alt: "Discovery Property — dashboard" },
    ],
  },
  {
    id: "internal-tools",
    name: "Internal Tools",
    desc: "Create custom software that streamlines operations, including admin panels, CRM systems, construction management platforms, procurement workflows, reporting dashboards, and back-office tools.",
    skills: ["Ops Dashboards", "CRMs & Portals", "Approval Flows", "Role Permissions", "Reporting"],
    gallery: [
      { label: "1", src: "/work-gallery/internal-tools-1-qt.png", alt: "QT" },
      { label: "2", src: "/work-gallery/internal-tools-2-konnekto.png", alt: "Konnekto" },
      { label: "3", src: "/work-gallery/internal-tools-3-surte.png", alt: "Surte" },
      { label: "4", src: "/work-gallery/internal-tools-4-capit.png", alt: "Capit" },
      { label: "5", src: "/work-gallery/internal-tools-5-dispro.png", alt: "Discovery Property" },
    ],
  },
  {
    id: "mvp",
    name: "MVP",
    desc: "Launch a production-ready MVP in weeks, not months. We help founders validate ideas quickly while building on a foundation that's ready to scale into a full product.",
    skills: ["Rapid Scoping", "Core Flow Design", "Launch-Ready Build", "User Testing", "Iteration Sprints"],
    gallery: [
      { label: "1", src: "/work-gallery/hellorecruiter-browse.png", alt: "HelloRecruiters — browse recruiter results" },
      { label: "2", src: "/work-gallery/persyon-v2.png", alt: "Persyon — AI personal assistant" },
      { label: "3", src: "/work-gallery/qrafter-orders.png", alt: "Qrafter — orders management" },
      { label: "4", src: "/work-gallery/stg-dashboard.png", alt: "STG — service agreement dashboard" },
      { label: "5", src: "/work-gallery/wwaave-browse.png", alt: "Wwaave — browse venues" },
    ],
  },
];

/** Real (non-placeholder) `{ src, alt }` pairs from one `PROJECTS` entry's
 * `gallery`, by project id — for reuse outside `WorkGallery` itself, e.g.
 * `HeroSection`'s optional `images` marquee on a matching offering page
 * ("gunakan gambar yg dipake sesuai di work gallery": the SaaS & Web App
 * page's hero reuses the same images as the homepage's "SaaS & Web Apps"
 * gallery card, and so on). Drops any still-placeholder slot (no `src`,
 * e.g. Internal Tools' slot 2) rather than passing it through as a
 * broken image. Returns `[]` for an unknown id instead of throwing, since
 * a typo here should silently fall back to `HeroSection`'s placeholder
 * boxes, not break the page. */
export function getGalleryImages(id: string): { src: string; alt: string }[] {
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) return [];
  return project.gallery.filter((slot): slot is { label: string; src: string; alt: string } => Boolean(slot.src)).map((slot) => ({ src: slot.src, alt: slot.alt ?? "" }));
}
