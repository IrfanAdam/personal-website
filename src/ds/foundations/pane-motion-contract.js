/* ADAM/DS — ds/foundations/pane-motion-contract · contract pane ·
   [plan:2026-09-28_130000-code-cleanup-perf.md#phase-1] */
// Exports: contractPane
import { code } from '../specimens.js';

// — Pane —
export function contractPane() {
  return {
    label: 'Contract · —',
    html: [
      `<h4 class="fx-pane-title">Reduced motion — contract</h4>`,
      `<p class="fx-group-intro">The OS setting is honored live:`,
      ` flip <span class="tok">prefers-reduced-motion</span> and every demo on this page goes static.</p>`,
      code([
        'collapse → instant: shimmer sweep (frozen) · rise / glide / dot travel (none) ·',
        ' grid reveal (instant — guarded in main.js + fx-lab)\\nsurvives:',
        ' end-states apply instantly (opacity, layout) · theme toggle · nothing is motion-only',
      ].join('')),
    ].join(''),
  };
}
