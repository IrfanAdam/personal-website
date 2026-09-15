/* ADAM/DS — ds/atlas/dock · floating controls (search left, no legend)
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase12] */
import { KINDS, LAYERS } from './schema.js';
import { findHTML } from './search.js';
// Exports: dockHTML, bindDock
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
  findHTML(),
  div,
  LAYERS.map((l) => chip('data-layer', l, true, 'atlas-dot')).join(''),
  div,
  ['layered', 'radial', 'arc'].map((m) => chip('data-layout', m, m === 'layered', '')).join(''),
  div,
  KINDS.map((k) => chip('data-kind', k, true, 'atlas-swatch')).join(''),
  '<span class="atlas-count" id="atlasCount"></span>',
  '<span class="atlas-zoom" id="atlasZoom">100%</span>',
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
    if (btn.dataset.full) return;
    if (btn.dataset.layer) flip(state.on, btn.dataset.layer, btn);
    if (btn.dataset.kind) flip(state.kinds, btn.dataset.kind, btn);
    if (btn.dataset.layout) setMode(btn);
    apply();
  };
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
