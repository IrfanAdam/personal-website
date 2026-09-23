/* ADAM/DS — Functions: index. Labs split into per-function routes (Phase 4). */
import { note, code } from './specimens.js';
export const title = 'Functions';
const rows=[
  ['GridReveal — shared function',
    '#/functions/grid-reveal',
    'one builder + one renderer: masonry card + project hero · lab capped 280px + texture toggle'],
  ['Shimmer — skeletal',
    '#/functions/shimmer',
    'token trio --shimmer-gradient / --shimmer-band / --dur-shimmer · case hero only'],
  ['Rise — hero placeholder',
    '#/functions/rise',
    'mobile rise via rise.js --dur-hero-rise --ease-signature · project + contact'],
  ['Viewer — tamed portal','#/functions/viewer','editorial hairline+paper · --fx-viewer-* + --size-viewer-* params'],
  ['Glimmer orb — square voice orb',
    '#/functions/glimmer-orb',
    'idle/listening/thinking · square cells · --color-accent'],
  ['Glitch — generic container',
    '#/functions/glitch',
    'any container via .fx-glitch or attachGlitch(el) · --dur-glitch + --fx-glitch-*'],
  ['Scramble — decoding text',
    '#/functions/scramble',
    ['GSAP ScrambleText parity · chars/speed/revealDelay/delimiter/rtl · --dur-scramble + font switch + synced ',
    'sound'].join('')],
];
export function render(){
  return [
    `<p class="ds-crumb">Motion · Index</p><div class="ds-hero"><h1>Motion with a model.</h1>`,
    `<p class="lede">Seven tuned labs, each its own route. `,
    `Labs run on production geometry; the site stays untouched until a tuned value graduates to a token. `,
    `Durations + easings are specced in <a href="#/motion">Elements → Motion</a>.</p></div>`,
  ].join('')
+[
  `<div class="ds-sec"><h2>Where labs live</h2>`,
  `<p class="sub">Seven labs + this index. Old <span class="tok">#/functions</span> was one long page — now split `,
  `so each lab has depth without scrolling.</p>`,
].join('')
+[
  `<table class="ds-table"><tr><th>Function</th><th>What it holds</th></tr>`,
  rows.map(([label,href,desc])=>`<tr><td><a href="${href}">${label}</a></td><td>${desc}</td></tr>`).join(''),
  `</table>`,
].join('')
+[
  note('Do',
    ['Tune in the lab that owns the model, then graduate via <span class="tok">--fx-*</span> — never copy a lab ',
    'literal into site code.'].join(''),'do'),
].join('')
+`</div>`
+[
  `<div class="ds-sec"><h2>Token backlog</h2>`,
  `<p class="sub">Phase-5 graduation record — every site literal now a token read with shipped fallback.</p>`,
].join('')
+`<table class="ds-table"><tr><th>Site read as</th><th>Graduated to</th></tr>`
+`<tr><td>TARGET 30 · cells 48–180</td><td>✓ <span class="tok">--fx-cell</span></td></tr>`
+[
  `<tr><td>WAIT_CAP 0.72 · PHOTO_FROM 0.93</td>`,
  `<td>✓ <span class="tok">--fx-wait</span> · <span class="tok">--fx-photo-from</span></td></tr>`,
].join('')
+[
  `<tr><td>COLOR_MS 240 · SPAN_S 0.6 · SKELETON 120ms</td>`,
  `<td>✓ <span class="tok">--dur-fx-color</span> · <span class="tok">--dur-fx-span</span> · <span `,
  `class="tok">--fx-skeleton</span></td></tr>`,
].join('')
+[
  `<tr><td>MORPH 0.04 · LAST_SPLIT 0.92</td>`,
  `<td>✓ <span class="tok">--fx-morph</span> · <span class="tok">--fx-split-end</span></td></tr>`,
].join('')
+[
  `<tr><td>sheen 0.14 / grid pitch 14px</td>`,
  `<td>✓ <span class="tok">--fx-sheen</span> · <span class="tok">--fx-grid-pitch</span></td></tr>`,
].join('')
+[
  `<tr><td>hero rise 860ms</td><td>✓ <span class="tok">--dur-hero-rise</span> via <span class="tok">rise.js</span>`,
  `</td></tr>`,
].join('')
+[
  `<tr><td>viewer threshold/idle/spring/geometry</td>`,
  `<td>✓ <span class="tok">--fx-viewer-*</span> · <span class="tok">--size-viewer-*</span></td></tr>`,
].join('')
+[
  `<tr><td>glitch jitter 1px · skew -12deg · 2.4s</td>`,
  `<td>✓ <span class="tok">--dur-glitch</span> · <span class="tok">--fx-glitch-*</span> via <span `,
  `class="tok">glitch.js</span></td></tr>`,
].join('')
+[
  `</table>`,
  code("No lab value enters the site until it is a token consumed via var() — literals stay in the lab."),
  `</div>`,
].join('')
+[
  `<div class="ds-sec"><h2>Single source note</h2>`,
  `<p class="sub">GridReveal is the only shared function — see its page for the full source map (masonry card vs `,
  `project hero).</p>`,
].join('')
+`<a href="#/functions/grid-reveal" class="pill">Open GridReveal →</a></div>`;
}
export function mount(){ return ()=>{}; }
