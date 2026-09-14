/* ADAM/PAGE — views/map/drag · gesture lifecycle: group drag, row reorder, pan
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-7] */
import { layoutGroup, reorder } from './data.js';
import { clearRoutes } from './route.js';
// Exports: makeGesture
const SLOP = 5;
export function makeGesture(map) {
  const { view, sel, live } = map;
  const hold = (e, on) => {
    try {
      if (on) map.canvas.setPointerCapture(e.pointerId);
      else map.canvas.releasePointerCapture(e.pointerId);
    } catch {
      /* capture unavailable */
    }
  };
  const move = (e) => {
    const p = map.world(e);
    if (live.drag) {
      live.moved = true;
      const g = live.drag.g;
      g.x = live.drag.gx + (p.x - live.drag.px);
      g.y = live.drag.gy + (p.y - live.drag.py);
      layoutGroup(g);
      clearRoutes();
      map.draw();
      return true;
    }
    if (live.dragNode) {
      live.moved = true;
      reorder(live.dragNode, p.y);
      map.draw();
      return true;
    }
    if (live.pan) {
      if (Math.hypot(e.clientX - live.pan.sx, e.clientY - live.pan.sy) > SLOP) live.moved = true;
      view.ox = e.clientX - live.pan.sx0;
      view.oy = e.clientY - live.pan.sy0;
      map.draw();
      return true;
    }
    return false;
  };
  const down = (e) => {
    const p = map.world(e);
    live.moved = false;
    const g = map.hits.group(p);
    if (g) {
      sel.node = null;
      sel.edge = null;
      live.drag = { g, gx: g.x, gy: g.y, px: p.x, py: p.y };
      hold(e, true);
      map.draw();
      return;
    }
    const n = map.hits.node(p);
    if (n) {
      sel.node = n;
      sel.edge = null;
      live.dragNode = n;
      live.hover = n;
      live.hoverGroup = null;
      hold(e, true);
      map.draw();
      return;
    }
    live.pan = { sx: e.clientX, sy: e.clientY, sx0: e.clientX - view.ox, sy0: e.clientY - view.oy };
    hold(e, true);
  };
  const up = (e) => {
    const draggedGroup = live.drag && Math.hypot(live.drag.g.x - live.drag.gx, live.drag.g.y - live.drag.gy) > 2;
    live.drag = null;
    live.dragNode = null;
    live.pan = null;
    if (draggedGroup) clearRoutes();
    hold(e, false);
    map.draw();
  };
  return { move, down, up };
}
