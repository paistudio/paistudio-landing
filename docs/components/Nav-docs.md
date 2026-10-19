# Nav

**File:** `src/components/nav/Nav.tsx`
**Type:** Client component (`"use client"`) — uses `useScrollDriver`,
local state
**Renders inside:** `app/page.tsx` (the homepage/index — second child,
after `FixedBackground`, `theme="dark"`, `chromeVariant="v2"`), and
`app/work/page.tsx`, `app/work/[slug]/page.tsx`, `app/blog/page.tsx`,
`app/blog/[slug]/page.tsx`, `app/faq/page.tsx` (all `theme="light"`,
default `chromeVariant`)
**Reference spec:** the homepage's usage (`theme="dark"`, no other props)
is the canonical behavior. Everything below is written from that
baseline; `theme="light"` is documented as a diff against it, not as a
separate parallel spec. Note `theme` now only affects `MobileNav`'s
drawer — see Props. `chromeVariant` is documented separately in
`Nav-v2-docs.md`, since it's substantial enough a diff to warrant its own
file rather than a Props-table line.

## Purpose
Fixed top navigation bar: logo (swaps instantly between light/dark
variants as you scroll),
a centered glass-pill link menu with two mega-menus (desktop only), a
"Let's Talk" contact dropdown, and a hamburger trigger that opens
`MobileNav` below 900px.

## Props
| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `theme` | `'light' \| 'dark'` | no | `'dark'` | Controls **only `MobileNav`'s drawer chrome** (background, border, shadow) — a per-page fallback for that one full-screen-ish overlay, which doesn't sit as translucent glass directly over scrolling content the way the pill/`MegaMenu`/`LetsTalkMenu` do. Everything else (pill/hamburger/`MegaMenu`/`LetsTalkMenu` chrome, logo, text color) is driven dynamically by `navOnLight` instead — see Behavior. |
| `chromeVariant` | `'v1' \| 'v2'` | no | `'v1'` | Selects which color pair the pill/hamburger/`MegaMenu`/`LetsTalkMenu` chrome resolves to while `navOnLight` is `true`. `'v1'` is the light-glass pill described throughout this doc. `'v2'` swaps that one case for a solid dark pill instead — full spec in `Nav-v2-docs.md`. Currently only the homepage passes `'v2'`. |

## Local State
- `mobileOpen: boolean` — controls whether `MobileNav` is open.

## Dependencies
- `BUILD_MENU`, `RESOURCES_MENU` — `src/lib/data/nav.ts`
- `useScrollDriver()` — reads `navOnLight` (drives logo + text color, see
  Behavior); calls `gotoId('work' | 'pricing')` for the "Our Work"/
  "Pricing" links (falls back to navigating to `/#id` if the target
  section doesn't exist on the current page — see `useScrollDriver.tsx`'s
  `gotoId`)
- `MegaMenu` (`./MegaMenu.tsx`) — "Build" and "Resources" dropdowns,
  receives `navOnLight` (raw) + `chromeVariant` for its trigger hover
  tint + panel chrome; its trigger's text color is **not** passed
  explicitly — it inherits the pill's dynamic text color via
  `text-current` (see Behavior)
- `LetsTalkMenu` (`./LetsTalkMenu.tsx`), `variant="nav"`, `align="right"`,
  receives `navOnLight` (raw) + `chromeVariant` for both its chrome
  (trigger/panel) and its label text color — it's rendered outside the
  main pill, so it can't inherit either via `text-current` and needs the
  value passed explicitly
- `MobileNav` (`./MobileNav.tsx`), receives `theme` — the drawer is an
  opaque-ish overlay with its own dedicated background, so it does not
  need `navOnLight`
- `next/image` for both logo variants; `next/link` for the logo's link to `/`

## Behavior

### Logo, text color, AND chrome — all dynamic, on every page
This is the part that must match the homepage's original swap logic
exactly (which section is currently behind the nav), generalized to work
on any page. It comes entirely from
`navOnLight` (`useScrollDriver`'s state, computed once per scroll tick —
see `useScrollDriver.tsx`), **not** from the `theme` prop. This used to be
split — chrome was a static per-page `theme` choice while only text/logo
tracked scroll position — which left the pill nearly invisible whenever a
page's dominant theme didn't match what was currently scrolled behind the
nav (dark glass barely visible on the homepage's pinned "Our Work"
section; light glass barely visible on any light page's dark green
footer). Chrome now flips together with text/logo instead of staying
fixed:

- Logo: two stacked `<Image fill>` elements
  (`paistudio-logo-dark.svg` = black wordmark, for light backgrounds;
  `paistudio-logo-light.svg` = white wordmark, for dark backgrounds),
  swapped via inline `style={{ opacity }}`. `showDarkLogo = navOnLight`
  — dark logo shows whenever nav is currently over a light-background
  section, light logo otherwise. **No transition** — the swap is instant
  (deliberately: the navbar itself carries no animation of its own, see
  `docs/animation-specs.md`'s scope note; only page *content* animates).
- Center pill text is `text-white/82` and the hamburger icon is
  `text-white` **regardless** of `navOnLight` now — both chrome states
  are a dark surface (see below), so there's no longer a light/dark text
  branch to flip; was `text-text/82`/`text-white/82` before the pill's
  `navOnLight` case switched from light glass to solid `bg-ink` (on
  request — "ketika background halaman warna putih, nav-link container
  dan warna cta ganti jadi deep blue", corrected one message later to
  "not deep [blue], but ink").
- Pill/hamburger chrome (background, shadow — no border, see Visual
  Specs) follows `navOnLight`: solid `bg-ink` (black) when
  `navOnLight`, translucent dark glass (`bg-white/8`) otherwise — see
  Visual Specs for the full class strings. Also an instant snap, no
  transition.
- `MegaMenu`'s trigger text is `text-current` — it inherits the pill's
  color automatically, no separate wiring needed — but its panel/hover
  chrome doesn't live inside the pill, so `Nav` passes it `navOnLight`
  explicitly too. `LetsTalkMenu`'s nav trigger sits *outside* the pill
  entirely (see Visual Specs), so `Nav` passes it `navOnLight` for both
  its chrome and its label color (also instant, no transition).

**How `navOnLight` is computed** (in `useScrollDriver.tsx`, not this
file): `navOnLight = overLightWork || (any `[data-nav-bg="light"]`
element currently spans the nav's vertical position)`.
- `overLightWork` is the homepage's original, pin-section-specific
  formula (unchanged — tied to the pinned "Our Work" gallery's exact
  geometry, preserves the homepage's tuned swap-trigger timing
  bit-for-bit).
- The `[data-nav-bg="light"]` check is the generalization: any page can
  mark a wrapping element that way and get the same "dark nav over this,
  light nav everywhere else" behavior, without needing homepage-specific
  pin math. `/work` marks its main content wrapper this way; its
  `FinalCtaFooter` section is deliberately left unmarked, so nav
  correctly flips back to light/white text once scrolled down to that
  dark green panel — this fixes a real inconsistency where an earlier
  version of this component hardcoded `theme="light"` pages to always
  show the dark logo/text, which stayed dark (wrongly) even over the
  page's own dark footer.

### `MobileNav`'s drawer — still a static per-page choice, via `theme`
The one remaining `theme`-driven surface. The drawer is a near-opaque
overlay (`bg-[#0c0c0ae6]` dark / `bg-white/90` light — see
`MobileNav-docs.md`) that sits above all content rather than blending
translucently with whatever's currently scrolled behind the nav, so it
doesn't have the same "nearly invisible" failure mode the pill/`MegaMenu`/
`LetsTalkMenu` chrome did — there was no bug to fix here, so it was left
as a static per-page choice.

### Links and menus
- Logo links to `/` (the index page) from any page — see Accessibility.
- "Our Work" and "Pricing" are plain links with `onClick` calling
  `e.preventDefault()` + `gotoId('work' | 'pricing')`.
- "Build" and "Resources" are `MegaMenu` instances.
- Right side: `LetsTalkMenu` (hidden below 900px) + a hamburger
  `<button aria-label="Open menu">` (only visible below 900px) that sets
  `mobileOpen(true)`.

## Visual Specs
- `fixed top-0 right-0 left-0 z-40`, `h-20`, `px-10`, `flex
  items-center justify-between`.
- Logo box: `137×24px`, `absolute inset-0` for both image layers.
- Center pill: `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`,
  `rounded-full`, `p-[5px]`, `backdrop-blur-lg backdrop-saturate-150`,
  14px text. Each link/trigger: `rounded-full px-[18px] py-2`.
  - Chrome, `navOnLight`: solid `bg-ink`, hover → `bg-ink/90`, shadow
    `shadow-[0_6px_24px_rgba(255,255,255,0.14),inset_0_1px_0_rgba(255,255,255,0.18)]`
    (same shadow as the `!navOnLight` case — both are dark-fill pills now,
    just a different hue).
  - Chrome, `!navOnLight`: `bg-white/8`, hover → `bg-white/14`, shadow
    `shadow-[0_6px_24px_rgba(255,255,255,0.14),inset_0_1px_0_rgba(255,255,255,0.18)]`.
  - Text: `text-white/82` always — no longer conditional on `navOnLight`
    (both chrome states are a dark fill now, so the same near-white text
    reads fine on either).
- Hamburger button: chrome flips with `navOnLight` the same way as the
  pill (`bg-ink` when `navOnLight` / `bg-white/8` otherwise); icon color
  is `text-white` always, not conditional.

## Responsive Behavior
- **≤900px:** center link pill (`Our Work`/`Build`/`Pricing`/`Resources`)
  is hidden entirely; the desktop `LetsTalkMenu` is hidden; the hamburger
  button appears instead. Padding drops to `px-6`.
- **≤560px:** bar height drops to `68px`, padding to `px-4`.

## Accessibility
- Logo is a real `next/link` (`<Link href="/">`) with `aria-label="Paistudio
  home"` — clicking/tapping it from any page navigates to the index page.
  Previously `href="#"` (an inert same-page anchor everywhere except the
  homepage itself); fixed to actually navigate.
- Hamburger button has `aria-label="Open menu"`,
  `aria-haspopup="true"`, `aria-expanded={mobileOpen}`.
- "Our Work"/"Pricing" smooth-scroll links remain real `<a href="#...">`
  elements (not `<button>` or `<div>`) so they're still keyboard-focusable
  and behave sensibly with `preventDefault` fallback if JS fails.
- No `prefers-reduced-motion` handling needed here: the logo/text/chrome
  swap driven by `navOnLight` is an instant snap with no transition (see
  Behavior), so there's no motion to reduce in the first place. This was
  previously an animated 450ms/`transition-colors` fade with a flagged
  reduced-motion gap; both the animation and the gap were removed
  together — the navbar carries no animation of its own, by design (see
  `docs/animation-specs.md`'s scope note).
