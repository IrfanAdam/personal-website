/* ADAM/DS — ds/foundations/space/tables · measures · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { tokenTrace, code } from '../../specimens.js';
export function measures(){return [
    `<h3>Measure — live prose widths</h3>`,
    `<p class="sub">Two line-length tokens — capped paragraphs, not color swatches. Resize the viewport to feel the `,
    `widths.</p>`,
  ].join('')
    + tokenTrace({ plain: true,
        rows: [['Copy', '--measure-copy', '60ch · narrow columns, copy blocks'],
          ['Prose', '--measure-prose', '68ch · long read']] })
    + [
      `<div class="ds-spec block" style="display:grid;gap:var(--space-14)">`,
      `<p `,
      `style="max-width:var(--measure-copy);font-size:var(--text-body);line-height:var(--leading-prose);margin:0">Co`,
      `py measure — this paragraph is capped at <span class="tok">var(--measure-copy)</span> (60ch). Narrow columns `,
      `hold attention on cards and side copy.</p>`,
      `<p `,
      `style="max-width:var(--measure-prose);font-size:var(--text-body);line-height:var(--leading-prose);margin:0">P`,
      `rose measure — this paragraph is capped at <span class="tok">var(--measure-prose)</span> (68ch). Long-read `,
      `case narratives get the wider allowance.</p></div>`,
    ].join('');}
export function convention(){return [
    `<h3>Naming — how to pick</h3><div class="ds-code">`,
    `<pre>--space-N  = raw px step (pick by size: --space-1 … --space-90 — no rounding)
`,
    `--size-*   = named object (wrap, header, strip, strip-tab, hairline, frame, tap)
`,
    `--measure-*= line length in ch (copy 60ch, prose 68ch)
`,
    `--rhythm / --gutter = purpose aliases — prefer over raw --space-14/16 when it fits the purpose
`,
    `Alias discipline: no rename without alias + deprecate flow (Phase 7). Confusing pair: strip vs strip-tab — `,
    `56px thumb is the image row, 58px tab is the list/grid toggle row; not interchangeable.</pre></div>`,
  ].join('');}
export function breaks(){return [
    `<h3>Breakpoints — documented scale</h3>`,
    `<p class="sub">Tokens live in <span class="tok">tokens.css</span>; <span class="tok">var()</span> is invalid `,
    `in <span class="tok">@media</span> so queries keep the raw px in sync by value. Click to copy the token — the `,
    `comment in each query names the token.</p>`,
  ].join('')
    + tokenTrace({ plain: true,
        rows: [['Small', '--break-sm', '640px · 1 col + mobile cards'],
          ['Medium', '--break-md', '800px · case 1fr 1fr → 1fr'],
          ['Large', '--break-lg', '900px · masonry 4 → 2 cols + docs sidebar collapse']] });}
export function recipe(){return code([
    'break-sm  640px  → masonry 1 col, mobile linger, footer 1 col\nbreak-md  800px  → case-grid 1fr 1fr → 1fr, '
    ,
    'cols single rule\nbreak-lg  900px  → masonry 4 → 2 cols, DS sidebar stacks\nrhythm    --space-14 / gutter ',
    '--space-16 / wrap --size-wrap 1600px\ncols 4 → 2 @900px → 1 @640px · case 1fr 1fr → 1fr @800px'].join(''));}
