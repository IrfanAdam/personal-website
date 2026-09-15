/* ADAM/DS — ds/foundations/color/sections · pair + decor table markup:
   [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { DECOR } from './data.js';
export function pairs(rows){return [
  `<div style="overflow-x:auto"><table class="ds-table cl-table"><tr><th>Use</th><th>Pair</th><th>Light</th>`,
  `<th>Dark</th></tr>`,
  rows.map(([n,bg,fg,u]) => [
    `<tr data-bg="`,
    bg,
    `" data-fg="`,
    fg,
    `"><td>`,
    n,
    `<div class="cl-use">`,
    u,
    `</div></td><td><span class="tok">`,
    fg,
    `</span><div class="cl-use">on</div><span class="tok">`,
    bg,
    `</span></td>`,
    ['light','dark'].map((t) => [
      `<td data-c="`,
      t,
      `"><div class="cl-cell" data-theme="`,
      t,
      `" style="background:var(--color-bg);">`,
      `<span class="cl-demo" data-demo>Aa</span>`,
      `<span class="cl-aa" data-aa>…</span></div></td>`,
    ].join('')).join(''),
    `</tr>`,
  ].join('')).join(''),
  `</table></div>`,
].join('');}
export function decor(){return [
  `<div style="overflow-x:auto"><table class="ds-table cl-table"><tr><th>Token</th><th>Use</th></tr>`,
  DECOR.map(([t,u]) => [
    `<tr><td>`,
    t.split(' / ').map((x) => `<span class="tok">${x}</span>`).join(' '),
    `</td><td>`,
    u,
    `</td></tr>`,
  ].join('')).join(''),
  `</table></div>`,
].join('');}
