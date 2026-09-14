/* ADAM/DS — ds/atlas/layout · layered columns + radial, pure fns
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-3] */
// Exports: BOX, COLX, layered, radial, position, colLabel
export const BOX = { w: 960, h: 780 };
export const COLX = { function: 160, component: 480, foundation: 800 };
export function layered(list) {
  const counts = {};
  list.forEach((n) => { counts[n.layer] = (counts[n.layer] || 0) + 1; });
  const seen = {};
  return new Map(list.map((n) => {
    seen[n.layer] = (seen[n.layer] || 0) + 1;
    const step = Math.min(24, (BOX.h - 72) / Math.max(1, counts[n.layer]));
    return [n.id, { x: COLX[n.layer] || 480, y: 44 + seen[n.layer] * step }];
  }));
}
export function radial(list) {
  const cx = BOX.w / 2;
  const cy = BOX.h / 2;
  const r = 300;
  return new Map(list.map((n, i) => {
    const a = (2 * Math.PI * i) / Math.max(1, list.length);
    return [n.id, { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }];
  }));
}
export const position = (list, mode) => (mode === 'radial' ? radial(list) : layered(list));
export const colLabel = (layer) => `${layer[0].toUpperCase()}${layer.slice(1)}`;
