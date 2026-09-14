/* ADAM/PAGE — views/map/chunk · dataset builders: functions families + ia lanes
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-8] */
import raw from '../../data/arch-map.json';
import { RH, groupH, layoutGroup } from './geom.js';
// Exports: withLanes, rollupEdges, laneGroups, dataset
const LANE = { x0: 120, y0: 80, w: 280, gapX: 96, gapY: 84, perRow: 4 };
const laneRows = (groups) => {
  let y = LANE.y0;
  for (let i = 0; i < groups.length; i += LANE.perRow) {
    const row = groups.slice(i, i + LANE.perRow);
    row.forEach((g, c) => {
      g.x = LANE.x0 + c * (LANE.w + LANE.gapX);
      g.y = y;
      g.w = LANE.w;
      g.h = groupH(g.members.length);
    });
    y += Math.max(...row.map((g) => g.h)) + LANE.gapY;
  }
};
export const withLanes = (list) => list.map((e, i) => ({ ...e, lane: ((i % 5) - 2) * 9 }));
export const laneGroups = (nodes) => {
  const groups = raw.ia.groups.map((g) => ({ ...g }));
  const at = new Map();
  groups.forEach((g) => g.members.forEach((id) => at.set(id, g.id)));
  nodes.forEach((n) => { n.group = at.get(n.id) || n.group; });
  laneRows(groups);
  groups.forEach((g) => { delete g.members; });
  return groups;
};
export function rollupEdges(nodes, links) {
  const at = new Map(nodes.map((n) => [n.id, n.group]));
  const seen = new Map();
  links.forEach((e) => {
    const a = at.get(e.from);
    const b = at.get(e.to);
    if (!a || !b || a === b) return;
    const k = `${a}|${b}|${e.kind}`;
    const prev = seen.get(k);
    if (prev) prev.n += 1;
    else seen.set(k, { from: a, to: b, kind: e.kind, n: 1 });
  });
  return [...seen.values()].map((e) => {
    const plural = e.n === 1 ? e.kind : `${e.kind}s`;
    return { from: e.from, to: e.to, kind: e.kind, label: `${e.n} ${plural}` };
  });
}
export function dataset(mode) {
  const nodes = raw.nodes.map((n) => ({ ...n, x: 0, y: 0, w: 0, h: RH }));
  const groups = mode === 'ia' ? laneGroups(nodes) : raw.groups.map((g) => ({ ...g }));
  groups.forEach((g) => {
    g.base = { x: g.x, y: g.y };
    layoutGroup(g, nodes.filter((n) => n.group === g.id));
  });
  const links = mode === 'ia' ? rollupEdges(nodes, raw.edges) : raw.edges;
  return { nodes, groups, edges: withLanes(links) };
}
