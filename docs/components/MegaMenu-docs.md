# MegaMenu

**File:** `src/components/nav/MegaMenu.tsx`
**Type:** Client component (`"use client"`), local state only
**Used by:** `Nav` — two instances, "Build" (2 columns) and "Resources"
(1 column), receiving `Nav`'s own raw dynamic `navOnLight` value and its
`chromeVariant` on every page

## Purpose
Reusable hover-or-focus-opened dropdown panel for desktop nav items with
sub-links, grouped into 1 or more labeled columns.

## Props
| Prop | Type | Required | Description |
|---|---|---|---|
| `label` | `string` | yes | Trigger button text (e.g. "Build", "Resources"). |
| `columns` | `{ title?: string; links: NavLink[] }[]` | yes | One or more columns of links. `title` is optional — omit for a single untitled list (used by "Resources"). |
| `panelWidthClassName` | `string` | yes | Tailwind width class applied to the dropdown panel (e.g. `"w-[420px]"` for Build's 2-column layout, `"w-[230px]"` for Resources' 1-column layout). |
| `navOnLight` | `boolean` | no | Default `false`. Passed through *raw* from `Nav`'s own dynamic `navOnLight` (what's currently scrolled behind the nav — see `Nav`'s docs), **not** from `Nav`'s `theme` prop, which no longer affects this component. Combined with `chromeVariant` to compute `isLightChrome` (panel/title/link colors) and `isDarkOnLight` (trigger hover only) internally — see Visual Specs and `Nav-v2-docs.md`. |
| `chromeVariant` | `'v1' \| 'v2'` | no | Default `'v1'`. Mirrors `Nav`'s own `chromeVariant` — full story in `Nav-v2-docs.md`. `'v2'` only changes the trigger's *hover* tint (`hover:bg-ink/75` instead of `hover:bg-white/14`) while `navOnLight` is `true`; panel/title/link colors are unaffected by this prop (they only care about `isLightChrome`, and are already safe to reuse as-is — see Behavior). |

`NavLink = { label: string; href: string }` (from `src/types/content.ts`).

## Local State
- `open: boolean`

## Dependencies
- `next/link` for each rendered link
- No app-level context — fully self-contained/reusable.

## Behavior
- Trigger text color is **not** passed as a separate prop — the trigger's
  `text-current` inherits whatever color `Nav`'s pill wrapper currently
  has. `navOnLight` + `chromeVariant` drive this component's own panel
  chrome and the chevron/link hover tint (see Visual Specs) — previously
  a static per-page `theme` choice, now flips together with the pill it
  drops down from (see `Nav-docs.md`'s Behavior section for why that
  changed).
- The trigger has no background of its own at rest — only `text-current`
  and a hover tint — so it composites over whatever `Nav`'s pill is
  currently showing rather than directly over the page. That's why its
  hover value only needed a same-family swap (`hover:bg-white/14` →
  `hover:bg-ink/75` in `v2`) rather than the more involved rest-state fix
  `LetsTalkMenu`'s trigger needed (it has its own rest-state background,
  which does sit directly against the page) — see `Nav-v2-docs.md`'s
  Implementation section for the full comparison.
- Opens on `onMouseEnter` (closes on `onMouseLeave`) **and** on
  `onFocus` of the trigger button (keyboard users tabbing to the trigger
  open it too, not just mouse hover) — this is the accessibility fix vs.
  the source prototype, which was hover-only with no keyboard path at
  all.
- `onBlur` on the wrapping `<div>` closes the menu, but only if the new
  focus target (`e.relatedTarget`) is **outside** the wrapper — so
  tabbing from the trigger into one of the panel's links does not close
  the menu.
- `onKeyDown` on the wrapper: `Escape` closes the menu and returns focus
  to the trigger button.
- Trigger is a real `<button type="button">` with `aria-haspopup="true"`
  and `aria-expanded={open}` — also toggles on click (not hover-only).
- Closed state uses `visibility: hidden` (not just `opacity: 0`) so the
  panel's links are removed from the tab order while closed, preventing
  keyboard users from tabbing into invisible content.
- Any link whose `href` starts with `http` is treated as external and
  rendered with `target="_blank" rel="noopener"` automatically (e.g.
  `RESOURCES_MENU`'s "Bubble Plugins" → the contributor's Bubble.io
  profile); internal hrefs (`#`, `#work`, `/blog`, ...) stay same-tab. No
  `external` flag needed on `NavLink` — this is inferred from the href
  itself.

## Visual Specs
- Trigger: `inline-flex items-center gap-1.5`, `rounded-full px-[18px]
  py-2`; chevron SVG (9×9, `opacity-60`) that does not currently rotate
  on open (static icon). Hover: `bg-white/14` (default dark case) /
  `bg-ink/90` (`isLightChrome` or `greyChromeOnLight` —
  `chromeVariant="v2"` + `navOnLight`, named `isDarkOnLight` in an
  earlier pass) — both light-background cases now hover the same
  near-black tint, since the trigger itself inherits the parent pill's
  now-unconditional `bg-ink` fill rather than a light-glass one (see
  `Nav-docs.md`'s Behavior section).
- Panel: `absolute left-1/2 top-full`, offset via `translate(-50%, 0 | 8px)`,
  `pt-3.5` gap from trigger, 200ms opacity/transform transition.
- Panel surface: `rounded-[32px]`, `backdrop-blur-2xl backdrop-saturate-150`,
  `flex gap-7` between columns, `px-4 py-[22px]`.
  - `!isLightChrome` (covers both the default dark case and
    `isDarkOnLight` — the panel itself doesn't need a third branch, only
    the trigger's hover does): `border-white/14`, `bg-[#121210f2]`,
    `shadow-[0_18px_48px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.12)]`.
  - `isLightChrome`: `border-ink/10`, `bg-white/95`,
    `shadow-[0_18px_48px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6)]`
    (softer shadow, brighter inset highlight).
- Column title (if present): 12px uppercase, `tracking-[0.1em]`,
  `mb-2 px-2.5`. `text-white/66` (`!isLightChrome`) / `text-text/66`
  (`isLightChrome`).
- Links: `rounded-full px-2.5 py-[7px]`, 14px.
  `text-white/90`, hover → `bg-white/10 text-white` (`!isLightChrome`) /
  `text-text/90`, hover → `bg-ink/8 text-text` (`isLightChrome`) — these
  link hovers are safe to leave as-is in `v2` too, since they composite
  over the panel's own opaque background, not directly over the page.

## Responsive Behavior
None — this component is only ever rendered inside `Nav`'s desktop pill
(hidden ≤900px at the `Nav` level); it has no internal breakpoints of its
own.

## Accessibility
- `aria-haspopup="true"`, `aria-expanded`, real `<button>` trigger.
- Keyboard-operable: focus opens, `Escape` closes and restores focus,
  `visibility:hidden` removes hidden links from tab order.
- Chevron icon is `aria-hidden="true"`.
