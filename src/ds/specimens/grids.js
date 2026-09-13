/* ADAM/DS — ds/specimens/grids · swatch cells + ramps · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { cssVar } from './color.js';
export const swatch = (name, token) =>
  [
    `<div class="ds-cell" data-copy-token="`,
    token,
    `" title="Click to copy live value" style="cursor:pointer"><div class="ds-sw" style="background:var(`,
    token,
    `)"></div><div class="nm">`,
    name,
    `</div><div class="vl"><span class="tok">`,
    token,
    `</span></div><div class="vl" data-live="`,
    token,
    `">`,
    cssVar(token),
    `</div></div>`,
  ].join('');
export const ramp = (tokens, mat = '', use = 'ref-only · click to copy') => [
  `<div class="ds-ramp">`,
  tokens.map((s) => [
    `<i style="background:var(`,
    s,
    `)" tabindex="0" data-copy-token="`,
    s,
    `" title="`,
    s,
    ` — click to copy"><span class="tip"><b>`,
    mat ? `${mat} · ` : '',
    s.split('-').pop(),
    `</b><span class="tok">`,
    s,
    `</span><span data-live="`,
    s,
    `">`,
    cssVar(s),
    `</span><em>`,
    use,
    `</em></span></i>`,
  ].join('')).join(''),
  `</div>`,
].join('');
