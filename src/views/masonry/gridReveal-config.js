/* ADAM/FX — masonry/gridReveal-config · reveal tokens ·
   [plan:2026-09-13_235413-over-limit-splits.md#phase-3] */
// Exports: fx, darkNow, cellCount — token readers + cell geometry helper
import { fxNum, fxMs } from '../fx-tokens.js';
/* Graduated motion tokens — getComputedStyle with shipped-literal fallback,
   so first paint is pixel-identical with or without the token. Read once per
   attach (never per-frame): getComputedStyle per cell costs. */
export const fx = () => ({
  target: fxNum('--fx-cell', 30),
  waitCap: fxNum('--fx-wait', 0.72),
  photoFrom: fxNum('--fx-photo-from', 0.93),
  colorMs: fxMs('--dur-fx-color', 240),
  spanS: fxMs('--dur-fx-span', 600) / 1000,
  morph: fxNum('--fx-morph', 0.04),
  splitEnd: fxNum('--fx-split-end', 0.92),
  sheen: fxNum('--fx-sheen', 0.14),
});
export const darkNow = () => { const t = document.documentElement.dataset.theme;
  return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)')
    .matches;
};
// URLs decoded at least once this session — revisits skip the reveal
// (grid rebuilds its <img> nodes per visit, so complete-at-attach misses).
export const cellCount = (box, target) => {
  const r = box.getBoundingClientRect();
  if (!r.width || !r.height) return 120;
  return Math.min(180, Math.max(48, Math.round((r.width * r.height) / (target * target))));
};
