/* ADAM/DS — ds/foundations/pane-fx · composer · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { tokens } from './fx/tokens.js';
import { demos } from './fx/demos.js';
import { elev } from './fx/elev.js';
import { spring } from './fx/spring.js';
export const label = 'FX';
export function html() {
  return [
    `<div class="ds-sec"><h2>FX · graduated</h2>`,
    `<p class="sub">Three layers: <b>lab-local</b> knobs (cell count, gutter, order — experiments, never tokens) → `,
    `<b>graduated</b> <span class="tok">--fx-*</span> tokens (knobs proven on the site) → <b>site</b> consumption `,
    `(gridReveal reads the same vars). Tweak a token, every demo below follows. `,
    `Durations are specced in <a href="#/foundations">Motion</a>; tune playables in the <a href="#/functions">Motion labs</a>.</p>`,
  ].join('')
  + tokens()
  + demos()
  + elev()
  + spring()
  + `</div>`;
}
