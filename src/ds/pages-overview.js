/* ADAM/DS — pages-overview · composer · [plan:2026-09-23_143400-ds-overview-elements-fold.md#phase-1] */
// Exports: title, render, mount — delegates markup/styles to overview-sections
import { attachGlimmerOrb } from '../views/glimmer-orb.js';
import {
  overviewStyle,
  heroHtml,
  principlesHtml,
  elementsMapHtml,
  readingHtml,
  moodHtml,
  checklistHtml,
} from './overview-sections.js';

export const title = 'Overview';

// — Render —
export function render() {
  const y = new Date().getFullYear();
  return `<p class="ds-crumb">ADAM/DS · v1.1.0 — LOSSLESS CYBERPUNK</p>`
    + overviewStyle
    + heroHtml(y)
    + principlesHtml()
    + elementsMapHtml()
    + readingHtml()
    + checklistHtml()
    + moodHtml();
}

// — Mount —
export function mount(root) {
  const c = root.querySelector('[data-lc-orb]');
  if (!c || !c.getContext) return () => {};
  const stop = attachGlimmerOrb(c, {
    state: 'thinking',
    dots: 13,
    level: 0.8,
    size: 132,
  });
  return () => {
    try { stop(); } catch (_) {}
  };
}
