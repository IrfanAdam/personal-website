/* ADAM/DS — ds/motion-panes · vertical Motion panes ·
   [plan:2026-09-23_174000-motion-elements-vertical.md#phase-1] */
// Exports: panes — 5 vertical tabs (Durations→Contract)
import { cssVar, code } from './specimens.js';
import { USES } from './foundations/motion/data.js';
import { bars, stage, blurs } from './foundations/motion/sections.js';

// — Helpers —
const row = ([n, t, what]) => [
  `<tr data-copy-token="${t}" title="Copy ${t}">`,
  `<td class="fx-name">${n}</td><td><span class="tok">${t}</span></td>`,
  `<td><p class="fx-what">${what}</p></td>`,
  `<td class="fx-live" data-live="${t}">${cssVar(t)}</td></tr>`,
].join('');
const tbl = (rows) => [
  `<div class="fx-scroll"><table class="fx-table"><thead><tr>`,
  `<th>Step</th><th>Token</th><th>What it does</th><th>Live</th>`,
  `</tr></thead><tbody>${rows.map(row).join('')}</tbody></table></div>`,
].join('');

// — Panes —
export const panes = [
  {
    label: 'Durations',
    html: [
      `<h3>Durations — true-scale</h3>`,
      `<p class="sub">Bars are true-scale to the longest step; values read live. Reach for the use, not the number.</p>`,
      bars(),
      tbl(USES),
    ].join(''),
  },
  {
    label: 'Easing',
    html: [
      `<h3>Easing — signature curve</h3>`,
      `<p class="sub">One curve with a fast-out, soft-land feel runs all signature travel. Standard <span class="tok">ease</span> is ambient-only.</p>`,
      tbl([['Signature', '--ease-signature', 'fast-out soft-land · frame + zoom + reveal'], ['Standard', '--ease-standard', 'ease · ambient loops only']]),
      stage(),
    ].join(''),
  },
  {
    label: 'Interaction',
    html: [
      `<h3>Press · hover — live</h3>`,
      `<p class="sub">All hover is a border/outline, never a tint.</p>`,
      `<div class="fd-rowbtns"><button class="fd-press">press me</button></div><div class="fd-hover">hover me — unselected rows dim</div>`,
      tbl([['Press squash', '--scale-press', '0.94 · button press'], ['Hover dim', '--opacity-hover', '0.55 · unselected row hover'], ['Zoom settle', '--scale-zoom', '1.015 · image hover zoom']]),
    ].join(''),
  },
  {
    label: 'Depth',
    html: [
      `<h3>Depth — line + frost, never shadow</h3>`,
      `<p class="sub">Elevation is a 1px line plus frosted blur. Shadows exist only on-media and in the viewer.</p>`,
      blurs(),
      tbl([['Header frost', '--blur-header', 'sticky header over scroll'], ['Card scrim', '--blur-scrim', 'card scrim over photos'], ['Placeholder', '--blur-placeholder', 'image placeholder wash']]),
      tbl([['Saturation header', '--sat-header', '1.6 · frosted header recipe'], ['Saturation scrim', '--sat-scrim', '1.35 · card scrim recipe']]),
    ].join(''),
  },
  {
    label: 'Contract',
    html: [
      `<h3>Reduced motion — contract</h3>`,
      `<p class="sub">The OS setting is honored live: flip <span class="tok">prefers-reduced-motion</span> and every demo on this page goes static.</p>`,
      code(['collapse → instant: shimmer sweep (frozen) · rise / glide / dot travel (none) · grid reveal (instant — guarded in main.js + fx-lab)\\nsurvives: end-states apply instantly (opacity, layout) · theme toggle · nothing is motion-only'].join('')),
    ].join(''),
  },
];
