/* ADAM/DS — Functions: interaction models (cell-grid · shimmer · rise · viewer).
   DS-only labs built on the REAL implementation as reference (cells.js imports).
   Tune + optimise here; the site adopts via tokens later — nothing here ships. */
import { note, code } from './specimens.js';
import { mountFx } from './fx-lab.js';
export const title = 'Functions';
export function render() {
  return `<p class="ds-crumb">Library · Interaction models</p><div class="ds-hero"><h1>Motion with a model.</h1>
<p class="lede">Cell-grid reveal, skeletal shimmer, hero rise, and the viewer portal — running here as labs on the production geometry. Every value is tweakable; the site stays untouched until a tuned value graduates to a token.</p></div>
<div class="ds-sec"><h2>Cell-grid reveal</h2><p class="sub">Same tree builder as the masonry (<span class="tok">cells.js · buildTree</span>), lab-local renderer. The accent frontier marks the split wave.</p>
<div class="ds-spec block"><canvas class="fx-stage" data-fx-stage aria-label="Cell-grid lab"></canvas>
<div class="fx-controls" data-fx-cells>
<label class="fx-row">cells <input type="range" min="48" max="180" step="4" value="120" data-k="count"><output data-v="count">120</output></label>
<label class="fx-row">morph <input type="range" min="1" max="20" step="1" value="4" data-k="morph"><output data-v="morph">0.04</output></label>
<label class="fx-row">gutter <input type="range" min="0" max="3" step="0.5" value="1" data-k="gut"><output data-v="gut">1px</output></label>
<label class="fx-row">span <input type="range" min="6" max="30" step="1" value="12" data-k="span"><output data-v="span">1.2s</output></label>
<label class="fx-row">order <select data-k="order"><option value="seq">sequential</option><option value="rnd">random</option></select><output data-v="order">seq</output></label>
<div class="fx-btns"><button class="pill" data-fx-replay>replay</button><button class="pill" data-fx-shuffle>shuffle</button></div>
</div><figure><figcaption>geometry + pacing mirror gridReveal.js · renderer is lab-local</figcaption></figure></div>
${code("import { buildTree, orderRandom } from '../views/masonry/cells.js'  // lab imports production geometry\n// graduated 5.1: TARGET→--fx-cell · WAIT_CAP→--fx-wait · PHOTO_FROM→--fx-photo-from · COLOR_MS→--dur-fx-color · SPAN_S→--dur-fx-span")}
${note('Do', 'Tune here, then graduate the winning value to a <span class="tok">--fx-*</span> token — never copy a lab literal into site code.')}</div>
<div class="ds-sec"><h2>Skeletal shimmer</h2><p class="sub">The production token trio, live: <span class="tok">--shimmer-gradient</span> + <span class="tok">--shimmer-band</span> + <span class="tok">--dur-shimmer</span>. Case heroes use it; cards shelved it (the canvas owns that sheen).</p>
<div class="ds-spec block"><div class="fx-shimmer" data-fx-shimmer><i></i></div>
<div class="fx-controls"><label class="fx-row">duration <input type="range" min="8" max="40" step="1" value="22" data-fx-dur><output data-fx-dur-v>2.2s</output></label>
<div class="fx-btns"><button class="pill" data-fx-dir>reverse</button><button class="pill" data-fx-pause>pause</button></div></div>
<figure><figcaption>grid = --reveal-grid · sheen = masked gradient sweep</figcaption></figure></div>
${code('.fx-shimmer i {\n  background: var(--shimmer-gradient);\n  -webkit-mask-image: var(--shimmer-band); mask-image: var(--shimmer-band);\n  animation: fx-sheen var(--dur-shimmer) linear infinite;\n}')}
${note('Do', 'Duration is the only safe knob today — band stops + gradient live in <span class="tok">tokens.css</span>. Grid pitch is live too: <span class="tok">--reveal-grid</span> consumes <span class="tok">--fx-grid-pitch</span>.')}</div>
<div class="ds-sec"><h2>Hero rise</h2><p class="sub">Mobile case/contact placeholder → final height on <span class="tok">--ease-signature</span>. The site runs it via the shared <span class="tok">rise.js</span> helper on <span class="tok">--dur-hero-rise</span> (860ms); the lab runs it on a scoped var.</p>
<div class="ds-spec block"><div class="fx-rise" data-fx-rise></div>
<div class="fx-controls"><label class="fx-row">duration <input type="range" min="300" max="1400" step="20" value="860" data-fx-rise-dur><output data-fx-rise-v>860ms</output></label>
<div class="fx-btns"><button class="pill" data-fx-rise-replay>replay</button></div></div>
<figure><figcaption>placeholder --space-90 → final --size-ds-img · replay re-runs the rise</figcaption></figure></div>
${note('Do', 'The rise lives in one place now: <span class="tok">rise.js</span> serves <span class="tok">project.js</span> + <span class="tok">contact.js</span> from <span class="tok">--dur-hero-rise</span>.')}</div>
<div class="ds-sec"><h2>Viewer portal — params</h2><p class="sub">Tamed editorial expander (hairline + paper, no neon). Former overlays (<span class="tok">--viewer-grid/scan/neon</span>) removed in v1.1; glass/bar/shimmer markup deleted in 5.3. Params below are the live tokens the site reads.</p>
<table class="ds-table"><tr><th>Param</th><th>Value</th><th>Role</th></tr>
<tr><td>threshold</td><td><span class="tok">--fx-viewer-threshold</span> · 12px travel</td><td>portal arms after intent</td></tr>
<tr><td>idle</td><td><span class="tok">--fx-viewer-idle</span> · 850ms</td><td>portal hides when the cursor rests</td></tr>
<tr><td>hide debounce</td><td><span class="tok">--fx-viewer-debounce</span> · 70ms</td><td>gap-crossing tolerance</td></tr>
<tr><td>spring</td><td><span class="tok">--fx-viewer-k</span> 0.1 · <span class="tok">--fx-viewer-fr</span> 0.54</td><td>preview-Y chase</td></tr>
<tr><td>geometry</td><td><span class="tok">--size-viewer-w</span> 180px · gap 10 · pad 20</td><td>portal placement + collision flip</td></tr></table></div>
<div class="ds-sec"><h2>Token backlog</h2><p class="sub">Phase-5 graduation record. Every value the site consumed as a literal is now a token read with a shipped fallback — nothing here changes pixels.</p>
<table class="ds-table"><tr><th>Site read as</th><th>Graduated to</th></tr>
<tr><td>TARGET 30 · cells 48–180</td><td>✓ <span class="tok">--fx-cell</span> (range stays literal)</td></tr>
<tr><td>WAIT_CAP 0.72 · PHOTO_FROM 0.93</td><td>✓ <span class="tok">--fx-wait</span> · <span class="tok">--fx-photo-from</span></td></tr>
<tr><td>COLOR_MS 240 · SPAN_S 0.6 · SKELETON 120ms</td><td>✓ <span class="tok">--dur-fx-color</span> · <span class="tok">--dur-fx-span</span> · <span class="tok">--fx-skeleton</span></td></tr>
<tr><td>MORPH 0.04 · LAST_SPLIT 0.92</td><td>✓ <span class="tok">--fx-morph</span> · <span class="tok">--fx-split-end</span></td></tr>
<tr><td>sheen 0.14 / 0.24 · grid pitch 14px</td><td>✓ <span class="tok">--fx-sheen</span> (base; final sweep +0.10) · <span class="tok">--fx-grid-pitch</span> (inside --reveal-grid)</td></tr>
<tr><td>hero rise 860ms · placeholder 300–420px</td><td>✓ <span class="tok">--dur-hero-rise</span> via <span class="tok">rise.js</span> · placeholder range stays literal</td></tr>
<tr><td>viewer threshold / idle / spring / geometry</td><td>✓ <span class="tok">--fx-viewer-*</span> · <span class="tok">--size-viewer-*</span></td></tr></table>
${note('Don’t', 'No lab value enters the site until it is a token consumed via <span class="tok">var()</span> — literals stay in the lab.', 'dont')}</div>`;
}
export function mount(root) { return mountFx(root); }
