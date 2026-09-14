/* ADAM/DS — ds/pages-atlas · atlas route shell + interaction wiring
   [plan:2026-09-14_192124-atlas-fullscreen.md#phase-1] */
import { LAYERS, KINDS, visible, edgesVisible } from './atlas/schema.js';
import { BOX } from './atlas/layout.js';
import { bind } from './atlas/camera.js';
import { bindDock } from './atlas/dock.js';
import { makeTip } from './atlas/tooltip.js';
import { shellHTML } from './atlas/shell.js';
import { makeView } from './atlas/view.js';
import { makeInsight } from './atlas/insight.js';
import { makeActions } from './atlas/actions.js';
import { makeFullscreen } from './atlas/fullscreen.js';
// Exports: title, render, mount
export const title = 'Atlas';
export const render = shellHTML;
export function mount(root) {
  const svg = root.querySelector('#atlasSvg');
  const tipEl = root.querySelector('#atlasTip');
  const tip = makeTip(tipEl, root.querySelector('#atlasStage'));
  const state = { on: new Set(LAYERS), kinds: new Set(KINDS), mode: 'layered', sel: null, hover: null };
  const ins = makeInsight();
  const cam = { x: 0, y: 0, w: BOX.w, h: BOX.h };
  const graph = () => {
    const list = visible(state.on);
    return { list, edges: edgesVisible(new Set(list.map((n) => n.id)), state.kinds) };
  };
  const view = makeView({
    svg,
    cam,
    state,
    ins,
    graph,
    zoomEl: root.querySelector('#atlasZoom'),
    countEl: root.querySelector('#atlasCount'),
  });
  const act = makeActions({ root, svg, cam, state, ins, tip, view, graph });
  const onResize = () => {
    if (!tip.isPinned()) view.refit();
  };
  const full = makeFullscreen(root, onResize);
  const unbindDock = bindDock(root, state, act.apply);
  const unbindSvg = bind(svg, cam, {
    onHover: act.onHover,
    onPick: act.onPick,
    onRefit: view.refit,
    onZoom: view.readout,
  });
  tipEl.addEventListener('click', act.onTipClick);
  document.addEventListener('keydown', act.onKey);
  window.addEventListener('resize', onResize);
  view.draw();
  view.refit();
  return () => {
    full.unbind();
    unbindDock();
    unbindSvg();
    act.find.unbind();
    tipEl.removeEventListener('click', act.onTipClick);
    document.removeEventListener('keydown', act.onKey);
    window.removeEventListener('resize', onResize);
  };
}
