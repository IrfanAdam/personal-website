/* ADAM/DS — ds/foundations/motion/sections · sections · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { DURS, USES, BLURS } from './data.js';
export function bars(){return [
    `<div class="fd-durs">`,
    DURS.map(([n, t, w]) => [
      `<div class="fd-dur" data-copy="`,
      t,
      `" title="Click to copy `,
      t,
      `" style="cursor:pointer"><b>`,
      n,
      `</b><div class="fd-track"><div class="fd-fill" style="width:`,
      w,
      `"></div></div><output data-live="`,
      t,
      `">`,
      t,
      `</output></div>`,
    ].join('')).join(''),
    `</div>`,
  ].join('');}
export function table(){return [
    `<table class="ds-table"><tr><th>Step</th><th>Token</th><th>Sanctioned use</th></tr>`,
    USES.map(([n, t, u]) => `<tr><td>${n}</td><td><span class="tok">${t}</span></td><td>${u}</td></tr>`).join(''),
    `</table>`,
  ].join('');}
export function stage(){return [
    `<div class="fd-stage" id="easeStage"><div class="fd-dot"></div></div><div class="fx-controls" id="easeCtrls">`,
    `<label class="fx-row">dur <select data-ease="d"><option value="var(--dur-fast)">fast</option>`,
    `<option value="var(--dur-glide)" selected>glide 380ms</option>`,
    `<option value="var(--dur-zoom)">zoom 650ms</option><option value="var(--dur-hero-rise)">hero rise</option>`,
    `</select></label><label class="fx-row">ease <select data-ease="e">`,
    `<option value="var(--ease-signature)" selected>signature</option>`,
    `<option value="var(--ease-standard)">standard</option></select></label><div class="fd-rowbtns">`,
    `<button class="tok" data-ease-replay>replay glide</button></div></div>`,
  ].join('');}
export function blurs(){return [
    `<div class="fd-blurrow">`,
    BLURS.map(([n, t, u]) => [
      `<div data-copy="`,
      t,
      `" title="Click to copy `,
      t,
      `" style="cursor:pointer"><div class="fd-blur"><i>`,
      n,
      ` · <span data-live="`,
      t,
      `">`,
      t,
      `</span></i></div><div class="vl">`,
      u,
      `</div></div>`,
    ].join('')).join(''),
    `</div>`,
  ].join('');}
