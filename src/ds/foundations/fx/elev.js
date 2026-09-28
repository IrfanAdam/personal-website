/* ADAM/DS — ds/foundations/fx/elev · elevation tables behind tabs ·
   [plan:2026-09-23_154500-ds-elev-motion-tables.md#phase-1] */
// Exports: elev — levels demo + shadow/opacity tables in pill tabs
import { cssVar } from '../../specimens.js';
import { tabs } from '../../tabs.js';
import { levels } from './elev-levels.js';

// — Data —
const SHADOWS = [
  ['Hairline', '--border-hairline', 'The 1px line that gives every card and thumb its edge.', 'Surface on paper.'],
  [
    'Viewer lift',
    '--shadow-viewer',
    'How far and soft the viewer frame lifts off the page.',
    'Soft editorial in light, heavier cut in dark.',
  ],
  ['On-media sm', '--shadow-on-media-sm', 'Crisp shadow that keeps small type legible on media.', 'Chips and labels.'],
  ['On-media', '--shadow-on-media', 'Shadow that keeps larger media type legible.', 'Image and card titles.'],
];
const OPACITY = [
  ['Media', '--opacity-shadow-media', 'How dark the on-media shadow color is.', '45%.'],
  ['Media sm', '--opacity-shadow-media-sm', 'How dark the small on-media shadow is.', '40%.'],
  ['Viewer', '--opacity-shadow-viewer', 'How dark the viewer lift is in both themes.', '24%.'],
  ['Viewer soft', '--opacity-shadow-viewer-soft', 'Lighter viewer lift for softer elevation.', '12%.'],
];

// — Helpers —
const row = ([name, token, what, cue]) => [
  `<tr data-copy-token="${token}" title="Copy ${token}">`,
  `<td class="fx-name">${name}</td><td><span class="tok">${token}</span></td>`,
  `<td><p class="fx-what">${what}</p><p class="fx-cue">${cue}</p></td>`,
  `<td class="fx-live" data-live="${token}">${cssVar(token)}</td></tr>`,
].join('');
const tbl = (rows) => [
  `<div class="fx-scroll"><table class="fx-table"><thead><tr>`,
  `<th>Effect</th><th>Token</th><th>What changes</th><th>Live</th>`,
  `</tr></thead><tbody>${rows.map(row).join('')}</tbody></table></div>`,
].join('');

// — Section —
export function elev() {
  const panes = [
    { label: 'Levels · 4', html: levels() },
    {
      label: 'Shadows · 4',
      html: `<p class="fx-group-intro">What each shadow does — travel is <span class="tok">var(--space-*)</span>,`
        + ` color via <span class="tok">color-mix</span>.</p>`
        + tbl(SHADOWS)
        + [
          `<p class="sub" style="font-family:var(--font-mono);font-size:var(--text-micro);`,
          `color:var(--color-ink-muted)">Recipe: travel + <span class="tok">--color-shadow-*</span>`,
          ` from Color → Elevation; click a row to copy.</p>`,
        ].join(''),
    },
    {
      label: 'Opacity · 4',
      html: `<p class="fx-group-intro">Tune the shadow color per job — media vs viewer, small vs large.</p>`
        + tbl(OPACITY),
    },
  ];
  return [
    `<h3>Elevation — live (hairline first)</h3>`,
    `<p class="sub">No UI card casts a shadow. Elevation is <span class="tok">--border-hairline</span> + surface,`,
    ` plus only two shadow jobs: keep type legible on media and lift the viewer. Toggle theme —`,
    ` <span class="tok">--shadow-viewer</span> flips from soft editorial (light) to heavier cut (dark).</p>`,
    `<section class="fx-tokens">`,
    tabs({ panes }),
    `</section>`,
  ].join('');
}
