/* ADAM/PAGE — views/map/data · curated public map data, rows + lookups
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-7] */
import raw from '../../data/arch-map.json';
// Exports: KINDS, EDGE_KINDS, GROUPS, NODES, EDGES, byId, groupOf, layoutGroup, bounds
const HH = 32;
const PY = 4;
const RH = 18;
const RG = 3;
const PX = 4;
export const KINDS = raw.kinds;
export const EDGE_KINDS = raw.edgeKinds;
export const GROUPS = raw.groups.map((g) => ({ ...g, base: { x: g.x, y: g.y } }));
export const NODES = raw.nodes.map((n) => ({ ...n, x: 0, y: 0, w: 0, h: RH }));
export const EDGES = raw.edges.map((e, i) => ({ ...e, lane: ((i % 5) - 2) * 9 }));
const BY = new Map(NODES.map((n) => [n.id, n]));
export const byId = (id) => BY.get(id) || null;
export const groupOf = (node) => GROUPS.find((g) => g.id === node.group) || null;
export const membersOf = (g) => NODES.filter((n) => n.group === g.id);
// — Focus (pin neighbourhood + edge endpoints; also keeps the pinned group lit) —
export function focus(selected, selEdge) {
  const keep = new Set();
  if (selected) {
    keep.add(selected.id);
    keep.add(selected.group);
    EDGES.forEach((e) => {
      if (e.from === selected.id) keep.add(e.to);
      if (e.to === selected.id) keep.add(e.from);
    });
  }
  if (selEdge) {
    keep.add(selEdge.from);
    keep.add(selEdge.to);
  }
  return { active: keep.size > 0, keep };
}
export const dimmed = (f, node) => f.active && !f.keep.has(node.id) && !f.keep.has(node.group);
export const touched = (f, e) => f.active && !f.keep.has(e.from) && !f.keep.has(e.to);
export function reorder(node, wy) {
  const g = GROUPS.find((x) => x.id === node.group);
  if (!g) return;
  const list = membersOf(g).slice().sort((a, b) => a.y - b.y);
  const at = list.indexOf(node);
  let to = Math.floor((wy - g.y - HH - PY + RH / 2) / (RH + RG));
  to = Math.max(0, Math.min(list.length - 1, to));
  if (at < 0 || to === at) return;
  list.splice(at, 1);
  list.splice(to, 0, node);
  list.forEach((n, i) => {
    n.y = g.y + HH + PY + i * (RH + RG);
    n.x = g.x + PX;
  });
}
export function layoutGroup(g) {
  membersOf(g).forEach((n, i) => {
    n.x = g.x + PX;
    n.w = g.w - PX * 2;
    n.y = g.y + HH + PY + i * (RH + RG);
  });
}
GROUPS.forEach(layoutGroup);
export function bounds() {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  GROUPS.forEach((g) => {
    minX = Math.min(minX, g.x);
    minY = Math.min(minY, g.y);
    maxX = Math.max(maxX, g.x + g.w);
    maxY = Math.max(maxY, g.y + g.h);
  });
  return { minX, minY, w: maxX - minX, h: maxY - minY };
}
