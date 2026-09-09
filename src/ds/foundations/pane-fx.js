/* ADAM/DS foundations · FX pane — grid, shimmer, rise, press, viewer spring. */
import { tokenTrace, note, code } from '../specimens.js';
export const label = 'FX';
export function html() {
  return `<div class="ds-sec"><h2>FX · graduated</h2><p class="sub">Cell-grid, sheen and rise graduate from the same tokens the site reads. Every demo below runs on <span class="tok">var(--fx-*)</span> — tweak the token, the demo follows.</p>`
  + tokenTrace({ rows: [['Cell count', '--fx-cell', '30 · grid count'], ['Stagger wait', '--fx-wait', '0.72 · stagger'], ['Photo from', '--fx-photo-from', '0.93 · image settle'], ['Morph', '--fx-morph', '0.04 · split ease'], ['Split end', '--fx-split-end', '0.92 · split end'], ['Skeleton', '--fx-skeleton', '120ms · placeholder'], ['Sheen', '--fx-sheen', '0.14 · shimmer band'], ['Grid pitch', '--fx-grid-pitch', '14px · lines'], ['FX color', '--dur-fx-color', '240ms · cell tint'], ['FX span', '--dur-fx-span', '0.6s · cell sweep'], ['Hero rise', '--dur-hero-rise', '860ms · hero']] })
  + `<h3>Grid pitch — live</h3><p class="sub">The reveal grid at <span class="tok" data-live="--fx-grid-pitch">--fx-grid-pitch</span>. Full lab lives at <a href="#/functions/grid-reveal">GridReveal</a>.</p><div class="fd-grid-demo"></div>`
  + `<h3>Shimmer — live</h3><p class="sub">Skeleton sweep on <span class="tok">var(--dur-shimmer)</span>. Toggle to freeze the band mid-flight.</p><div class="fx-shimmer" id="fxShimmer"><i></i></div><div class="fd-rowbtns"><button class="tok" data-shimmer-toggle>freeze / resume</button></div>`
  + `<h3>Rise — live</h3><p class="sub">Placeholder block settles on <span class="tok">var(--dur-glide)</span>. Replay the settle.</p><div class="fx-rise rest" id="fxRise"></div><div class="fd-rowbtns"><button class="tok" data-rise-replay>replay rise</button></div>`
  + `<h3>Press · hover — live</h3><p class="sub">Press the button (<span class="tok">var(--scale-press)</span>); hover the row (<span class="tok">var(--opacity-hover)</span>).</p><div class="fd-rowbtns"><button class="fd-press">press me</button></div><div class="fd-hover">hover me — unselected rows dim to 0.55</div>`
  + `<h3>Viewer spring</h3><p class="sub">Intent + spring the viewer route reads. Full lab at <a href="#/functions/viewer">Viewer</a>.</p>`
  + tokenTrace({ rows: [['Threshold', '--fx-viewer-threshold', '12px · intent'], ['Idle', '--fx-viewer-idle', '850ms · dismiss'], ['Debounce', '--fx-viewer-debounce', '70ms · pointer'], ['Stiffness k', '--fx-viewer-k', '0.1 · spring'], ['Friction', '--fx-viewer-fr', '0.54 · spring']] })
  + code('viewer border var(--viewer-border) · shadow var(--shadow-viewer) · in var(--dur-viewer-in)')
  + note('Do', 'Graduate knobs through tokens — lab-local count/gut/order stay out of the contract.')
  + `</div>`;
}
