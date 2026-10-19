# Nav v2

**Status:** Implemented, via a `chromeVariant` prop on the existing `Nav`
(not a separate component/file) — `chromeVariant="v2"`. Default remains
`"v1"` (the original, unchanged behavior), so this is opt-in per usage.
**Currently used on:** `app/page.tsx` (the homepage) only — `<Nav
chromeVariant="v2" />`. Every other page still uses the default `"v1"`.

**Relationship to `Nav`:** identical in every respect (structure, props,
links, `MegaMenu`/`LetsTalkMenu`/`MobileNav` composition, responsive
behavior, accessibility) **except** the chrome/text treatment used while
`navOnLight` is `true` — i.e. whenever the section currently scrolled
behind the nav is white/light. Everything below is written as a diff
against `Nav-docs.md`; anything not mentioned here is unchanged.

## The one change

The pill/hamburger/`LetsTalkMenu`-trigger/`MegaMenu`-panel chrome that
shows while `navOnLight` is `true` (white/light section behind the nav)
used to differ between `v1` (light glass) and `v2` (opaque near-black) —
both are now the **same** solid `bg-ink` (black) pill with white
text, on request ("ketika background halaman warna putih, nav-link
container dan warna cta ganti jadi deep blue", corrected one message
later to "not deep [blue], but ink"), so this is no longer a
`v1`-vs-`v2` distinction for the `navOnLight` case specifically — see
Values.

**What does *not* change:** the other case — `navOnLight = false`, i.e.
the nav is over a dark section — keeps each variant's own dark-glass
treatment (`v1`: `bg-white/8`; `v2`: `bg-white/12`), white text, same as
before. Only the white-section case's *value* changed; the
`navOnLight`-driven branching mechanism itself is untouched (see
`Nav-docs.md`'s Behavior section for why chrome tracks `navOnLight` at
all — the "nearly invisible pill" bug this project fixed once already).

**Logo is explicitly excluded.** The brand logo sits directly on the page
background, not inside the pill — its dark/light swap (`showDarkLogo =
navOnLight`) is identical in both variants: dark logo over white/light
sections, light logo otherwise, regardless of `chromeVariant`.

## Values

| Surface | `navOnLight`, v1 | `navOnLight`, v2 | `!navOnLight`, v1 | `!navOnLight`, v2 |
|---|---|---|---|---|
| Center pill chrome (rest) | `bg-ink shadow-[0_6px_24px_rgba(255,255,255,0.14),inset_0_1px_0_rgba(255,255,255,0.18)]` | `bg-ink` (no shadow) | `bg-white/8 shadow-[0_6px_24px_rgba(255,255,255,0.14),inset_0_1px_0_rgba(255,255,255,0.18)]` | `bg-white/12` (no shadow) |
| Pill link hover | `hover:bg-ink/90` | `hover:bg-ink/90` | `hover:bg-white/14` | `hover:bg-white/20` |
| Pill text | `text-white/82` | `text-white/82` | `text-white/82` | `text-white/82` |
| Hamburger chrome | `bg-ink` | `bg-ink` | `bg-white/8` | `bg-white/12` |
| Hamburger icon | `text-white` | `text-white` | `text-white` | `text-white` |
| `MegaMenu` trigger hover | `hover:bg-ink/90` | `hover:bg-ink/90` | `hover:bg-white/14` | `hover:bg-white/20` |
| `LetsTalkMenu` trigger chrome (nav variant, rest) | `bg-ink shadow-[...]` (same `isLightNav` branch as the pill) | `bg-ink` (same `greyChromeOnLight` branch as the pill) | `bg-white/8 shadow-[...]` | `bg-white/12` |
| `LetsTalkMenu` trigger hover | `hover:bg-ink/90` | `hover:bg-ink/90` | `hover:bg-white/16` | `hover:bg-white/20` |
| `LetsTalkMenu` label (nav variant) | `text-white` | `text-white` | `text-white` | `text-white` |
| `MegaMenu` panel chrome | light panel (`bg-white/95 border-ink/10 ...`, unchanged) | dark panel (`bg-[#121210f2] border-white/14 ...`, unchanged) | dark panel (unchanged) | dark panel (unchanged) |
| `MegaMenu`/`LetsTalkMenu` panel links + hover | light-panel text/hover (unchanged) | dark-panel text/hover (unchanged) | dark-panel text/hover (unchanged) | dark-panel text/hover (unchanged) |
| Logo | dark variant shown (unchanged — sits outside the pill, not part of this change) | dark variant shown (unchanged) | light variant shown (unchanged) | light variant shown (unchanged) |

**Note the dropdown panels are deliberately untouched** — `MegaMenu`'s and
`LetsTalkMenu`'s flyout panels still use their own light/dark card
treatment regardless of `navOnLight`'s new `bg-ink` pill, since they're
a separate overlay surface, not "the nav-link container" or "the CTA"
itself.

**Net effect:** `navOnLight` no longer selects between two *visually
distinct* chrome directions in **either** variant now — `v1` and `v2`
both collapse pill/hamburger/`LetsTalkMenu` chrome+text to the same "dark
surface, white text" read in every scroll state (`bg-ink` fill when the
page is white, a translucent dark glass fill when the page is dark —
different values, same resulting contrast direction). Every hover state
stays within that same dark family too (`hover:bg-ink/90` or a lighter
white-overlay tint, never a swap to a light/translucent value against a
dark fill). Chrome is still conditional on `navOnLight` — both branches
just resolve to a dark surface now instead of one branch using a light
one. `v1` and `v2` still differ from each other in the `!navOnLight` case
(`bg-white/8` vs `bg-white/12`, see table) — that distinction is
untouched. Only the standalone logo still visibly flips between its two
variants as you scroll.

**Panels included:** the dropdown panels (`MegaMenu`, `LetsTalkMenu`)
follow the same inversion as their triggers, not just the triggers
themselves — a panel opening in the opposite brightness from the trigger
it drops down from would read as a bug, not a variant.

## Implementation

A new `chromeVariant?: 'v1' | 'v2'` prop on `Nav` (default `'v1'`) feeds
two derived booleans: `isLightChrome = chromeVariant === 'v1' &&
navOnLight` (`v1` behaves exactly as before — `isLightChrome ===
navOnLight`; `v2` makes it always `false`), and `greyChromeOnLight =
chromeVariant === 'v2' && navOnLight` (the new case specifically — named
`isDarkOnLight` in an earlier pass of this doc/code; current name is
`greyChromeOnLight`, see `Nav.tsx`). `isLightChrome` is passed as
`MegaMenu`'s `navOnLight` prop for its panel/title/link colors (those
stay light-vs-dark-card, untouched by this change). `greyChromeOnLight`
drives the *rest-state* chrome values that need a genuinely new color
(`Nav`'s `chromeClass`/`hamburgerChromeClass`, `LetsTalkMenu`'s trigger
via its own `chromeVariant` prop) — now solid `bg-ink`, superseding the
near-opaque `bg-ink/90` this section originally shipped with (and
briefly `bg-deep` in between), on request ("ketika background halaman
warna putih, ... warna cta ganti jadi deep blue", corrected one message
later to "not deep [blue], but ink"). `Nav`'s own
`textColorClass`/`hamburgerTextClass` are no longer
conditional on `isLightChrome` at all — both resolve to `text-white/82`/
`text-white` unconditionally now, since every chrome state is a dark
fill (see `Nav-docs.md`'s Behavior section).

**Two rounds of fixes were needed, both from the same root cause: a
`hover:bg-*`/`bg-*` pair on one element replaces the whole
`background-color` on hover, it doesn't layer a highlight on top of the
rest-state fill.** Any *translucent* value on either side of that pair —
tuned for one specific kind of background behind it — breaks the moment
the actual page doesn't match what it was tuned for:

1. **Rest state (`LetsTalkMenu` trigger only).** Its existing "dark"
   branch, `bg-white/8`, is translucent white meant to pick up glow from
   a *dark* page. Reusing it for `v2`'s white-page case (by passing a
   collapsed `false` boolean into the existing branch, the same trick
   that worked fine for `MegaMenu`) rendered a fully transparent pill
   with white-on-white text. Fixed by giving `LetsTalkMenu` its own
   `chromeVariant` prop so it computes a real `isDarkOnLight` branch with
   an opaque `bg-ink/90` (copied from `Nav`'s own pill).
2. **Hover state (`Nav`'s pill links, `MegaMenu`'s trigger, and
   `LetsTalkMenu`'s trigger).** All three had a `hover:bg-white/14` or
   `hover:bg-white/16` left over from `v1`/the dark-page case. On
   `LetsTalkMenu`'s trigger this was a second, independent instance of
   exactly the bug above — the *rest* state got fixed to `bg-ink/90` but
   its `hover:` pair was never updated, so hovering it swapped straight
   back to invisible. `Nav`'s pill links and `MegaMenu`'s trigger don't
   have their own rest-state background (they inherit the parent pill's),
   so their white hover only ever composited as a highlight over that
   pill, not directly over the page — not a confirmed invisibility bug
   the way the other two were, but a stray white highlight standing out
   against dark-family surfaces was still the wrong direction, and was
   changed to match for visual consistency. All three now use
   `hover:bg-ink/75` (a lighter shade of the same dark family) instead.

**Lesson for extending this further:** check *every* value on a branch
being reused via a substitute/collapsed boolean — including its
`:hover`/`:focus` pairs, not just its rest state. A value is only safe to
reuse as-is if it's opaque, or if it's layered over a guaranteed-opaque
parent (like a link inside an opaque dropdown panel). Anything
translucent and tuned for one specific background needs its own explicit
`v2` value, checked at every interaction state it has, not just the one
that happens to get exercised first.

No changes to `MobileNav` — its chrome is still the separate,
`theme`-driven static treatment `Nav-docs.md` already describes, unrelated
to `chromeVariant`.
