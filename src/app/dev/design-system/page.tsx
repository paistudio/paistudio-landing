import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Temporary local-only preview route, same convention as
// /dev/sections — not a real marketing page, just a visual reference
// for the tokens and components already in use across the site (public
// pages + CMS). Nothing here is new; every value/component below is
// pulled from src/styles/themes/blue.css and existing components.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-dashed border-ink/20 px-10 py-14">
      <h2 className="mb-8 text-[13px] font-semibold tracking-[0.1em] text-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}

function Swatch({ name, token, hex }: { name: string; token: string; hex: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-20 w-full rounded-xl border border-ink/10" style={{ backgroundColor: `var(--color-${token})` }} />
      <div>
        <p className="text-sm font-medium text-text">{name}</p>
        <p className="font-mono text-xs text-muted">
          --color-{token} · {hex}
        </p>
      </div>
    </div>
  );
}

function TypeSample({ label, px, className, sample }: { label: string; px: string; className: string; sample: string }) {
  return (
    <div className="flex flex-col gap-2 border-b border-ink/10 py-6 last:border-0">
      <p className="font-mono text-xs text-muted">
        {label} · {px}
      </p>
      <p className={className}>{sample}</p>
    </div>
  );
}

const fieldClass =
  "w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-text transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export default function DesignSystemPage() {
  return (
    <div className="bg-paper">
      <div className="px-10 pt-14 pb-6">
        <h1 className="text-3xl font-bold text-ink">Design System</h1>
        <p className="mt-2 text-sm text-muted">
          Foundations and components actually in use across the public site and the CMS — not a separate spec,
          a mirror of what already exists in <span className="font-mono">src/styles/themes/blue.css</span> and{" "}
          <span className="font-mono">src/components/</span>.
        </p>
      </div>

      <Section title="Colors — base">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-5">
          <Swatch name="Ink" token="ink" hex="#000000" />
          <Swatch name="Paper" token="paper" hex="#ffffff" />
          <Swatch name="Cream" token="cream" hex="#f1f1f1" />
          <Swatch name="Text" token="text" hex="#12141a" />
          <Swatch name="Muted" token="muted" hex="#5a7ca6" />
          <Swatch name="Brand" token="brand" hex="#1e90ff" />
          <Swatch name="Deep" token="deep" hex="#0b3d91" />
          <Swatch name="Mint" token="mint" hex="#a9d6e5" />
          <Swatch name="Pill" token="pill" hex="#d4ebf2" />
        </div>
      </Section>

      <Section title="Colors — semantic">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-5">
          <Swatch name="Success" token="success" hex="#16a34a" />
          <Swatch name="Warning" token="warning" hex="#d97706" />
          <Swatch name="Error" token="error" hex="#dc2626" />
        </div>
        <p className="mt-6 text-sm text-muted">
          A light pill tint is <span className="font-mono">bg-{"{token}"}/15</span> + solid{" "}
          <span className="font-mono">text-{"{token}"}</span> — not a separate background token. Same pattern as{" "}
          <span className="font-mono">mint</span>/<span className="font-mono">cream</span> elsewhere in this theme.
        </p>
      </Section>

      <Section title="Typography">
        <p className="mb-6 text-sm text-muted">
          One family site-wide: Plus Jakarta Sans (<span className="font-mono">--font-jakarta</span>, applied via{" "}
          <span className="font-mono">font-sans</span>).
        </p>
        <TypeSample
          label="Display (homepage hero)"
          px="100px / bold"
          className="text-[64px] leading-none font-bold tracking-[-1px] text-ink sm:text-[100px]"
          sample="Launch 5× faster."
        />
        <TypeSample
          label="H1 (offering page hero)"
          px="64px / bold"
          className="text-[48px] leading-[1.08] font-bold tracking-[-0.02em] text-ink sm:text-[64px]"
          sample="Why SaaS Development Is Essential"
        />
        <TypeSample
          label="H2 (Our Work project name)"
          px="40–70px / bold"
          className="text-[40px] leading-[1.04] font-bold tracking-[-0.56px] text-deep"
          sample="SaaS & Web Apps"
        />
        <TypeSample
          label="H3 (pillar / card title)"
          px="22–28px / bold"
          className="text-[22px] leading-[1.2] font-bold tracking-[-0.01em] text-text"
          sample="Production-Grade Architecture"
        />
        <TypeSample
          label="Body"
          px="18px / medium"
          className="text-[18px] leading-[1.6] font-medium text-muted"
          sample="Structured SaaS development built for real business growth — not just a working demo."
        />
        <TypeSample
          label="Small / meta"
          px="13–14px / regular"
          className="text-[14px] leading-[1.5] text-muted"
          sample="2 weeks avg. first release"
        />
        <TypeSample
          label="Eyebrow / label"
          px="11–12px / medium, uppercase"
          className="text-[12px] font-medium tracking-[0.1em] text-muted uppercase"
          sample="Our Work"
        />
      </Section>

      <Section title="Buttons — public site">
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-deep"
          >
            Start Your Project
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-ink no-underline transition-colors hover:bg-white/90"
          >
            Learn more
          </a>
        </div>
      </Section>

      <Section title="Buttons — CMS (shadcn)">
        <div className="flex flex-wrap items-center gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default size</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Status pills">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
            Published
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-muted">
            Draft
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
            Visible
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-muted">
            Hidden
          </span>
        </div>
      </Section>

      <Section title="Badges (shadcn)">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </Section>

      <Section title="Form fields (CMS)">
        <div className="grid max-w-md grid-cols-1 gap-5">
          <label className="flex flex-col gap-1.5 text-sm text-text">
            <span className="font-medium">Text input</span>
            <input className={fieldClass} placeholder="e.g. Production-Grade Architecture" />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-text">
            <span className="font-medium">Textarea</span>
            <textarea className={fieldClass} rows={3} placeholder="Short description…" />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-text">
            <span className="font-medium">Select</span>
            <select className={fieldClass}>
              <option>SaaS & Web Apps</option>
              <option>Marketplace</option>
              <option>AI Products</option>
            </select>
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-text">shadcn input + label</span>
            <Label htmlFor="ds-input">Email</Label>
            <Input id="ds-input" type="email" placeholder="you@paistudio.co" />
          </div>

          <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-text">
            <span className="relative inline-flex h-5 w-9 shrink-0 items-center">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <span className="absolute inset-0 rounded-full bg-cream transition-colors peer-checked:bg-brand" />
              <span className="absolute left-0.5 h-4 w-4 rounded-full bg-paper shadow transition-transform peer-checked:translate-x-4" />
            </span>
            Toggle switch
          </label>

          <label className="flex items-center gap-2 text-sm text-text">
            <input type="checkbox" className="h-4 w-4 rounded border-ink/20 text-brand focus:ring-brand/40" />
            Checkbox
          </label>
        </div>
      </Section>

      <Section title="Radius & spacing">
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 rounded-[8px] bg-cream" />
            <p className="font-mono text-xs text-muted">8px</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 rounded-[12px] bg-cream" />
            <p className="font-mono text-xs text-muted">12px</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 rounded-[16px] bg-cream" />
            <p className="font-mono text-xs text-muted">16px</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 rounded-[24px] bg-cream" />
            <p className="font-mono text-xs text-muted">24px</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 rounded-full bg-cream" />
            <p className="font-mono text-xs text-muted">full (pills)</p>
          </div>
        </div>
      </Section>
    </div>
  );
}
