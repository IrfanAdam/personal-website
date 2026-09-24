/* ADAM/DS — shimmer · lab/code tabs · [plan:2026-09-24_140000-ds-docs-compact.md#phase-2] */
import { note, code } from '../specimens.js';
import { mountShimmer } from '../fx-lab.js';
export const title = 'Shimmer';
export function render(){
  return [
    `<div class="ds-hero ds-hero--lab"><h1>Skeletal shimmer.</h1>`,
    `<p class="lede">Token trio live: <span class="tok">--shimmer-gradient</span> + <span `,
    `class="tok">--shimmer-band</span> + <span class="tok">--dur-shimmer</span>. Case heroes shimmer; masonry `,
    `shelved it (canvas owns that sheen).</p></div>`,
  ].join('')
+[
  `<div class="ds-tablist ds-tablist--line" role="tablist" data-shimmer-tabs>`,
  `<button class="ds-tab on" role="tab" aria-selected="true" data-tab="lab">Lab</button>`,
  `<button class="ds-tab" role="tab" aria-selected="false" data-tab="code">Code</button></div>`,
].join('')
+`<div data-tab-panel="lab"><div class="ds-sec">`
+`<div class="ds-spec block"><div class="fx-shimmer" data-fx-shimmer><i></i></div>`
+[
  `<div class="fx-controls">`,
  `<label class="fx-row">duration <input type="range" min="8" max="40" step="1" value="22" data-fx-dur>`,
  `<output data-fx-dur-v>2.2s</output></label>`,
].join('')
+[
  `<div class="fx-btns"><button class="pill" data-fx-dir>reverse</button>`,
  `<button class="pill" data-fx-pause>pause</button></div></div>`,
].join('')
+`</div>`
+[
  `<p class="sub" style="margin-top:var(--space-8)">Grid is <span class="tok">--reveal-grid</span> (reads <span `,
  `class="tok">--fx-grid-pitch</span>); sheen is a masked gradient sweep.</p>`,
  `<figure><figcaption>grid = --reveal-grid · sheen = masked gradient sweep · reduced-motion: off</figcaption></figure>`,
].join('')
+[
  note('Do',
    ['Duration is the only safe knob — band + gradient live in <span class="tok">tokens.css</span>. Grid pitch is ',
    '<span class="tok">--fx-grid-pitch</span>.'].join('')),
  `</div></div>`,
].join('')
+[
  `<div data-tab-panel="code" hidden><div class="ds-sec">`,
  code(['.fx-shimmer i {\\\\n  background: var(--shimmer-gradient);\\\\n  -webkit-mask-image: var(--shimmer-band); ',
    'mask-image: var(--shimmer-band);\\\\n  animation: fx-sheen var(--dur-shimmer) linear infinite;\\\\n}'].join('')),
].join('')
+[
  `<h2>Tokens</h2>`,
  `<p class="sub">Graduated in 5.1 — site reads via <span class="tok">var()</span>.</p>`,
].join('')
+[
  `<table class="ds-table"><tr><th>Literal</th><th>Token</th></tr><tr><td>sheen base 0.14 / final +0.10</td><td>`,
  `<span class="tok">--fx-sheen</span></td></tr><tr><td>grid pitch 14px</td><td>`,
  `<span class="tok">--fx-grid-pitch</span> inside <span class="tok">--reveal-grid</span></td></tr><tr>`,
  `<td>shimmer 2.2s</td><td><span class="tok">--dur-shimmer</span></td></tr></table>`,
].join('')
+`</div></div>`;
}
export function mount(root){
  const off = mountShimmer(root);
  const bar = root.querySelector('[data-shimmer-tabs]');
  const on = (e) => {
    const b = e.target.closest('[data-tab]');
    if (!b || !bar) return;
    const pane = bar.closest('.ds-pane') || bar.parentElement;
    bar.querySelectorAll('[data-tab]').forEach((x) => {
      const sel = x === b;
      x.classList.toggle('on', sel);
      x.setAttribute('aria-selected', sel ? 'true' : 'false');
    });
    (pane || root).querySelectorAll('[data-tab-panel]').forEach((pn) => {
      pn.hidden = pn.dataset.tabPanel !== b.dataset.tab;
    });
  };
  if (bar) bar.addEventListener('click', on);
  return () => {
    try { off && off(); } catch {}
    if (bar) bar.removeEventListener('click', on);
  };
}
