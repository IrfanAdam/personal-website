/* ADAM/PAGE — views/map/geom · row metrics + row/box layout maths (both modes)
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-8] */
// Exports: HH, PY, RH, RG, PX, groupH, layoutGroup, reorder, boundsOf
export const HH = 32;
export const PY = 4;
export const RH = 18;
export const RG = 3;
export const PX = 4;
const FOOT = 8;
export const groupH = (n) => HH + PY + n * (RH + RG) + FOOT;
export function layoutGroup(g, members) {
  members.forEach((n, i) => {
    n.x = g.x + PX;
    n.w = g.w - PX * 2;
    n.y = g.y + HH + PY + i * (RH + RG);
  });
}
export function reorder(node, wy, g, members) {
  const list = members.slice().sort((a, b) => a.y - b.y);
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
export function boundsOf(groups) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  groups.forEach((g) => {
    minX = Math.min(minX, g.x);
    minY = Math.min(minY, g.y);
    maxX = Math.max(maxX, g.x + g.w);
    maxY = Math.max(maxY, g.y + g.h);
  });
  return { minX, minY, w: maxX - minX, h: maxY - minY };
}
