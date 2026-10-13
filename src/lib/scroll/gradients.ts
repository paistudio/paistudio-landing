function lerpHex(a: number[], b: number[], t: number) {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(
    a[2] + (b[2] - a[2]) * t
  )})`;
}

function hexToRgb(hex: string): number[] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

// Hardcoded to the prototype's default theme/atmosphere (Ocean / Balanced) — no live switcher.
// Settles to #0B3E91 (the homepage's "Our Work" section's own background,
// see WorkGallery.tsx — imports this same constant) instead of white, so
// the fixed hero gradient hands off to the Work section's opaque bg with
// no visible color flash between them. FOREST.g2 (the gradient's 53% stop)
// reuses this exact value too — it used to be a separately hardcoded
// rgb(11,61,145), one digit off from the Work section's rgb(11,62,145).
// Both gradient functions below take an optional `targetHex` so a single
// page (e.g. home-playground, running its own experiment) can hand its
// WorkGallery's actual bg color through `ScrollDriverProvider` instead of
// this default — FOREST.g2 stays this fixed value regardless, since it's
// the gradient's own natural resting mid-stop, not the settle target.
export const WORK_BG_HEX = "#0B3E91";
const WORK_BG = hexToRgb(WORK_BG_HEX);
const FOREST = { g1: [6, 16, 46], g2: WORK_BG, g3: [30, 144, 255], g4: [169, 214, 229] };
const ATM_TOP = [4, 6, 14];
const ATM_BOOST = 1.0;

/** Hero background, settling to `targetHex` (default #0B3E91) as the hero scrolls out of view. */
export function heroBgGradient(p: number, targetHex: string = WORK_BG_HEX) {
  const target = targetHex === WORK_BG_HEX ? WORK_BG : hexToRgb(targetHex);
  const settle = Math.max(0, Math.min(1, (p - 0.7) / 0.3));
  const S = (s: number[], boost: number) => lerpHex(s, target, Math.max(settle, Math.min(1, p * boost)));
  const nearBlack = FOREST.g1.map((c) => Math.round(c * 0.45));
  const b = ATM_BOOST;
  return `linear-gradient(180deg, ${S(ATM_TOP, 1.0 * b)} 0%, ${S(nearBlack, 1.1 * b)} 24%, ${S(
    FOREST.g1,
    1.3 * b
  )} 40%, ${S(FOREST.g2, 1.45 * b)} 53%, ${S(FOREST.g3, 1.7 * b)} 68%, ${S(FOREST.g4, 2.0 * b)} 85%, ${S(
    target,
    2.5 * b
  )} 100%)`;
}

/** `targetHex` (settled Our Work bg, default #0B3E91) to dark navy, eased — used behind the "Why Paistudio" CTA section. */
export function ctaBgGradient(q: number, targetHex: string = WORK_BG_HEX) {
  const base = targetHex === WORK_BG_HEX ? WORK_BG : hexToRgb(targetHex);
  const e = q * q * (3 - 2 * q);
  const top = lerpHex(base, [8, 14, 26], e);
  const mid = lerpHex(base, [7, 16, 34], e);
  const bot = lerpHex(base, [5, 11, 20], e);
  return `linear-gradient(180deg, ${top} 0%, ${mid} 46%, ${bot} 100%)`;
}
