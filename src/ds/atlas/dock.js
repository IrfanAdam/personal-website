/* ADAM/DS — ds/atlas/dock · floating controls + legend markup/wiring
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-5] */
import { LAYERS, KINDS } from './schema.js';
import { findHTML } from './search.js';
// Exports: dockHTML, legendHTML, bindDock
const ATTR = { 'atlas-dot': 'data-atlas-dot', 'atlas-swatch': 'data-atlas-swatch' };
const chip = (attr, value, on, swatch) => {
  const icon = swatch ? `<i class="${swatch}" ${ATTR[swatch]}="${value}"></i>` : '';
  const cls = `atlas-chip${on ? ' on' : ''}`;
  const open = `<button type="button" class="${cls}" ${attr}="${value}"`;
  const aria = ` aria-pressed="${on ? 'true' : 'false'}">${icon}${value}</button>`;
  return open + aria;
};
const div = '<span class="atlas-div" aria-hidden="true"></span>';
export const dockHTML = () => [
  '<div class="atlas-dock" id="atlasDock" role="toolbar" aria-label="Atlas controls">',
  LAYERS.map((l) => chip('data-layer', l, true, 'atlas-dot')).join(''),
  div,
  ['layered', 'radial'].map((m) => chip('data-layout', m, m === 'layered', '')).join(''),
  div,
  KINDS.map((k) => chip('data-kind', k, true, 'atlas-swatch')).join(''),
  '<span class="atlas-count" id="atlasCount"></span>',
  '<span class="atlas-zoom" id="atlasZoom">100%</span>',
  findHTML(),
  '</div>',
].join('');
const leg = (swatch, attr, value) => {
  return `<span class="atlas-leg"><i class="${swatch}" ${attr}="${value}"></i>${value}</span>`;
};
export const legendHTML = () => [
  '<div class="atlas-legend" aria-label="Legend">',
  '<span class="atlas-leg-label">layers</span>',
  LAYERS.map((l) => leg('atlas-dot', 'data-atlas-dot', l)).join(''),
  div,
  '<span class="atlas-leg-label">edges</span>',
  KINDS.map((k) => leg('atlas-swatch', 'data-atlas-swatch', k)).join(''),
  '</div>',
].join('');
export function bindDock(root, state, apply) {
  const press = (btn, on) => {
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.classList.toggle('on', on);
  };
  const flip = (set, key, btn) => {
    if (set.has(key)) set.delete(key);
    else set.add(key);
    press(btn, set.has(key));
  };
  const setMode = (btn) => {
    state.mode = btn.dataset.layout;
    root.querySelectorAll('.atlas-dock [data-layout]').forEach((b) => press(b, b === btn));
  };
  const onClick = (e) => {
    const btn = e.target.closest('.atlas-dock button');
    if (!btn) return;
    if (btn.dataset.layer) flip(state.on, btn.dataset.layer, btn);
    if (btn.dataset.kind) flip(state.kinds, btn.dataset.kind, btn);
    if (btn.dataset.layout) setMode(btn);
    apply();
  };
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
