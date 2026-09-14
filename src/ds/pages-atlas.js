/* ADAM/DS — ds/pages-atlas · atlas route shell · [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-5] */
import { LAYERS, KINDS, visible, lookup, edgesVisible } from './atlas/schema.js';
import { BOX } from './atlas/layout.js';
import { paint, emphasis } from './atlas/canvas.js';
import { bind, fit, scaleOf } from './atlas/camera.js';
import { dockHTML, legendHTML, bindDock } from './atlas/dock.js';
import { makeTip } from './atlas/tooltip.js';
// Exports: title, render, mount
export const title = 'Atlas';
export function render() {
  return [
    '<p class="ds-crumb">Start · atlas</p><div class="ds-hero"><h1>Architecture atlas.</h1>',
    '<p class="lede">Functions, components, and foundations on one canvas — live from ',
    '<span class="tok">arch-schema.json</span>. Drag to pan, wheel to zoom, hover to trail, click to pin.</p></div>',
    '<div class="ds-sec"><div class="atlas-stage" id="atlasStage">',
    '<svg id="atlasSvg" class="atlas-canvas" role="img" aria-label="Architecture graph"></svg>',
    dockHTML(),
    legendHTML(),
    '<div class="atlas-tip" id="atlasTip" hidden></div>',
    '</div></div>',
  ].join('');
}
export function mount(root) {
  const svg = root.querySelector('#atlasSvg');
  const tip = makeTip(root.querySelector('#atlasTip'), root.querySelector('#atlasStage'));
  const zoomEl = root.querySelector('#atlasZoom');
  const countEl = root.querySelector('#atlasCount');
  const state = { on: new Set(LAYERS), kinds: new Set(KINDS), mode: 'layered', sel: null, hover: null };
  const cam = { x: 0, y: 0, w: BOX.w, h: BOX.h };
  const graph = () => {
    const list = visible(state.on);
    return { list, edges: edgesVisible(new Set(list.map((n) => n.id)), state.kinds) };
  };
  const readout = () => {
    const { list, edges } = graph();
    zoomEl.textContent = `${Math.round(scaleOf(cam) * 100)}%`;
    countEl.textContent = `${list.length} nodes · ${edges.length} edges`;
  };
  const draw = () => {
    const { list, edges } = graph();
    paint(svg, list, { mode: state.mode, sel: state.sel, edges });
    emphasis(svg, state.hover || state.sel, state.sel, edges);
    readout();
  };
  const refit = () => {
    fit(svg, graph().list, state.mode, cam);
    readout();
  };
  const clearSel = () => {
    state.sel = null;
    tip.unpin();
    draw();
  };
  const onHover = (id, ev) => {
    state.hover = id;
    emphasis(svg, id || state.sel, state.sel, graph().edges);
    if (id && ev) tip.follow(lookup(id), ev.clientX, ev.clientY);
    else if (!id) tip.hide();
  };
  const onPick = (id, ev) => {
    if (!id) {
      clearSel();
      return;
    }
    state.sel = id;
    emphasis(svg, id, id, graph().edges);
    tip.pin(lookup(id), ev.clientX, ev.clientY);
  };
  const apply = () => {
    state.sel = null;
    state.hover = null;
    tip.unpin();
    draw();
    refit();
  };
  const onKey = (e) => { if (e.key === 'Escape' && state.sel) clearSel(); };
  const onResize = () => { if (!tip.isPinned()) refit(); };
  const unbindDock = bindDock(root, state, apply);
  const unbindSvg = bind(svg, cam, { onHover, onPick, onRefit: refit, onZoom: readout });
  document.addEventListener('keydown', onKey);
  window.addEventListener('resize', onResize);
  draw();
  refit();
  return () => {
    unbindDock();
    unbindSvg();
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', onResize);
  };
}
