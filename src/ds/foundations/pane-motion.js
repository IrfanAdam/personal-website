/* ADAM/DS — ds/foundations/pane-motion · tabbed tables ·
   [plan:2026-09-23_154500-ds-elev-motion-tables.md#phase-2] */
import { cssVar, note, code } from '../specimens.js';
import { tabs } from '../tabs.js';
import { DURS, USES, BLURS } from './motion/data.js';
import { bars, stage, blurs } from './motion/sections.js';

export const label = 'Motion';
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

const panes = [
  {
    label: `Durations · ${USES.length}`,
    html: [
      `<h4 class="fx-pane-title">Durations — true-scale</h4>`,
      `<p class="fx-group-intro">Bars are true-scale to the longest step; values read live.</p>`,
      bars(),
      `<p class="fx-group-intro">Reach for the use, not the number.</p>`,
      tbl(USES),
    ].join(''),
  },
  {
    label: 'Easing · 2',
    html: [
      `<h4 class="fx-pane-title">Easing — signature curve</h4>`,
      `<p class="fx-group-intro">One curve with a fast-out, soft-land feel runs all signature travel. Standard <span class="tok">ease</span> is ambient-only.</p>`,
      tbl([['Signature', '--ease-signature', 'fast-out soft-land · frame + zoom + reveal'], ['Standard', '--ease-standard', 'ease · ambient loops only']]),
      stage(),
    ].join(''),
  },
  {
    label: 'Interaction · 3',
    html: [
      `<h4 class="fx-pane-title">Press · hover — live</h4>`,
      `<p class="fx-group-intro">All hover is a border/outline, never a tint.</p>`,
      `<div class="fd-rowbtns"><button class="fd-press">press me</button></div><div class="fd-hover">hover me — unselected rows dim</div>`,
      tbl([['Press squash', '--scale-press', '0.94 · button press'], ['Hover dim', '--opacity-hover', '0.55 · unselected row hover'], ['Zoom settle', '--scale-zoom', '1.015 · image hover zoom']]),
    ].join(''),
  },
  {
    label: 'Depth · 5',
    html: [
      `<h4 class="fx-pane-title">Depth — line + frost, never shadow</h4>`,
      `<p class="fx-group-intro">Elevation is a 1px line plus frosted blur. Shadows exist only on-media and in the viewer.</p>`,
      blurs(),
      tbl([['Header frost', '--blur-header', 'sticky header over scroll'], ['Card scrim', '--blur-scrim', 'card scrim over photos'], ['Placeholder', '--blur-placeholder', 'image placeholder wash']]),
      tbl([['Saturation header', '--sat-header', '1.6 · frosted header recipe'], ['Saturation scrim', '--sat-scrim', '1.35 · card scrim recipe']]),
    ].join(''),
  },
  {
    label: 'Contract · —',
    html: [
      `<h4 class="fx-pane-title">Reduced motion — contract</h4>`,
      `<p class="fx-group-intro">The OS setting is honored live: flip <span class="tok">prefers-reduced-motion</span> and every demo on this page goes static.</p>`,
      code(['collapse → instant: shimmer sweep (frozen) · rise / glide / dot travel (none) · grid reveal (instant — guarded in main.js + fx-lab)\\nsurvives: end-states apply instantly (opacity, layout) · theme toggle · nothing is motion-only'].join('')),
    ].join(''),
  },
];

export function html() {
  return [
    `<div class="ds-sec"><h2>Motion &amp; depth</h2>`,
    `<p class="sub">Durations are prescriptions — each step owns its uses. Pick a group below; demos stay with their tokens.</p>`,
    `<section class="fx-tokens">`,
    tabs({ panes }),
    `</section>`,
  ].join('')
  + note('Do', ['Durations read live <span class="tok">var(--dur-*)</span>; travel runs <span class="tok">var(--ease-signature)</span> unless you prove otherwise.'].join(''))
  + note('Don’t', 'No raw <span class="tok">ms</span> or cubic-bezier literals outside <span class="tok">tokens.css</span>.', 'dont')
  + `</div>`;
}
