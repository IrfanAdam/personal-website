/* ADAM/DS foundations · Color — ① materials (popover ramps) → ② pairs (AA inline) → ③ mixer. No proof tables: each pair proves AA inline, both themes. */
import { ramp, note } from '../specimens.js';
const MIX = ['--color-ink','--color-bg','--color-accent','--color-surface','--color-surface-sunken','--color-overlay','--color-success','--color-error','--color-warning','--color-info'];
const STONE = ['--stone-0','--stone-25','--stone-50','--stone-100','--stone-200','--stone-300','--stone-400','--stone-500','--stone-600','--stone-700','--stone-800','--stone-900','--stone-950'];
const PHOS = ['--accent-100','--accent-300','--accent-500','--accent-600','--accent-700','--accent-900'];
const RESIN = ['--accent2-100','--accent2-300','--accent2-500','--accent2-600','--accent2-700','--accent2-900'];
const GLASS = ['--accent3-100','--accent3-300','--accent3-500','--accent3-600','--accent3-700','--accent3-900'];
const MATS = [
['Frost Alloy','neutral 0–950 · --stone-*',STONE,'Matte hull plating under frost — every can (bg, surface, ink, line). Never consume a raw step.'],
['Signal Phosphor','vermilion · --accent-*',PHOS,'One red phosphor that blooms once — CTA, badge, error. Production step --accent-500.'],
['Caution Resin','amber · --accent2-*',RESIN,'Warm caution cell — warning text/fill (700 light / 300 dark); --accent2-500 decorative only.'],
['Circuit Glass','teal · --accent3-*',GLASS,'Frosted circuit glass — success deepest (700/300) + info mid (600/100), split by icon.']
];
const CANVAS = [
['Background','--color-bg','--color-ink','page + cards'],
['Surface','--color-surface','--color-ink','cards + doc cells'],
['Sunken','--color-surface-sunken','--color-ink','wells + sunken rows'],
['Overlay','--color-overlay','--color-ink','viewer + modal'],
['Muted','--color-bg','--color-ink-muted','meta + kickers + labels']
];
const FEED = [
['Accent fill','--color-accent','--color-on-accent','CTA + badge · large-scale'],
['Success fill','--color-success','--color-on-success','sent · ok'],
['Success ink','--color-bg','--color-success','form ok on paper'],
['Error fill','--color-error','--color-on-error','field error · failed'],
['Error ink','--color-bg','--color-error','error text on paper'],
['Warning fill','--color-warning','--color-on-warning','caution · unsaved'],
['Warning ink','--color-bg','--color-warning','caution text on paper'],
['Info fill','--color-info','--color-on-info','notice · hint'],
['Info ink','--color-bg','--color-info','notice text on paper']
];
const DECOR = [
['--color-line','hairlines + card borders · 10% ink'],
['--color-header','sticky header veil'],
['--color-panel','doc cells + hover wash'],
['--color-chip','tags + filter pills · 62% ink'],
['--color-input-bg / --color-input-line / --color-input-focus','field fill · border · focus edge'],
['--color-on-media / --color-on-media-muted','card info + tags on image'],
['--color-viewer-bg / --color-viewer-line / --color-viewer-shade / --color-viewer-tether','viewer panel · frost border · dim · connector'],
['--color-shadow-media / --color-shadow-media-sm / --color-shadow-viewer / --color-shadow-viewer-soft','elevation washes · stone-950 at 45/40/24/12%'],
['--color-disabled-bg / --color-disabled-ink / --color-disabled-line','disabled set · exempt, never interactive text'],
['--color-focus','keyboard ring, all themes (+ --border-focus in Shape)'],
['--color-ink-subtle','faintest meta · decorative only, never body text'],
['--signal / --signal-amber / --signal-teal','ramp → slot → semantic · --color-accent follows the slot']
];
const pairs = (rows) => `<div style="overflow-x:auto"><table class="ds-table cl-table"><tr><th>Use</th><th>Pair</th><th>Light</th><th>Dark</th></tr>${rows.map(([n,bg,fg,u]) => `<tr data-bg="${bg}" data-fg="${fg}"><td>${n}<div class="cl-use">${u}</div></td><td><span class="tok">${fg}</span><div class="cl-use">on</div><span class="tok">${bg}</span></td>${['light','dark'].map((t) => `<td data-c="${t}"><span class="cl-demo" data-demo>Aa</span><br><span class="cl-aa" data-aa>…</span></td>`).join('')}</tr>`).join('')}</table></div>`;
const decor = `<div style="overflow-x:auto"><table class="ds-table cl-table"><tr><th>Token</th><th>Use</th></tr>${DECOR.map(([t,u]) => `<tr><td>${t.split(' / ').map((x) => `<span class="tok">${x}</span>`).join(' ')}</td><td>${u}</td></tr>`).join('')}</table></div>`;
export const label = 'Color';
export function html() {
  return `<div class="ds-sec"><h2>Color</h2><p class="sub">Four synthetic materials, named for what they are — never stone/accent ordinals. Hover any ramp step for its material name + live value (click to copy). Every pair proves its ratio inline, light + dark — a11y is embedded, no proof tables.</p>`
  + `<h3>① Materials — ref-only</h3><p class="sub">Consume the semantic name, never the step.</p>`
  + MATS.map(([m,r,t,s]) => `<h3>${m} · ${r}</h3><p class="sub">${s}</p>${ramp(t,m)}`).join('')
  + note('Do','Three accents stop here: Phosphor · Resin · Glass. New hues arrive as component tokens, never a fourth ramp.')
  + `<h3>② Pairs — light on dark · dark on light, AA inline</h3><p class="sub">Each line demos real text (<b>Aa</b>) on its real background, probed live in both themes with ratio + verdict beside it.</p><h3>Canvas · ink on paper</h3>`
  + pairs(CANVAS)
  + `<h3>Action + feedback · fill + ink</h3><p class="sub">Fill = light on dark (on-color on role) · Ink = dark on light (role on paper) — both directions, both themes.</p>`
  + pairs(FEED)
  + `<h3>Decorative + slots — no text pair</h3><p class="sub">Washes, edges and aliases: never body text, so no ratio. Slots repoint beneath semantics — swap the slot, not the ramp.</p>`
  + decor
  + `</div><div class="ds-sec"><h2>Color explorer</h2><p class="sub">Playground, demoted below the system. Mixer blends two opaque semantic tokens at <span class="tok">t</span>.</p><h3>③ Playground — mixer, opaque tokens only</h3><div class="ds-spec block"><div id="mixSw" style="height:var(--space-60);border:var(--border-hairline);background:var(--color-ink)"></div><div class="fx-controls" id="mixCtrls"><label class="fx-row">A <select data-mix="a">${MIX.map((t) => `<option value="${t}">${t}</option>`).join('')}</select></label><label class="fx-row">B <select data-mix="b">${MIX.map((t) => `<option value="${t}"${t === '--color-accent' ? ' selected' : ''}>${t}</option>`).join('')}</select></label><label class="fx-row">t <input type="range" min="0" max="100" step="1" value="50" data-mix="t"><output data-mix-v="t">0.50</output></label><div class="fx-btns"><button class="tok" data-mix-copy="var">copy var()</button><button class="tok" data-mix-copy="hex">copy hex</button></div><div class="vl" id="mixVal" style="font-family:var(--font-mono);font-size:var(--text-micro)"></div></div></div></div>`;
}
