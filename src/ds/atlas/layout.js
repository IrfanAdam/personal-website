/* ADAM/DS — ds/atlas/layout · layered columns + radial + fit + center, pure fns
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-6] */
// Exports: BOX, COLX, colLabel, position, centerBox, fitBox
export const BOX = { w: 960, h: 780 };
export const COLX = { function: 160, component: 480, foundation: 800 };
const STEP_MAX = 24;
const LABEL_MIN = 15;
const PAD = 48;
const RING = 300;
const count = (list) => list.reduce((m, n) => {
  m[n.layer] = (m[n.layer] || 0) + 1;
  return m;
}, {});
const steps = (list) => {
  const total = count(list);
  return (layer) => Math.min(STEP_MAX, (BOX.h - 72) / Math.max(1, total[layer]));
};
export const colLabel = (layer) => `${layer[0].toUpperCase()}${layer.slice(1)}`;
export function layered(list) {
  const step = steps(list);
  const seen = {};
  const dense = new Set();
  const pos = new Map(list.map((n) => {
    seen[n.layer] = (seen[n.layer] || 0) + 1;
    if (step(n.layer) < LABEL_MIN) dense.add(n.id);
    return [n.id, { x: COLX[n.layer] || 480, y: 44 + seen[n.layer] * step(n.layer) }];
  }));
  return { pos, dense };
}
export function radial(list) {
  const cx = BOX.w / 2;
  const cy = BOX.h / 2;
  const gap = (2 * Math.PI * RING) / Math.max(1, list.length);
  const dense = new Set(gap < LABEL_MIN ? list.map((n) => n.id) : []);
  const pos = new Map(list.map((n, i) => {
    const a = (2 * Math.PI * i) / Math.max(1, list.length);
    return [n.id, { x: cx + RING * Math.cos(a), y: cy + RING * Math.sin(a) }];
  }));
  return { pos, dense };
}
export const position = (list, mode) => (mode === 'radial' ? radial(list) : layered(list));
export const centerBox = (pos, id, zoom = 1.6) => {
  const p = pos.get(id);
  if (!p) return null;
  const w = BOX.w / zoom;
  const h = BOX.h / zoom;
  return { x: p.x - w / 2, y: p.y - h / 2, w, h };
};
function bounds(pos) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  pos.forEach((p) => {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  });
  if (!isFinite(minX)) return { minX: 0, minY: 0, maxX: BOX.w, maxY: BOX.h };
  return { minX, minY, maxX, maxY };
}
export function fitBox(pos, aspect, pad = PAD) {
  const b = bounds(pos);
  let w = (b.maxX - b.minX) + pad * 2;
  let h = (b.maxY - b.minY) + pad * 2;
  if (w / h < aspect) w = h * aspect;
  else h = w / aspect;
  const cx = (b.minX + b.maxX) / 2;
  const cy = (b.minY + b.maxY) / 2;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}
