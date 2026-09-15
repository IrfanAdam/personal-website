/* ADAM/DS — Functions · GridReveal lab section · [plan:2026-09-13_235413-over-limit-splits.md#phase-3] */
// Exports: labSection — lab markup (controls + stage + guidance)
import { note, code } from '../specimens.js';
const SOUNDS = [
  'none','authorize.mp3','button_pop.mp3','click.mp3','hover.wav','load.wav',
  'loading.mp3','pop.mp3','pull.mp3','reel.mp3','schloop.mp3','schlop.mp3',
  'scifi-weapon.wav','ui-click-43196.mp3','weapon_scifi_laser.wav','zing.mp3',
];
function soundOpts() {
  return SOUNDS.map((s) => `<option value="${s}">${s}</option>`).join('');
}
export function labSection(){
  return [
  `<div class="ds-sec"><h2>Lab</h2>`,
  `<p class="sub">Capped at 280px; texture + sound pairing. Controls collapsed: core (cells/morph/span) `,
  `+ <span class="tok">Advanced</span>. Reduced-motion paints one static frame.</p>`,
].join('')
+[
  `<div class="ds-spec block">`,
  `<canvas class="fx-stage" data-fx-stage style="max-height:var(--size-ds-lab)" aria-label="Cell-grid lab"></canvas>`,
].join('')
+`<div class="fx-controls" data-fx-cells>`
+[
  `<label class="fx-row">cells <input type="range" min="48" max="180" step="4" value="120" data-k="count">`,
  `<output data-v="count">120</output></label>`,
].join('')
+[
  `<label class="fx-row">morph <input type="range" min="1" max="20" step="1" value="4" data-k="morph">`,
  `<output data-v="morph">0.04</output></label>`,
].join('')
+[
  `<label class="fx-row">span <input type="range" min="6" max="30" step="1" value="12" data-k="span">`,
  `<output data-v="span">1.2s</output></label>`,
].join('')
+[
  `<details>`,
  `<summary `,
  `style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted);cursor:pointer;margi`,
  `n:var(--space-8) 0">Advanced</summary>`,
].join('')
+[
  `<label class="fx-row">gutter <input type="range" min="0" max="3" step="0.5" value="1" data-k="gut">`,
  `<output data-v="gut">1px</output></label>`,
].join('')
+[
  `<label class="fx-row">order <select data-k="order"><option value="seq">sequential</option>`,
  `<option value="rnd">random</option></select><output data-v="order">seq</output></label>`,
].join('')
+[
  `<label class="fx-row">texture <select data-k="image"><option value="none">none · grey</option>`,
  `<option value="helix">helix · .png</option><option value="fluxx">fluxx · .jpg</option>`,
  `<option value="tas-35">tas-35 · .jpg</option></select><output data-v="image">none</output></label>`,
].join('')
+[
  `<label class="fx-row">sound <select data-k="sound">${soundOpts()}</select>`,
  `<output data-v="sound">none</output></label>`,
].join('')
+[
  `</details><div class="fx-btns"><button class="pill" data-fx-replay>replay</button>`,
  `<button class="pill" data-fx-shuffle>shuffle</button></div>`,
].join('')
+[
  `</div><figure>`,
  `<figcaption>geometry + pacing mirror gridReveal.js · replay fires selected file via <span `,
  `class="tok">playFileId</span> for GridReveal pairing.</figcaption></figure></div>`,
].join('')
+[
  code(["import { buildTree, orderRandom } from '../views/masonry/cells.js'  // single source\\nimport { ",
    "attachGridReveal } from '../views/masonry/gridReveal.js' // single renderer\\n// tokens: --fx-cell · ",
    "--fx-wait · --fx-photo-from · --dur-fx-color · --dur-fx-span · --fx-morph · --fx-split-end"].join('')),
].join('')
+[
  note('Do',['Tune here, graduate via <span class="tok">--fx-*</span>. Replay + shuffle work with texture ON/OFF; ',
    'use sound to audition what sits on the mosaic span.'].join('')),
].join('')
  + `</div>`;
}
