/* ADAM/DS — rise · lab/code tabs · [plan:2026-09-24_140000-ds-docs-compact.md#phase-2] */
import { note } from '../specimens.js';
import { mountRise } from '../fx-lab.js';
export const title = 'Rise';
export function render(){
  return [
    `<div class="ds-hero ds-hero--lab"><h1>Hero rise.</h1>`,
    `<p class="lede">Mobile case/contact placeholder → final height on <span class="tok">--ease-signature</span>. `,
    `Site runs via <span class="tok">rise.js</span> on <span class="tok">--dur-hero-rise</span> (860ms); lab runs `,
    `on a scoped var.</p></div>`,
  ].join('')
+[
  `<div class="ds-tablist ds-tablist--line" role="tablist" data-rise-tabs>`,
  `<button class="ds-tab on" role="tab" aria-selected="true" data-tab="lab">Lab</button>`,
  `<button class="ds-tab" role="tab" aria-selected="false" data-tab="code">Code</button></div>`,
].join('')
+`<div data-tab-panel="lab"><div class="ds-sec">`
+`<div class="ds-spec block"><div class="fx-rise" data-fx-rise></div>`
+[
  `<div class="fx-controls">`,
  `<label class="fx-row">duration <input type="range" min="300" max="1400" step="20" value="860" data-fx-rise-dur>`,
  `<output data-fx-rise-v>860ms</output></label>`,
].join('')
+`<div class="fx-btns"><button class="pill" data-fx-rise-replay>replay</button></div></div>`
+`<figure><figcaption>placeholder --space-90 → final --size-ds-img · replay removes .rest</figcaption></figure></div>`
+[
  note('Do',
    ['The rise lives in one place: <span class="tok">rise.js</span> serves <span class="tok">project.js</span> + ',
    '<span class="tok">contact.js</span> from <span class="tok">--dur-hero-rise</span>.'].join('')),
  `</div></div>`,
].join('')
+[
  `<div data-tab-panel="code" hidden><div class="ds-sec"><h2>Tokens</h2>`,
  `<p class="sub">Site reads via <span class="tok">var()</span> — no literals.</p>`,
].join('')
+[
  `<table class="ds-table"><tr><th>Literal</th><th>Token</th></tr><tr><td>hero rise 860ms</td><td>`,
  `<span class="tok">--dur-hero-rise</span></td></tr><tr><td>placeholder 300–420px</td>`,
  `<td>range stays literal (viewport math)</td></tr></table>`,
].join('')
+`</div></div>`;
}
export function mount(root){
  const off = mountRise(root);
  const bar = root.querySelector('[data-rise-tabs]');
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
