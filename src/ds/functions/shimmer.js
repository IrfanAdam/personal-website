/* ADAM/DS — Functions · Shimmer (skeletal). */
import { note, code } from '../specimens.js';
import { mountShimmer } from '../fx-lab.js';
export const title = 'Shimmer';
export function render(){
  return `<p class="ds-crumb">Functions · Shimmer</p><div class="ds-hero"><h1>Skeletal shimmer.</h1><p class="lede">Token trio live: <span class="tok">--shimmer-gradient</span> + <span class="tok">--shimmer-band</span> + <span class="tok">--dur-shimmer</span>. Case heroes shimmer; masonry shelved it (canvas owns that sheen).</p></div>`
+`<div class="ds-sec"><h2>Lab</h2><p class="sub">Grid is <span class="tok">--reveal-grid</span> (reads <span class="tok">--fx-grid-pitch</span>); sheen is a masked gradient sweep.</p>`
+`<div class="ds-spec block"><div class="fx-shimmer" data-fx-shimmer><i></i></div>`
+`<div class="fx-controls"><label class="fx-row">duration <input type="range" min="8" max="40" step="1" value="22" data-fx-dur><output data-fx-dur-v>2.2s</output></label>`
+`<div class="fx-btns"><button class="pill" data-fx-dir>reverse</button><button class="pill" data-fx-pause>pause</button></div></div>`
+`<figure><figcaption>grid = --reveal-grid · sheen = masked gradient sweep · reduced-motion: off</figcaption></figure></div>`
+`${code('.fx-shimmer i {\\n  background: var(--shimmer-gradient);\\n  -webkit-mask-image: var(--shimmer-band); mask-image: var(--shimmer-band);\\n  animation: fx-sheen var(--dur-shimmer) linear infinite;\\n}')}`
+`${note('Do','Duration is the only safe knob — band + gradient live in <span class="tok">tokens.css</span>. Grid pitch is <span class="tok">--fx-grid-pitch</span>.')}</div>`
+`<div class="ds-sec"><h2>Tokens</h2><p class="sub">Graduated in 5.1 — site reads via <span class="tok">var()</span>.</p>`
+`<table class="ds-table"><tr><th>Literal</th><th>Token</th></tr><tr><td>sheen base 0.14 / final +0.10</td><td><span class="tok">--fx-sheen</span></td></tr><tr><td>grid pitch 14px</td><td><span class="tok">--fx-grid-pitch</span> inside <span class="tok">--reveal-grid</span></td></tr><tr><td>shimmer 2.2s</td><td><span class="tok">--dur-shimmer</span></td></tr></table></div>`;
}
export function mount(r){ return mountShimmer(r); }
