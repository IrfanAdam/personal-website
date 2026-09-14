/* ADAM/DS — ds/pages-atlas · atlas route shell · [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-3] */
import { LAYERS, KINDS, visible, lookup, edgesVisible } from './atlas/schema.js';
import { paint, bind } from './atlas/canvas.js';
import { renderPanel } from './atlas/panel.js';
// Exports: title, render, mount
export const title = 'Atlas';
const layerPills = LAYERS.map((l) => `<button class="ds-pick on" data-layer="${l}" aria-pressed="true">${l}</button>`);
const kindPills = KINDS.map((k) => `<button class="ds-pick on" data-kind="${k}" aria-pressed="true">${k}</button>`);
export function render() {
  return [
    '<p class="ds-crumb">Start · atlas</p><div class="ds-hero"><h1>Architecture atlas.</h1>',
    '<p class="lede">Functions, components, and foundations on one canvas — live from ',
    '<span class="tok">arch-schema.json</span>. Toggle layers, switch layouts, click a node.</p></div>',
    `<div class="ds-sec"><div class="atlas-bar" role="toolbar" aria-label="Atlas controls">${layerPills.join('')}`,
    '<span class="atlas-sep"></span>',
    '<button class="ds-pick on" data-layout="layered" aria-pressed="true">layered</button>',
    '<button class="ds-pick" data-layout="radial" aria-pressed="false">radial</button>',
    `<span class="atlas-sep"></span>${kindPills.join('')}`,
    '<span class="atlas-count" id="atlasCount"></span></div>',
    '<div class="atlas-wrap"><svg id="atlasSvg" class="atlas-canvas" role="img" ',
    'aria-label="Architecture graph"></svg>',
    '<aside class="atlas-inspector" id="atlasPanel" aria-label="Inspector"></aside></div></div>',
  ].join('');
}
export function mount(root) {
  const svg = root.querySelector('#atlasSvg');
  const panel = root.querySelector('#atlasPanel');
  const count = root.querySelector('#atlasCount');
  const state = { on: new Set(LAYERS), kinds: new Set(KINDS), mode: 'layered', sel: null };
  const cam = { x: 0, y: 0, w: 960, h: 780 };
  const draw = () => {
    const list = visible(state.on);
    const ids = new Set(list.map((n) => n.id));
    const wires = edgesVisible(ids, state.kinds);
    paint(svg, list, state.mode, state.sel, wires);
    count.textContent = `${list.length} nodes · ${wires.length} edges`;
    panel.innerHTML = renderPanel(state.sel ? lookup(state.sel) : null);
  };
  const press = (btn, on) => {
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.classList.toggle('on', on);
  };
  const flip = (set, key, btn) => {
    if (set.has(key)) set.delete(key);
    else set.add(key);
    press(btn, set.has(key));
    draw();
  };
  const onBar = (e) => {
    if (e.target.closest('[data-close]')) { state.sel = null; draw(); return; }
    const pill = e.target.closest('.atlas-bar [data-layer]');
    const kind = e.target.closest('.atlas-bar [data-kind]');
    const lay = e.target.closest('.atlas-bar [data-layout]');
    if (pill) flip(state.on, pill.dataset.layer, pill);
    if (kind) flip(state.kinds, kind.dataset.kind, kind);
    if (lay) {
      state.mode = lay.dataset.layout;
      root.querySelectorAll('[data-layout]').forEach((b) => press(b, b === lay));
      draw();
    }
  };
  const onKey = (e) => {
    if (e.key === 'Escape' && state.sel) { state.sel = null; draw(); }
  };
  const unbind = bind(svg, cam, (id) => { state.sel = id; draw(); });
  root.addEventListener('click', onBar);
  document.addEventListener('keydown', onKey);
  draw();
  return () => {
    unbind();
    root.removeEventListener('click', onBar);
    document.removeEventListener('keydown', onKey);
  };
}
