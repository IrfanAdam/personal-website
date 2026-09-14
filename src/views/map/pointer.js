/* ADAM/PAGE — views/map/pointer · hover, zoom, pin + reset wiring
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-8] */
import { resetGroup } from './data.js';
import { clearRoutes } from './route.js';
import { makeGesture } from './drag.js';
import { nodeTipHTML, edgeTipHTML, groupTipHTML } from './popover.js';
// Exports: bindPointer
const HEADER = 32;
const cursorFor = (g, n, edge) => {
  if (g) return 'grab';
  if (n) return 'ns-resize';
  if (edge) return 'pointer';
  return 'grab';
};
export function bindPointer(canvas, map, opts = {}) {
  const { view, sel, live } = map;
  const gesture = makeGesture(map);
  map.canvas = canvas;
  const move = (e) => {
    if (gesture.move(e)) return;
    const p = map.world(e);
    const g = map.hits.group(p);
    const n = g ? null : map.hits.node(p);
    const edge = n ? null : map.hits.edge(p);
    const same = g === live.hoverGroup && n === live.hover && edge === live.hoverEdge;
    if (same) return;
    live.hoverGroup = g;
    live.hover = n;
    live.hoverEdge = edge;
    if (opts.onHover) opts.onHover(n || edge || g);
    canvas.style.cursor = cursorFor(g, n, edge);
    map.draw();
    if (g) map.showTip(groupTipHTML(g), g.x + g.w / 2, g.y + HEADER);
    else if (n) map.showTip(nodeTipHTML(n), n.x + n.w, n.y);
    else if (edge) map.showTip(edgeTipHTML(edge), p.x, p.y);
    else map.hideTip();
  };
  const wheel = (e) => {
    e.preventDefault();
    const r = map.rect();
    map.zoomAt(view.scale * (e.deltaY > 0 ? 0.92 : 1.08), e.clientX - r.left, e.clientY - r.top);
    map.draw();
  };
  const click = (e) => {
    const moved = live.moved;
    live.moved = false;
    const p = map.world(e);
    if (moved || map.hits.group(p)) return;
    const n = map.hits.node(p);
    if (n) {
      sel.node = n;
      sel.edge = null;
      map.showTip(nodeTipHTML(n), n.x + n.w, n.y);
    } else {
      const edge = map.hits.edge(p);
      sel.edge = edge || null;
      sel.node = null;
      if (edge) map.showTip(edgeTipHTML(edge), p.x, p.y);
      else map.hideTip();
    }
    map.draw();
  };
  const dbl = (e) => {
    const g = map.hits.group(map.world(e));
    if (!g) return;
    resetGroup(g);
    clearRoutes();
    map.draw();
  };
  const leave = () => {
    live.hover = null;
    live.hoverEdge = null;
    live.hoverGroup = null;
    if (opts.onHover) opts.onHover(null);
    if (!sel.node && !sel.edge) map.hideTip();
    map.draw();
  };
  const bindings = [
    ['pointermove', move],
    ['pointerdown', gesture.down],
    ['pointerup', gesture.up],
    ['wheel', wheel, { passive: false }],
    ['click', click],
    ['dblclick', dbl],
    ['pointerleave', leave],
  ];
  bindings.forEach(([type, fn, opts]) => canvas.addEventListener(type, fn, opts));
  return () => bindings.forEach(([type, fn]) => canvas.removeEventListener(type, fn));
}
