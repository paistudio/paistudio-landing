# LetsTalkMenu

**File:** `src/components/nav/LetsTalkMenu.tsx`
**Type:** Client component (`"use client"`), local state only
**Used by:** `Nav` (`variant="nav"`, `align="right"`, receives `Nav`'s
raw dynamic `navOnLight` and its `chromeVariant`) and `FinalCtaFooter`
(`variant="footer"`, `align="center"`, no props needed — footer is
always dark)

## Purpose
Avatar + "Let's Talk" trigger button that opens a small dropdown with 3
real contact destinations: WhatsApp, Email, Schedule a call. Shared
between the nav bar and the final CTA section so both always point to the
same real links (fixes a source-prototype bug where the nav's version had
`href="#"` placeholders while the footer's identical-looking version had
real links).

## Props
| Prop | Type | Required | Description |
|---|---|---|---|
| `variant` | `'nav' \| 'footer'` | yes | Controls trigger button styling (nav: subtler `bg-white/8`; footer: brighter `bg-white/12`, larger label) and whether the label collapses on mobile (nav variant only). |
| `align` | `'right' \| 'center'` | yes | Panel horizontal anchor: `'right'` anchors the panel's right edge to the trigger's right edge (nav); `'center'` centers the panel under the trigger (footer). |
| `navOnLight` | `boolean` | no | Default `false`. Controls **both chrome** (trigger + panel background/border/shadow) **and label text color** — **only affects `variant="nav"`**, computed as `isLightNav = variant === 'nav' && chromeVariant === 'v1' && navOnLight` (see `chromeVariant` below). The `footer` variant always keeps its dark chrome + white text regardless of this prop, since `FinalCtaFooter`'s dark green CTA panel is a fixed brand accent, not themed per page. This is `Nav`'s dynamic "what's currently behind the nav" value (see `Nav`'s docs) passed straight through — chrome and label used to be split (chrome via a static `theme` prop, label via `navOnLight`), which meant a page's fixed chrome could go nearly invisible against whatever was actually scrolled behind the nav; both are driven by the same `navOnLight` value now so they always flip together (see `Nav-docs.md`'s Behavior section for the full story). |
| `chromeVariant` | `'v1' \| 'v2'` | no | Default `'v1'`. Mirrors `Nav`'s own `chromeVariant` (see `Nav-v2-docs.md`) — only matters together with `navOnLight={true}` and `variant="nav"`. `'v1'`: unchanged (`isLightNav` branch). `'v2'`: a **third** trigger-chrome branch, `isDarkOnLight = variant === 'nav' && chromeVariant === 'v2' && navOnLight` — opaque `bg-ink/90`, not a reuse of the existing `!isLightNav` branch. That branch is `bg-white/8` (translucent white, tuned for a *dark* page behind it); collapsing straight into it via a passed-in `false` — which is what `Nav` originally did here, and still does for `MegaMenu` — produced an invisible trigger over `v2`'s actually-white page. Fixed by giving this component its own explicit dark-on-light value instead of reusing `!isLightNav`'s. |

## Local State
- `open: boolean`

## Dependencies
- `LETS_TALK_LINKS` — `src/lib/data/nav.ts` (single source of truth:
  `whatsapp: https://wa.me/6288233443399`, `email: mailto:hi@paistudio.co`,
  `scheduleCall:` the direct URL to the Google Calendar Appointment
  Scheduling booking page — migrated from Cal.com. Deliberately just a
  plain link, not Google's `calendar.schedulingButton.load(...)` embed
  script/widget: that script renders its own third-party-styled button
  into a target element, which would break the visual/interaction
  consistency with the WhatsApp/Email rows in this same dropdown (and
  Google's booking page works perfectly as a direct URL — the widget is
  only a convenience wrapper around it, not a requirement).)
- `next/image` for the avatar (`/avatars/appai.jpeg`)
- Local `LINKS` array (not exported) pairs each `LETS_TALK_LINKS` entry
  with its label and inline SVG icon (WhatsApp green, Email orange
  outline, Calendar green outline)

## Behavior
- Same open/close pattern as `MegaMenu`: hover (enter/leave) + focus +
  click-toggle on the trigger, `Escape`-to-close-and-refocus, `onBlur`
  closes only when focus leaves the whole wrapper, `visibility:hidden`
  removes the panel's links from the tab order while closed.
- Each link in the panel is a real `<a>`; WhatsApp and Schedule-a-call
  open in a new tab (`target="_blank" rel="noopener"`); Email is a plain
  `mailto:` link (no `target`).

## Visual Specs
- Trigger (`nav` variant, `!isLightNav && !isDarkOnLight`, default
  chrome): `flex items-center gap-3`, `rounded-full`, `border-white/16`,
  `bg-white/8`, `py-2 pr-4 pl-2`,
  `shadow-[0_6px_24px_rgba(255,255,255,0.14),inset_0_1px_0_rgba(255,255,255,0.18)]`,
  `backdrop-blur-lg backdrop-saturate-150`, hover → `bg-white/16`.
- Trigger (`nav` variant, `isLightNav`): solid `bg-ink`,
  `shadow-[0_6px_24px_rgba(255,255,255,0.14),inset_0_1px_0_rgba(255,255,255,0.18)]`
  (same shadow as the default dark trigger), hover → `bg-ink/90` — was
  light glass (`bg-ink/5`), changed to solid black on request ("ketika
  background halaman warna putih, ... warna cta ganti jadi deep blue",
  corrected one message later to "not deep [blue], but ink").
- Trigger (`nav` variant, `greyChromeOnLight` — `chromeVariant="v2"` +
  `navOnLight`, named `isDarkOnLight` in an earlier pass): solid
  `bg-ink` (no shadow), hover → `bg-ink/90` — now the same value as the
  `isLightNav` branch above, not a separate near-opaque black
  (`bg-ink/90`).
- Trigger (`footer` variant): same shape as the dark nav trigger but
  brighter surface (`border-white/30`, `bg-white/12`), `pr-5`, hover →
  `bg-white/20`, label is `font-medium` — **unaffected by `navOnLight`/
  `chromeVariant`**.
- Label color, `nav` variant: always `text-white`, not conditional on
  `isLightNav`/`greyChromeOnLight` at all anymore — every trigger state
  is a dark fill now (`bg-ink` or dark glass, see Visual Specs above),
  so there's no light-background case left needing dark label text.
  Label color, `footer` variant: always `text-white` (unchanged).
- Avatar: 32×32px circle, `object-cover` (same for all variants/states).
- Panel: `w-[212px]`, `rounded-[32px]`, `p-3.5`, same blur treatment as
  `MegaMenu`. Each link: `flex items-center gap-[11px]`, `rounded-full
  px-3 py-2.5`, 14px.
  - `!isLightNav` (includes `variant="footer"`, which is never
    `isLightNav`): `border-white/14`, `bg-[#121210f2]`, links
    `text-white/90` hover → `bg-white/10`.
  - `isLightNav`: `border-ink/10`, `bg-white/95`, links `text-text/90`
    hover → `bg-ink/8`.

## Responsive Behavior
- **`nav` variant, ≤560px:** trigger padding shrinks
  (`py-[5px] pr-3 pl-[5px]`) and the text label is hidden entirely
  (`max-[560px]:hidden`) — collapses to an icon-only avatar button to
  save space in the compact mobile nav bar.
- `footer` variant has no responsive overrides (footer CTA has more
  breathing room at all widths).

## Accessibility
- Real `<button>` trigger with `aria-haspopup="true"` / `aria-expanded`.
- Keyboard-operable identically to `MegaMenu` (focus-open, Escape-close,
  blur-aware close, hidden-panel removed from tab order).
- All 3 panel links are real `<a href>` elements with visible text labels
  (not icon-only), so no extra `aria-label` is needed on them.
