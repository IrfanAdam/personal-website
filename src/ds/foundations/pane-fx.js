/* ADAM/DS — ds/foundations/pane-fx · composer · [plan:2026-09-23_150400-ds-fx-lede.md#phase-1] */
import { tokens } from './fx/tokens.js';
import { demos } from './fx/demos.js';
import { elev } from './fx/elev.js';
import { spring } from './fx/spring.js';
export const label = 'FX';
export function html() {
  return [
    `<div class="ds-sec"><h2>FX · visible effects</h2>`,
    `<p class="sub">FX is what people see moving: an image appearing as a grid, a loading sheen, a hero growing `,
    `into place, a block glitching, or a frame lifting off the page. <b>Motion</b> sets when and how it moves (`,
    `<span class="tok">--dur-*</span>, <span class="tok">--ease-*</span>); <b>FX</b> sets what the movement does (`,
    `<span class="tok">--fx-*</span>). Start with the effect tabs below; full interactive examples live in the `,
    `<a href="#/functions">Motion labs</a>.</p>`,
  ].join('')
  + tokens()
  + demos()
  + elev()
  + spring()
  + `</div>`;
}
