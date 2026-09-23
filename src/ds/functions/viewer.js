/* ADAM/DS — Functions · Viewer (tamed editorial portal — params). */
import { note, code, cardHTML } from '../specimens.js';
import { attachViewer } from '../../views/masonry/viewer.js';
export const title = 'Viewer';
export function render(){
  return [
    `<div class="ds-hero ds-hero--lab"><h1>Viewer portal — params.</h1>`,
    `<p class="lede">Tamed editorial expander (hairline + paper, no neon). Former overlays (<span `,
    `class="tok">--viewer-grid/scan/neon</span>) removed in v1.1; glass/bar/shimmer markup deleted in 5.3.</p></div>`,
  ].join('')
+`<div class="ds-sec"><h2>Params</h2><p class="sub">Live tokens the site reads — fallbacks shipped, never literals.</p>`
+`<table class="ds-table"><tr><th>Param</th><th>Value</th><th>Role</th></tr>`
+[
  `<tr><td>threshold</td><td><span class="tok">--fx-viewer-threshold</span> · 12px travel</td>`,
  `<td>portal arms after intent</td></tr>`,
].join('')
+[
  `<tr><td>idle</td><td><span class="tok">--fx-viewer-idle</span> · 850ms</td>`,
  `<td>portal hides when cursor rests</td></tr>`,
].join('')
+[
  `<tr><td>hide debounce</td><td><span class="tok">--fx-viewer-debounce</span> · 70ms</td>`,
  `<td>gap-crossing tolerance</td></tr>`,
].join('')
+[
  `<tr><td>spring</td><td>`,
  `<span class="tok">--fx-viewer-k</span> 0.1 · <span class="tok">--fx-viewer-fr</span> 0.54</td>`,
  `<td>preview-Y chase</td></tr>`,
].join('')
+[
  `<tr><td>geometry</td><td><span class="tok">--size-viewer-w</span> 180px · gap 10 · pad 20</td>`,
  `<td>portal placement + collision flip</td></tr></table>`,
].join('')
+[
  code(["viewer.js: TH=fxNum('--fx-viewer-threshold',12) · IDLE=fxMs('--fx-viewer-idle',850)\\nviewer.css: ",
    "--size-viewer-w + --size-viewer-tether · .viewer-cursor 32px"].join('')),
].join('')
+`</div>`
+[
  `<div class="ds-sec"><h2>Specimen</h2>`,
  `<p class="sub">Hover the card — preview appears to the right (flips left on collision), Y follows cursor `,
  `with spring, tether lines draw. Same physics as masonry.</p>`,
].join('')
+[
  `<div class="ds-spec block"><div class="cols" data-viewer-demo style="width:100%"><div class="col">`,
  cardHTML('Fluxx', 'fluxx · 2024', '/images/fluxx.jpg', ['Fintech']),
  `</div></div></div>`,
].join('')
+`<figure><figcaption>threshold 12px · idle 850ms · debounce 70ms · k 0.1 · fr 0.54 · W 180px`,
+`preview to right, spring Y</figcaption></figure>`
+`${note('Do','Keep <span class="tok">aria-hidden</span> + pointer-events none — cards keep native link semantics.')}`
+`</div>`
+`<div class="ds-sec"><h2>Graduation</h2><p class="sub">Phase-5 record — nothing here changes pixels.</p>`
+[
  `<table class="ds-table"><tr><th>Site read as</th><th>Graduated to</th></tr><tr>`,
  `<td>threshold / idle / spring / geometry</td>`,
  `<td>✓ <span class="tok">--fx-viewer-*</span> · <span class="tok">--size-viewer-*</span></td></tr></table>`,
].join('')
+`${note('Don’t','No lab value enters site until it is a token via <span class="tok">var()</span>.','dont')}</div>`;
}
export function mount(root){
  const grid = root.querySelector('[data-viewer-demo]');
  if (!grid) return () => {};
  let off = null;
  try { off = attachViewer(grid); } catch (_) { off = null; }
  return () => { try { off && off(); } catch (_) {} };
}
