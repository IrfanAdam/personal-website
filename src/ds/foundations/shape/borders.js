/* ADAM/DS — ds/foundations/shape/borders · borders · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { tokenTrace } from '../../specimens.js';
export function borders(){return tokenTrace({ plain: true, rows: [
    ['Hairline', '--border-hairline', 'var(--size-hairline) solid var(--color-line) — structure'],
    ['Frame', '--border-frame', 'var(--size-frame) solid var(--color-ink) — focus frame'],
    ['Dashed', '--border-dashed', 'var(--size-hairline) dashed var(--color-ink-muted) — loose grouping'],
  ] });}
export function liveBorders(){return `<div class="ds-grid c3">`
    + [
      `<div class="ds-cell">`,
      `<div style="height:var(--space-30);border:var(--border-hairline);background:var(--color-surface)"></div>`,
      `<div class="nm">Hairline</div><div class="vl">`,
      `<span class="tok">var(--border-hairline)</span> · 1px line</div>`,
      `<div class="vl" data-live="--color-line">—</div></div>`,
    ].join('')
    + [
      `<div class="ds-cell">`,
      `<div style="height:var(--space-30);border:var(--border-frame);background:var(--color-surface)"></div>`,
      `<div class="nm">Frame</div><div class="vl">`,
      `<span class="tok">var(--border-frame)</span> · <span data-live="--size-frame">3px</span> ink</div></div>`,
    ].join('')
    + [
      `<div class="ds-cell">`,
      `<div style="height:var(--space-30);border:var(--border-dashed);background:var(--color-surface)"></div>`,
      `<div class="nm">Dashed</div><div class="vl"><span class="tok">var(--border-dashed)</span> · grouping</div>`,
      `</div>`,
    ].join('')
    + `</div>`;}
