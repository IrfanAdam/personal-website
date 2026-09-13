/* ADAM/DS — Functions · GridReveal docs sections · [plan:2026-09-13_235413-over-limit-splits.md#phase-3] */
// Exports: docsSections — single-source + usage markup
import { note, code } from '../specimens.js';
export function docsSections(){
  return [
  `<div class="ds-sec"><h2>Single source</h2>`,
  `<p class="sub">One builder + one renderer, two call sites. No duplicated geometry docs.</p>`,
].join('')
+`<table class="ds-table"><tr><th>Module</th><th>Exports</th><th>Consumers</th></tr>`
+[
  `<tr><td><span class="tok">views/masonry/cells.js</span></td><td>`,
  `<span class="tok">buildTree</span>(aspect,count,morph,splitEnd) · <span class="tok">measureTree</span> · <span `,
  `class="tok">orderRandom</span></td><td>lab + <span class="tok">gridReveal.js</span></td></tr>`,
].join('')
+[
  `<tr><td><span class="tok">views/masonry/gridReveal.js</span></td><td>`,
  `<span class="tok">attachGridReveal(box,img,delay,hero)</span></td>`,
  `<td>masonry card + <span class="tok">rise.js</span> hero</td></tr>`,
].join('')
+[
  `<tr><td><span class="tok">views/fx-tokens.js</span></td><td>`,
  `<span class="tok">fxNum</span> · <span class="tok">fxMs</span></td>`,
  `<td>reads <span class="tok">--fx-*</span> with shipped fallback</td></tr>`,
].join('')
+[
  `</table>`,
  code(["cells.js — binary split by widest area + hash jitter → splitAt pacing\\ngridReveal.js — canvas mosaic → ",
    "photo fade → finish() adds .ready"].join('')),
  `</div>`,
].join('')
+`<div class="ds-sec"><h2>Usage</h2><p class="sub">Two surfaces, one function.</p>`
+[
  `<div class="ds-grid c2"><div class="ds-cell"><div class="nm">A · Masonry card</div><div class="vl">`,
  `<span class="tok">masonry.js</span> → <span class="tok">.card .hero-box</span> + <span `,
  `class="tok">&lt;canvas.gr&gt;</span> + <span class="tok">&lt;img&gt;</span> → <span `,
  `class="tok">attachGridReveal(box,img,delay)</span> · IO-gated + count by <span class="tok">--fx-cell</span></div>`,
  `<a href="/#/" class="pill" style="margin-top:var(--space-8);display:inline-block">See masonry →</a></div>`,
].join('')
+[
  `<div class="ds-cell"><div class="nm">B · Project hero</div><div class="vl">`,
  `<span class="tok">rise.js</span> → placeholder rise (<span class="tok">--dur-hero-rise</span> <span `,
  `class="tok">--ease-signature</span>) → <span class="tok">attachGridReveal(box,img,80,true)</span> · <span `,
  `class="tok">project.js</span> + <span class="tok">contact.js</span></div>`,
  `<a href="/#/projects/helix" class="pill" style="margin-top:var(--space-8);display:inline-block">See case hero `,
  `→</a></div></div>`,
].join('')
+[
  note('Do',
    'No geometry is forked. Card and hero share the same split tree; only the trigger differs (IO vs hero-rise).',
    'do'),
  `</div>`,
  ].join('');
}
