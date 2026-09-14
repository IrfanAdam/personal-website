/* ADAM/PAGE — views/map/hits · hit tests for rows, group headers and wires
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-7] */
import { GROUPS, NODES, EDGES, byId } from './data.js';
import { routePath } from './route.js';
// Exports: makeHits
const HEADER = 32;
const SLACK = 3;
export function makeHits(view) {
  const node = (p) => {
    for (let i = NODES.length - 1; i >= 0; i -= 1) {
      const n = NODES[i];
      const inside = p.x >= n.x - SLACK && p.x <= n.x + n.w + SLACK;
      const rows = p.y >= n.y - SLACK && p.y <= n.y + n.h + SLACK;
      if (inside && rows) return n;
    }
    return null;
  };
  const group = (p) => {
    for (let i = GROUPS.length - 1; i >= 0; i -= 1) {
      const g = GROUPS[i];
      const inX = p.x >= g.x && p.x <= g.x + g.w;
      const inHeader = p.y >= g.y && p.y <= g.y + HEADER;
      if (inX && inHeader) return g;
    }
    return null;
  };
  const segDist = (p, a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = dx * dx + dy * dy;
    let t = len ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / len : 0;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
  };
  const edge = (p) => {
    const tol = Math.max(6 / view.scale, 2);
    let best = null;
    let closest = tol;
    EDGES.forEach((e) => {
      const a = byId(e.from);
      const b = byId(e.to);
      if (!a || !b) return;
      const pts = routePath(a, b, e.lane).path;
      for (let i = 0; i < pts.length - 1; i += 1) {
        const d = segDist(p, pts[i], pts[i + 1]);
        if (d < closest) {
          closest = d;
          best = e;
        }
      }
    });
    return best;
  };
  return { node, group, edge };
}
