/* ADAM/DS — ds/atlas/camera · fit, pan, cursor zoom, center + focus dispatch
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-6] */
import { BOX, centerBox, fitBox, position } from './layout.js';
// Exports: scaleOf, fit, centerOn, bind
const MIN_SCALE = 0.15;
const MAX_SCALE = 3.5;
const STEP = 1.12;
const DRAG_SLOP = 6;
const fx = (v) => v.toFixed(1);
const apply = (svg, cam) => svg.setAttribute('viewBox', `${fx(cam.x)} ${fx(cam.y)} ${fx(cam.w)} ${fx(cam.h)}`);
export const scaleOf = (cam) => BOX.w / cam.w;
export function fit(svg, list, mode, cam) {
  const { pos } = position(list, mode);
  const r = svg.getBoundingClientRect();
  const aspect = r.height > 0 ? r.width / r.height : BOX.w / BOX.h;
  Object.assign(cam, fitBox(pos, aspect));
  apply(svg, cam);
}
export function centerOn(svg, cam, list, mode, id) {
  const { pos } = position(list, mode);
  const box = centerBox(pos, id);
  if (!box) return;
  Object.assign(cam, box);
  apply(svg, cam);
}
export function bind(svg, cam, hooks) {
  apply(svg, cam);
  let drag = null;
  let moved = 0;
  let hover = null;
  const rect = () => svg.getBoundingClientRect();
  const nodeAt = (e) => (e.target && e.target.closest ? e.target.closest('[data-node]') : null);
  const world = (e) => {
    const r = rect();
    const x = cam.x + ((e.clientX - r.left) / (r.width || 1)) * cam.w;
    const y = cam.y + ((e.clientY - r.top) / (r.height || 1)) * cam.h;
    return { x, y };
  };
  const down = (e) => {
    drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y };
    moved = 0;
  };
  const move = (e) => {
    if (drag) {
      moved += Math.abs(e.movementX || 0) + Math.abs(e.movementY || 0);
      const r = rect();
      cam.x = drag.cx - (e.clientX - drag.x) * (cam.w / (r.width || 1));
      cam.y = drag.cy - (e.clientY - drag.y) * (cam.h / (r.height || 1));
      apply(svg, cam);
      return;
    }
    const g = nodeAt(e);
    const id = g ? g.getAttribute('data-node') : null;
    if (id === hover) return;
    hover = id;
    hooks.onHover(id, e);
  };
  const up = () => { drag = null; };
  const zoom = (e) => {
    e.preventDefault();
    const p = world(e);
    const f = e.deltaY > 0 ? 1 / STEP : STEP;
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scaleOf(cam) * f));
    const ratio = BOX.w / next / cam.w;
    cam.x = p.x - (p.x - cam.x) * ratio;
    cam.y = p.y - (p.y - cam.y) * ratio;
    cam.w *= ratio;
    cam.h *= ratio;
    apply(svg, cam);
    hooks.onZoom();
  };
  const click = (e) => {
    if (moved > DRAG_SLOP) return;
    const g = nodeAt(e);
    hooks.onPick(g ? g.getAttribute('data-node') : null, e);
  };
  const dbl = (e) => { if (!nodeAt(e)) hooks.onRefit(); };
  const leave = () => {
    hover = null;
    hooks.onHover(null, null);
  };
  svg.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  svg.addEventListener('wheel', zoom, { passive: false });
  svg.addEventListener('click', click);
  svg.addEventListener('dblclick', dbl);
  svg.addEventListener('pointerleave', leave);
  return () => {
    svg.removeEventListener('pointerdown', down);
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    svg.removeEventListener('wheel', zoom);
    svg.removeEventListener('click', click);
    svg.removeEventListener('dblclick', dbl);
    svg.removeEventListener('pointerleave', leave);
  };
}
