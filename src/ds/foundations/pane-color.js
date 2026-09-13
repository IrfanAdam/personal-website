/* ADAM/DS — ds/foundations/pane-color · color composer · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { ramp, note } from '../specimens.js';
import { MIX, MATS, CANVAS, FEED } from './color/data.js';
import { pairs, decor } from './color/sections.js';
export const label = 'Color';
export function html() {
  return [
    `<div class="ds-sec"><h2>Color</h2>`,
    `<p class="sub">Four synthetic materials, named for what they are — never stone/accent ordinals. Hover any ramp `,
    `step for its material name + live value (click to copy). Every pair proves its ratio inline, light + dark — `,
    `a11y is embedded, no proof tables.</p>`,
  ].join('')
  + `<h3>① Materials — ref-only</h3><p class="sub">Consume the semantic name, never the step.</p>`
  + MATS.map(([m,r,t,s]) => `<h3>${m} · ${r}</h3><p class="sub">${s}</p>${ramp(t,m)}`).join('')
  + note('Do',
    'Three accents stop here: Phosphor · Resin · Glass. New hues arrive as component tokens, never a fourth ramp.')
  + [
    `<h3>② Pairs — light on dark · dark on light, AA inline</h3>`,
    `<p class="sub">Each line demos real text (<b>Aa</b>) on its real background, probed live in both themes with `,
    `ratio + verdict beside it.</p><h3>Canvas · ink on paper</h3>`,
  ].join('')
  + pairs(CANVAS)
  + [
    `<h3>Action + feedback · fill + ink</h3>`,
    `<p class="sub">Fill = light on dark (on-color on role) · Ink = dark on light (role on paper) — both `,
    `directions, both themes.</p>`,
  ].join('')
  + pairs(FEED)
  + [
    `<h3>Decorative + slots — no text pair</h3>`,
    `<p class="sub">Washes, edges and aliases: never body text, so no ratio. Slots repoint beneath semantics — swap `,
    `the slot, not the ramp.</p>`,
  ].join('')
  + decor()
  + [
    `</div><div class="ds-sec"><h2>Color explorer</h2>`,
    `<p class="sub">Playground, demoted below the system. Mixer blends two opaque semantic tokens at <span `,
    `class="tok">t</span>.</p><h3>③ Playground — mixer, opaque tokens only</h3><div class="ds-spec block">`,
    `<div id="mixSw" style="height:var(--space-60);border:var(--border-hairline);background:var(--color-ink)"></div>`,
    `<div class="fx-controls" id="mixCtrls"><label class="fx-row">A <select data-mix="a">`,
    MIX.map((t) => `<option value="${t}">${t}</option>`).join(''),
    `</select></label><label class="fx-row">B <select data-mix="b">`,
    MIX.map((t) => `<option value="${t}"${t === '--color-accent' ? ' selected' : ''}>${t}</option>`).join(''),
    `</select></label>`,
    `<label class="fx-row">t <input type="range" min="0" max="100" step="1" value="50" data-mix="t">`,
    `<output data-mix-v="t">0.50</output></label><div class="fx-btns">`,
    `<button class="tok" data-mix-copy="var">copy var()</button>`,
    `<button class="tok" data-mix-copy="hex">copy hex</button></div>`,
    `<div class="vl" id="mixVal" style="font-family:var(--font-mono);font-size:var(--text-micro)"></div></div></div>`,
    `</div>`,
  ].join('');
}
