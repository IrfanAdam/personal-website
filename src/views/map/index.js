/* ADAM/PAGE — views/map/index · fullscreen architecture map view + mount
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-8] */
import { getMode, resetAll } from './data.js';
import { createMap } from './canvas.js';
import { bindPointer } from './pointer.js';
import { clearRoutes } from './route.js';
import { resetTokens } from './paint.js';
import { barHTML, stageHTML, paintChrome, bindMode } from './ui.js';
import { bindLegendTips } from './tips.js';
import { makeHoverTick } from './sound.js';
// Exports: MapView, mountMap
export function MapView() {
  return ['<div class="map-view">', barHTML(), stageHTML(), '</div>'].join('');
}
export function mountMap(root) {
  const canvas = root.querySelector('#mapCanvas');
  const tipEl = root.querySelector('#mapTip');
  const reset = root.querySelector('#mapReset');
  const back = root.querySelector('#mapBack');
  resetTokens();
  clearRoutes();
  const map = createMap(canvas, tipEl);
  const unbindPointer = bindPointer(canvas, map, { onHover: makeHoverTick() });
  const unbindTips = bindLegendTips(root, map);
  const refit = () => {
    map.sel.node = null;
    map.sel.edge = null;
    map.live.hover = null;
    map.live.hoverEdge = null;
    map.live.hoverGroup = null;
    map.hideTip();
    clearRoutes();
    map.fit();
    map.draw();
  };
  const onMode = (next) => {
    paintChrome(root, next);
    refit();
  };
  paintChrome(root, getMode());
  const unbindMode = bindMode(root, onMode);
  const onReset = () => {
    resetAll();
    clearRoutes();
    map.fit();
    map.draw();
  };
  const onResize = () => map.resize();
  const onKey = (e) => {
    if (e.key === 'Escape') location.hash = '#/masonry';
  };
  document.body.classList.add('map-open');
  document.addEventListener('keydown', onKey);
  window.addEventListener('resize', onResize);
  reset.addEventListener('click', onReset);
  map.resize();
  back.focus();
  return () => {
    unbindPointer();
    unbindTips();
    unbindMode();
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', onResize);
    reset.removeEventListener('click', onReset);
    document.body.classList.remove('map-open');
  };
}
