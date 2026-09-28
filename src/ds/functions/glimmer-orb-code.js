/* ADAM/DS — functions/glimmer-orb-code · code tab panel ·
   [plan:2026-09-28_130000-code-cleanup-perf.md#phase-1] */
// Exports: codePanel
import { code } from '../specimens.js';

// — Panel —
export function codePanel() {
  return [
    `<div data-tab-panel="code" hidden><div class="ds-sec">`,
    code(["import { attachGlimmerOrb } from '../views/glimmer-orb.js'",
      "\\\\nconst stop = attachGlimmerOrb(canvas, { state: ",
      "'listening' }) // color: --color-accent\\\\nstop.setState('thinking'); stop.setLevel(0.6); stop();"].join('')),
  ].join('')
  + `<table class="ds-table"><tr><th>Module</th><th>Exports</th><th>Consumers</th></tr>`
  + [
    `<tr><td><span class="tok">views/glimmer-orb.js</span></td><td>`,
    `<span class="tok">attachGlimmerOrb</span>(canvas, { state, level, size, dots, color })</td>`,
    `<td>lab (only)</td></tr></table>`,
  ].join('')
  + `</div></div>`;
}
