/* ADAM/DS — ds/foundations/pane-color · color composer
   [plan:2026-09-23_130000-ds-understandable-mutable.md#phase-1] */
// Exports: label, html — inner line tabs: Ramps / Pairs / Decor / Lab
import { ramp, note } from '../specimens.js';
import { MIX, MATS, CANVAS, FEED } from './color/data.js';
import { pairs, decor } from './color/sections.js';
import { tabs } from '../tabs.js';
export const label = 'Color';
export function html() {
  const h = window.location.hash || '';
  const qs = h.includes('?') ? h.split('?')[1] : (window.location.search.slice(1) || '');
  const sp = new URLSearchParams(qs);
  const t = (sp.get('tab') || sp.get('colorTab') || '').toLowerCase();
  const m = {
    ramps: 0, ramp: 0, materials: 0, pairs: 1, pair: 1,
    canvas: 1, decor: 2, decorative: 2, slots: 2,
    lab: 3, mixer: 3, playground: 3,
  };
  const init = m[t] ?? 0;
  const intro = [
    `<div class="ds-sec"><h2>Color</h2>`,
    `<p class="sub">Four synthetic materials, named for what they are — never stone/accent ordinals. Hover any ramp `,
    `step for its material name + live value (click to copy). Every pair proves its ratio inline, light + dark — `,
    `a11y is embedded, no proof tables.</p></div>`,
  ].join('');
  const ramps = [
    `<h3>① Materials — ref-only</h3><p class="sub">Consume the semantic name, never the step.</p>`,
    MATS.map(([a,r,tk,s]) => `<h3>${a} · ${r}</h3><p class="sub">${s}</p>${ramp(tk,a)}`).join(''),
    note('Do',
      'Three accents stop here: Phosphor · Resin · Glass. '
      + 'New hues arrive as component tokens, never a fourth ramp.'),
  ].join('');
  const pairsHtml = [
    `<h3>② Pairs — light on dark · dark on light, AA inline</h3>`,
    `<p class="sub">Each line demos real text (<b>Aa</b>) on its real background, probed live in both themes with `,
    `ratio + verdict beside it.</p><h3>Canvas · ink on paper</h3>`,
    pairs(CANVAS),
    `<h3>Action + feedback · fill + ink</h3>`,
    `<p class="sub">Fill = light on dark (on-color on role) · Ink = dark on light (role on paper) — both `,
    `directions, both themes.</p>`,
    pairs(FEED),
  ].join('');
  const decorHtml = [
    `<h3>Decorative + slots — no text pair</h3>`,
    `<p class="sub">Washes, edges and aliases: never body text, so no ratio. Slots repoint beneath semantics — swap `,
    `the slot, not the ramp.</p>`,
    decor(),
  ].join('');
  const lab = [
    `<h2>Color explorer</h2>`,
    `<p class="sub">Playground, demoted below the system. Mixer blends two opaque semantic tokens at <span `,
    `class="tok">t</span>.</p><h3>③ Playground — mixer, opaque tokens only</h3><div class="ds-spec block">`,
    `<div id="mixSw" style="height:var(--space-60);border:var(--border-hairline);background:var(--color-ink)\"></div>`,
    `<div class="fx-controls" id="mixCtrls"><label class="fx-row">A <select data-mix="a">`,
    MIX.map((x) => `<option value="${x}">${x}</option>`).join(''),
    `</select></label><label class="fx-row">B <select data-mix="b">`,
    MIX.map((x) => `<option value="${x}"${x === '--color-accent' ? ' selected' : ''}>${x}</option>`).join(''),
    `</select></label>`,
    `<label class="fx-row">t <input type="range" min="0" max="100" step="1" value="50" data-mix="t">`,
    `<output data-mix-v="t">0.50</output></label><div class="fx-btns">`,
    `<button class="tok" data-mix-copy="var">copy var()</button>`,
    `<button class="tok" data-mix-copy="hex">copy hex</button></div>`,
    `<div class="vl" id="mixVal" style="font-family:var(--font-mono);font-size:var(--text-micro)"></div></div></div>`,
  ].join('');
  const inner = tabs({ variant: 'line', initial: init, panes: [
    { label: 'Ramps', html: ramps },
    { label: 'Pairs', html: pairsHtml },
    { label: 'Decor', html: decorHtml },
    { label: 'Lab', html: lab },
  ] });
  return intro + inner;
}
