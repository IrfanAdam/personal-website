/* ADAM/DS — ds/specimens/trace · trace tables · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { cssVar } from './color.js';
import { ramp } from './grids.js';
export const refreshLive = () =>
  document.querySelectorAll('[data-live]').forEach((el) => { el.textContent = cssVar(el.dataset.live); });
export const typeRow = (demo, token, value) =>
  [
    `<tr><td>`,
    demo,
    `</td><td><span class="tok">`,
    token,
    `</span></td><td style="font-family:var(--font-mono);font-size:var(--text-label);color:var(--color-ink-muted)">`,
    value,
    `</td></tr>`,
  ].join('');
/* — specCells: trace rows WITHOUT color swatches (Update 4 Task 10 shared variant).
   rows: [[name, token, usage?, demoHTML?]] — demoHTML renders live instead of
   .ds-sw, so unitless tokens (leading/tracking/space/fx) get real specimens. */
export const specCells = (rows) =>
  [
    `<div class="ds-grid c4">`,
    rows.map(([name, token, usage, demo]) => [
      `<div class="ds-cell" data-copy-token="`,
      token,
      `" title="Click to copy live value" style="cursor:pointer">`,
      demo || '',
      `<div class="nm">`,
      name,
      `</div><div class="vl"><span class="tok">`,
      token,
      `</span></div><div class="vl" data-live="`,
      token,
      `">`,
      cssVar(token),
      `</div>`,
      usage ? `<div class="vl">${usage}</div>` : '',
      `</div>`,
    ].join('')).join(''),
    `</div>`,
  ].join('');
/* — tokenTrace: ramp → semantic → usage in one renderer (Phase 1 shared infra).
   rows: [[name, token, usage?]]; copy via [data-copy-token], live via [data-live].
   Pass plain:true for non-color tokens (space/size/measure/radius/leading) to
   omit the color swatch and avoid blank cards (shared fix: Tasks 10/13/18/24). */
export const tokenTrace = ({ ramp: rampTokens = [], rows = [], plain = false } = {}) =>
  [
    rampTokens.length ? ramp(rampTokens) : '',
    rows.length ? [
      `<div class="ds-grid c4">`,
      rows.map(([name, token, usage]) => plain ? [
        `<div class="ds-cell" data-copy-token="`,
        token,
        `" title="Click to copy live value" style="cursor:pointer"><div class="nm">`,
        name,
        `</div><div class="vl"><span class="tok">`,
        token,
        `</span></div><div class="vl" data-live="`,
        token,
        `">`,
        cssVar(token),
        `</div>`,
        usage ? `<div class="vl">${usage}</div>` : '',
        `</div>`,
      ].join('') : [
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
        `</div>`,
        usage ? `<div class="vl">${usage}</div>` : '',
        `</div>`,
      ].join('')).join(''),
      `</div>`,
    ].join('') : '',
  ].join('');
