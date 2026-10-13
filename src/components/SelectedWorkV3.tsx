"use client";

import { StackedFeatureCards } from "./StackedFeatureCards";

const CARDS = [
  {
    label: "Workflow",
    title: "Every handoff happens in one place",
    body: "Teams stop losing context between tools — intake, review, and delivery all live on the same timeline.",
    footer: "Available on every plan",
    image: { src: "/work-gallery/saas-2-lawservice-dashboard.png", alt: "Dashboard UI mockup" },
  },
  {
    label: "Visibility",
    title: "See exactly where every project stands",
    body: "A single live view replaces the status update nobody had time to write.",
    footer: "Updates in real time",
    image: { src: "/work-gallery/mp-1-rooma-product-details.png", alt: "Product detail UI mockup" },
  },
  {
    label: "Automation",
    title: "Repetitive steps run themselves",
    body: "Approvals, notifications, and syncs fire automatically the moment a status changes.",
    footer: "No setup required",
    image: { src: "/work-gallery/automation-2-saleshub.png", alt: "Automation UI mockup" },
  },
];

export function SelectedWorkV3() {
  return <StackedFeatureCards id="our-work-v3" cards={CARDS} />;
}
