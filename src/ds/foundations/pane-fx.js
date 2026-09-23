/* ADAM/DS — ds/foundations/pane-fx · composer · [plan:2026-09-23_150400-ds-fx-lede.md#phase-1] */
import { tokens } from './fx/tokens.js';
import { demos } from './fx/demos.js';
import { elev } from './fx/elev.js';
import { spring } from './fx/spring.js';
export const label = 'FX';
export function html() {
  return [
    `<div class="ds-sec"><h2>FX · visible effects</h2>`,
    `<p class="sub">FX is everything that visibly moves after paint: reveal grids, shimmer sweeps, rises, `,
    `glitches, press squashes, elevation, the viewer spring. <b>Motion</b> sets the timing (`,
    `<span class="tok">--dur-*</span>, <span class="tok">--ease-*</span>); <b>FX</b> sets the effect that timing `,
    `drives (<span class="tok">--fx-*</span>). Below: the token table, then each effect running live — tweak a `,
    `token, every demo follows. Full playables live in the <a href="#/functions">Motion labs</a>.</p>`,
  ].join('')
  + tokens()
  + demos()
  + elev()
  + spring()
  + `</div>`;
}
