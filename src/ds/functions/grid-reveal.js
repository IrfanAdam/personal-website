/* ADAM/DS — Functions · GridReveal (shared). Lab + single-source docs. */
import { note, code } from '../specimens.js';
import { mountCells } from '../fx-lab.js';
export const title = 'GridReveal';
export function render(){
  return `<p class="ds-crumb">Functions · GridReveal</p><div class="ds-hero"><h1>Grid reveal — one function, two surfaces.</h1><p class="lede">Same <span class="tok">cells.js · buildTree</span> as the masonry; same <span class="tok">gridReveal.js</span> as the hero. The lab below is a 280px window into that function — never pushes controls below the fold.</p></div>`
+`<div class="ds-sec"><h2>Lab</h2><p class="sub">Capped at 280px; texture toggle samples real imagery. Controls collapsed: core (cells/morph/span) + <span class="tok">Advanced</span>. Reduced-motion paints one static frame.</p>`
+`<div class="ds-spec block"><canvas class="fx-stage" data-fx-stage style="max-height:var(--size-ds-lab)" aria-label="Cell-grid lab"></canvas>`
+`<div class="fx-controls" data-fx-cells>`
+`<label class="fx-row">cells <input type="range" min="48" max="180" step="4" value="120" data-k="count"><output data-v="count">120</output></label>`
+`<label class="fx-row">morph <input type="range" min="1" max="20" step="1" value="4" data-k="morph"><output data-v="morph">0.04</output></label>`
+`<label class="fx-row">span <input type="range" min="6" max="30" step="1" value="12" data-k="span"><output data-v="span">1.2s</output></label>`
+`<details><summary style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted);cursor:pointer;margin:var(--space-8) 0">Advanced</summary>`
+`<label class="fx-row">gutter <input type="range" min="0" max="3" step="0.5" value="1" data-k="gut"><output data-v="gut">1px</output></label>`
+`<label class="fx-row">order <select data-k="order"><option value="seq">sequential</option><option value="rnd">random</option></select><output data-v="order">seq</output></label>`
+`<label class="fx-row">texture <select data-k="image"><option value="none">none · grey</option><option value="helix">helix · .png</option><option value="fluxx">fluxx · .jpg</option><option value="tas-35">tas-35 · .jpg</option></select><output data-v="image">none</output></label>`
+`</details><div class="fx-btns"><button class="pill" data-fx-replay>replay</button><button class="pill" data-fx-shuffle>shuffle</button></div>`
+`</div><figure><figcaption>geometry + pacing mirror gridReveal.js · renderer is lab-local · image ON measures via <span class="tok">measureTree</span></figcaption></figure></div>`
+`${code("import { buildTree, orderRandom } from '../views/masonry/cells.js'  // single source\\nimport { attachGridReveal } from '../views/masonry/gridReveal.js' // single renderer\\n// tokens: --fx-cell · --fx-wait · --fx-photo-from · --dur-fx-color · --dur-fx-span · --fx-morph · --fx-split-end")}`
+`${note('Do','Tune here, graduate via <span class="tok">--fx-*</span>. Replay + shuffle work with texture ON/OFF; reduced-motion is one frame.')}`
+`</div>`
+`<div class="ds-sec"><h2>Single source</h2><p class="sub">One builder + one renderer, two call sites. No duplicated geometry docs.</p>`
+`<table class="ds-table"><tr><th>Module</th><th>Exports</th><th>Consumers</th></tr>`
+`<tr><td><span class="tok">views/masonry/cells.js</span></td><td><span class="tok">buildTree</span>(aspect,count,morph,splitEnd) · <span class="tok">measureTree</span> · <span class="tok">orderRandom</span></td><td>lab + <span class="tok">gridReveal.js</span></td></tr>`
+`<tr><td><span class="tok">views/masonry/gridReveal.js</span></td><td><span class="tok">attachGridReveal(box,img,delay,hero)</span></td><td>masonry card + <span class="tok">rise.js</span> hero</td></tr>`
+`<tr><td><span class="tok">views/fx-tokens.js</span></td><td><span class="tok">fxNum</span> · <span class="tok">fxMs</span></td><td>reads <span class="tok">--fx-*</span> with shipped fallback</td></tr>`
+`</table>${code("cells.js — binary split by widest area + hash jitter → splitAt pacing\\ngridReveal.js — canvas mosaic → photo fade → finish() adds .ready")}</div>`
+`<div class="ds-sec"><h2>Usage</h2><p class="sub">Two surfaces, one function.</p>`
+`<div class="ds-grid c2"><div class="ds-cell"><div class="nm">A · Masonry card</div><div class="vl"><span class="tok">masonry.js</span> → <span class="tok">.card .hero-box</span> + <span class="tok">&lt;canvas.gr&gt;</span> + <span class="tok">&lt;img&gt;</span> → <span class="tok">attachGridReveal(box,img,delay)</span> · IO-gated + count by <span class="tok">--fx-cell</span></div><a href="/#/" class="pill" style="margin-top:var(--space-8);display:inline-block">See masonry →</a></div>`
+`<div class="ds-cell"><div class="nm">B · Project hero</div><div class="vl"><span class="tok">rise.js</span> → placeholder rise (<span class="tok">--dur-hero-rise</span> <span class="tok">--ease-signature</span>) → <span class="tok">attachGridReveal(box,img,80,true)</span> · <span class="tok">project.js</span> + <span class="tok">contact.js</span></div><a href="/#/projects/helix" class="pill" style="margin-top:var(--space-8);display:inline-block">See case hero →</a></div></div>`
+`${note('Do','No geometry is forked. Card and hero share the same split tree; only the trigger differs (IO vs hero-rise).','do')}</div>`;
}
export function mount(root){ return mountCells(root); }
