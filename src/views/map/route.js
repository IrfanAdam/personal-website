/* ADAM/PAGE — views/map/route · orthogonal edge routing through lane gutters
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-7] */
// Exports: clearRoutes, routePath
const STUB = 14;
const cache = new Map();
export const clearRoutes = () => cache.clear();
const cx = (n) => n.x + n.w / 2;
const cy = (n) => n.y + n.h / 2;
const flat = (pts) => {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i += 1) {
    const last = out[out.length - 1];
    const p = pts[i];
    if (Math.abs(p.x - last.x) > 0.5 || Math.abs(p.y - last.y) > 0.5) out.push(p);
  }
  const kept = [out[0]];
  for (let i = 1; i < out.length - 1; i += 1) {
    const a = kept[kept.length - 1];
    const b = out[i];
    const c = out[i + 1];
    const sameX = Math.abs(a.x - b.x) < 0.5 && Math.abs(b.x - c.x) < 0.5;
    const sameY = Math.abs(a.y - b.y) < 0.5 && Math.abs(b.y - c.y) < 0.5;
    if (!sameX && !sameY) kept.push(b);
  }
  kept.push(out[out.length - 1]);
  return kept;
};
function horizontal(a, b, lane) {
  const dir = cx(b) - cx(a) >= 0 ? 1 : -1;
  const from = { x: dir > 0 ? a.x + a.w : a.x, y: cy(a) };
  const to = { x: dir > 0 ? b.x : b.x + b.w, y: cy(b) };
  const s0 = { x: from.x + dir * STUB, y: from.y };
  const s1 = { x: to.x - dir * STUB, y: to.y };
  const gx = (s0.x + s1.x) / 2 + lane;
  return [from, s0, { x: gx, y: s0.y }, { x: gx, y: s1.y }, s1, to];
}
function vertical(a, b, lane) {
  const dir = cy(b) - cy(a) >= 0 ? 1 : -1;
  const from = { x: cx(a), y: dir > 0 ? a.y + a.h : a.y };
  const to = { x: cx(b), y: dir > 0 ? b.y : b.y + b.h };
  const s0 = { x: from.x, y: from.y + dir * STUB };
  const s1 = { x: to.x, y: to.y - dir * STUB };
  const gy = (s0.y + s1.y) / 2 + lane;
  return [from, s0, { x: s0.x, y: gy }, { x: s1.x, y: gy }, s1, to];
}
export function routePath(a, b, lane = 0) {
  const key = `${a.id}>${b.id}|${Math.round(a.x)},${Math.round(a.y)},${Math.round(b.x)},${Math.round(b.y)}` +
    `|${Math.round(a.w)}|${lane}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const dx = Math.abs(cx(b) - cx(a));
  const dy = Math.abs(cy(b) - cy(a));
  const raw = dx >= dy ? horizontal(a, b, lane) : vertical(a, b, lane);
  const path = flat(raw);
  const end = path[path.length - 1];
  const prev = path[path.length - 2] || end;
  const res = { path, mid: path[Math.floor(path.length / 2)], ang: Math.atan2(end.y - prev.y, end.x - prev.x) };
  cache.set(key, res);
  return res;
}
