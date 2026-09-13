/* ADAM/DS — ds/foundations/fx/elev · elevation · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { tokenTrace } from '../../specimens.js';
export function elev(){return [
    `<h3>Elevation — live (hairline first)</h3>`,
    `<p class="sub">No UI card casts a shadow. Elevation is <span class="tok">--border-hairline</span> + surface, `,
    `plus only two shadow jobs: keep type legible on media and lift the viewer. Toggle theme — <span `,
    `class="tok">--shadow-viewer</span> flips from soft editorial (light) to heavier cut (dark). All shadow values `,
    `are token-adherent: <span class="tok">travel = --space-*</span>, <span class="tok">color = --stone-950</span>, `,
    `<span class="tok">opacity = --opacity-shadow-*</span> → <span class="tok">--color-shadow-*</span> via <span `,
    `class="tok">color-mix</span>. Click any card to copy its live value.</p>`,
  ].join('')
  + `<div class="fd-elev-row">`
  + [
    `<div class="fd-elev" data-copy-token=\"--border-hairline\" title=\"Click to copy live --border-hairline\" `,
    `style=\"cursor:pointer\"><b>0 · flat</b><span class="tok">--border-hairline</span>`,
    `<small>every card / pill / thumb<br>surface on paper, 1px line</small>`,
    `<code data-live=\"--border-hairline\">--border-hairline</code></div>`,
  ].join('')
  + [
    `<div class="fd-elev" data-copy-token=\"--color-surface-sunken\" title=\"Click to copy live `,
    `--color-surface-sunken\" style=\"cursor:pointer;background:var(--color-surface-sunken)\"><b>–1 · sunken</b>`,
    `<span class="tok">--color-surface-sunken</span>`,
    `<small>inset ground — no shadow<br>disabled / well on paper</small>`,
    `<code data-live=\"--color-surface-sunken\">--color-surface-sunken</code></div>`,
  ].join('')
  + [
    `<div class="fd-elev fd-elev--viewer" data-copy-token=\"--shadow-viewer\" title=\"Click to copy live `,
    `--shadow-viewer\" style=\"cursor:pointer\"><b>1 · lifted</b><span class="tok">--shadow-viewer</span>`,
    `<small>viewer frame only<br>`,
    `<span class="tok">--space-12</span> / <span class="tok">--space-32</span> + <span class="tok">--space-2</span> `,
    `/ <span class="tok">--space-10</span> · theme 12→14 / 32→36</small>`,
    `<code data-live=\"--shadow-viewer\">--shadow-viewer</code></div>`,
  ].join('')
  + [
    `<div class="fd-elev fd-elev--media" data-copy-token=\"--shadow-on-media\" title=\"Click to copy live `,
    `--shadow-on-media\" style=\"cursor:pointer\"><b style="text-shadow:var(--shadow-on-media)">O · on-media</b>`,
    `<span class="tok">--shadow-on-media</span><small>text keeps legible on chip / image<br>`,
    `<span class="tok">--space-1</span> / <span class="tok">--space-10</span> / <span class="tok">--space-12</span>`,
    `</small><code data-live=\"--shadow-on-media\">--shadow-on-media</code></div>`,
  ].join('')
  + `</div>`
  + [
    `<p class="sub" style="margin-top:calc(var(--space-6) * `,
    `-1);font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted)">Tip: the media card `,
    `shows <span class="tok">text-shadow</span> (not box-shadow) — dark chip behind the title does the real `,
    `lifting, shadow is the 1px crispener. Travel always <span class="tok">var(--space-*)</span>; color never raw `,
    `<span class="tok">rgba()</span>.</p>`,
  ].join('')
  + tokenTrace({ plain: true,
      rows: [['Hairline', '--border-hairline', '0 flat — every card / thumb / pill'],
        ['Viewer',
          '--shadow-viewer',
          '0 var(--space-12) var(--space-32) + 0 var(--space-2) var(--space-10) · dark: 14/36 + 3/12'],
        ['On-media sm', '--shadow-on-media-sm', '0 var(--space-1) var(--space-10) · --color-shadow-media-sm'],
        ['On-media', '--shadow-on-media', '0 var(--space-1) var(--space-12) · --color-shadow-media']] })
  + [
    `<p class="sub" `,
    `style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted)">Shadow recipe: `,
    `travel var(--space-*) + color via color-mix — the four colors live in Color → Elevation with live swatches; `,
    `opacity knobs below.</p>`,
  ].join('')
  + tokenTrace({ plain: true,
      rows: [['Opacity media', '--opacity-shadow-media', '45% · on-media lg'],
        ['Opacity media sm', '--opacity-shadow-media-sm', '40% · on-media sm'],
        ['Opacity viewer', '--opacity-shadow-viewer', '24% · lifted main (light+dark)'],
        ['Opacity viewer soft', '--opacity-shadow-viewer-soft', '12% · lifted soft (light+dark)']] });}
