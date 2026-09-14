/* ADAM/PAGE — views/map/canvas · engine: camera, tooltip, draw loop, hit wiring
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-7] */
import { bounds, focus } from './data.js';
import { makeHits } from './hits.js';
import { drawGrid, drawGroups, drawRows } from './render.js';
import { drawWires } from './wires.js';
// Exports: createMap
const MIN = 0.28;
const MAX = 3.2;
const GAP = 12;
export function createMap(canvas, tipEl) {
  const ctx = canvas.getContext('2d');
  const view = { W: 0, H: 0, scale: 1, ox: 0, oy: 0 };
  const sel = { node: null, edge: null };
  const live = { hover: null, hoverEdge: null, hoverGroup: null, drag: null, dragNode: null, pan: null, moved: false };
  const hits = makeHits(view);
  let frame = 0;
  let fitted = false;
  const rect = () => canvas.getBoundingClientRect();
  const toScreen = (x, y) => ({ x: x * view.scale + view.ox, y: y * view.scale + view.oy });
  const world = (e) => {
    const r = rect();
    return { x: (e.clientX - r.left - view.ox) / view.scale, y: (e.clientY - r.top - view.oy) / view.scale };
  };
  const zoomAt = (next, mx, my) => {
    const k = Math.min(MAX, Math.max(MIN, next));
    view.ox = mx - (mx - view.ox) * (k / view.scale);
    view.oy = my - (my - view.oy) * (k / view.scale);
    view.scale = k;
  };
  const fit = () => {
    const b = bounds();
    const s = Math.min(1.1, (view.W - 96) / b.w, (view.H - 96) / b.h);
    view.scale = Math.max(MIN, s);
    view.ox = (view.W - b.w * view.scale) / 2 - b.minX * view.scale;
    view.oy = (view.H - b.h * view.scale) / 2 - b.minY * view.scale;
  };
  const paint = () => {
    const f = focus(sel.node, sel.edge);
    ctx.clearRect(0, 0, view.W, view.H);
    ctx.save();
    ctx.translate(view.ox, view.oy);
    ctx.scale(view.scale, view.scale);
    drawGrid(ctx, view);
    drawGroups(ctx, view, f, live.hoverGroup);
    drawWires(ctx, view, f, live.hover, sel.node, live.hoverEdge, sel.edge);
    drawRows(ctx, view, f);
    ctx.restore();
  };
  const draw = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      paint();
    });
  };
  const resize = () => {
    const box = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    view.W = box.width;
    view.H = box.height;
    canvas.width = Math.round(view.W * dpr);
    canvas.height = Math.round(view.H * dpr);
    canvas.style.width = `${view.W}px`;
    canvas.style.height = `${view.H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!fitted && view.W > 0) {
      fitted = true;
      fit();
    }
    paint();
  };
  const showTip = (html, wx, wy) => {
    tipEl.hidden = false;
    tipEl.innerHTML = html;
    const s = toScreen(wx, wy);
    let x = s.x + GAP;
    let y = s.y + GAP;
    if (x + tipEl.offsetWidth > view.W - GAP) x = s.x - tipEl.offsetWidth - GAP;
    if (y + tipEl.offsetHeight > view.H - GAP) y = s.y - tipEl.offsetHeight - GAP;
    tipEl.style.left = `${Math.max(GAP, x)}px`;
    tipEl.style.top = `${Math.max(GAP, y)}px`;
  };
  const hideTip = () => {
    tipEl.hidden = true;
  };
  return {
    ctx, view, sel, live, hits, rect, world, toScreen,
    zoomAt, fit, draw, paint, resize, showTip, hideTip,
  };
}
