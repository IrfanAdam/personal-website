/* ADAM/DS — ds/foundations/fx/elev · elevation tables behind tabs ·
   [plan:2026-09-23_154500-ds-elev-motion-tables.md#phase-1] */
// Exports: elev — levels demo + shadow/opacity tables in pill tabs
import { cssVar } from '../../specimens.js';
import { tabs } from '../../tabs.js';

// — Data —
const SHADOWS = [
  ['Hairline', '--border-hairline', 'The 1px line that gives every card and thumb its edge.', 'Surface on paper.'],
  ['Viewer lift', '--shadow-viewer', 'How far and soft the viewer frame lifts off the page.', 'Soft editorial in light, heavier cut in dark.'],
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

// — Visual levels (kept, now inside its tab) —
const levels = () => [
  `<div class="fd-elev-row">`,
  `<div class="fd-elev" data-copy-token="--border-hairline" title="Copy --border-hairline" style="cursor:pointer"><b>0 · flat</b><span class="tok">--border-hairline</span><small>every card / pill / thumb<br>surface on paper, 1px line</small><code data-live="--border-hairline">--border-hairline</code></div>`,
  `<div class="fd-elev" data-copy-token="--color-surface-sunken" title="Copy --color-surface-sunken" style="cursor:pointer;background:var(--color-surface-sunken)"><b>–1 · sunken</b><span class="tok">--color-surface-sunken</span><small>inset ground — no shadow<br>disabled / well on paper</small><code data-live="--color-surface-sunken">--color-surface-sunken</code></div>`,
  `<div class="fd-elev fd-elev--viewer" data-copy-token="--shadow-viewer" title="Copy --shadow-viewer" style="cursor:pointer"><b>1 · lifted</b><span class="tok">--shadow-viewer</span><small>viewer frame only<br><span class="tok">--space-12</span> / <span class="tok">--space-32</span> + <span class="tok">--space-2</span> / <span class="tok">--space-10</span> · theme 12→14 / 32→36</small><code data-live="--shadow-viewer">--shadow-viewer</code></div>`,
  `<div class="fd-elev fd-elev--media" data-copy-token="--shadow-on-media" title="Copy --shadow-on-media" style="cursor:pointer"><b style="text-shadow:var(--shadow-on-media)">O · on-media</b><span class="tok">--shadow-on-media</span><small>text keeps legible on chip / image<br><span class="tok">--space-1</span> / <span class="tok">--space-10</span> / <span class="tok">--space-12</span></small><code data-live="--shadow-on-media">--shadow-on-media</code></div>`,
  `</div>`,
  `<p class="sub" style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted)">Tip: the media card shows <span class="tok">text-shadow</span> (not box-shadow) — dark chip behind the title does the real lifting, shadow is the 1px crispener. Travel always <span class="tok">var(--space-*)</span>; color never raw <span class="tok">rgba()</span>.</p>`,
].join('');

// — Section —
export function elev() {
  const panes = [
    { label: 'Levels · 4', html: levels() },
    { label: 'Shadows · 4', html: `<p class="fx-group-intro">What each shadow does — travel is <span class="tok">var(--space-*)</span>, color via <span class="tok">color-mix</span>.</p>` + tbl(SHADOWS) + `<p class="sub" style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted)">Recipe: travel + <span class="tok">--color-shadow-*</span> from Color → Elevation; click a row to copy.</p>` },
    { label: 'Opacity · 4', html: `<p class="fx-group-intro">Tune the shadow color per job — media vs viewer, small vs large.</p>` + tbl(OPACITY) },
  ];
  return [
    `<h3>Elevation — live (hairline first)</h3>`,
    `<p class="sub">No UI card casts a shadow. Elevation is <span class="tok">--border-hairline</span> + surface, plus only two shadow jobs: keep type legible on media and lift the viewer. Toggle theme — <span class="tok">--shadow-viewer</span> flips from soft editorial (light) to heavier cut (dark).</p>`,
    `<section class="fx-tokens">`,
    tabs({ panes }),
    `</section>`,
  ].join('');
}
