/* ADAM/DS — Functions · Rise (hero placeholder → final). */
import { note } from '../specimens.js';
import { mountRise } from '../fx-lab.js';
export const title = 'Rise';
export function render(){
  return `<p class="ds-crumb">Functions · Rise</p><div class="ds-hero"><h1>Hero rise.</h1><p class="lede">Mobile case/contact placeholder → final height on <span class="tok">--ease-signature</span>. Site runs via <span class="tok">rise.js</span> on <span class="tok">--dur-hero-rise</span> (860ms); lab runs on a scoped var.</p></div>`
+`<div class="ds-sec"><h2>Lab</h2><p class="sub">Placeholder <span class="tok">--space-90</span> → final <span class="tok">--size-ds-img</span>; replay re-runs the rise.</p>`
+`<div class="ds-spec block"><div class="fx-rise" data-fx-rise></div>`
+`<div class="fx-controls"><label class="fx-row">duration <input type="range" min="300" max="1400" step="20" value="860" data-fx-rise-dur><output data-fx-rise-v>860ms</output></label>`
+`<div class="fx-btns"><button class="pill" data-fx-rise-replay>replay</button></div></div>`
+`<figure><figcaption>placeholder --space-90 → final --size-ds-img · replay removes .rest</figcaption></figure></div>`
+`${note('Do','The rise lives in one place: <span class="tok">rise.js</span> serves <span class="tok">project.js</span> + <span class="tok">contact.js</span> from <span class="tok">--dur-hero-rise</span>.')}</div>`
+`<div class="ds-sec"><h2>Tokens</h2><p class="sub">Graduated in 5.2 — deduped from inline 860ms.</p>`
+`<table class="ds-table"><tr><th>Literal</th><th>Token</th></tr><tr><td>hero rise 860ms</td><td><span class="tok">--dur-hero-rise</span></td></tr><tr><td>placeholder 300–420px</td><td>range stays literal (viewport math)</td></tr></table></div>`;
}
export function mount(r){ return mountRise(r); }
