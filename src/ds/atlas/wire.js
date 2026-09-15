/* ADAM/DS — ds/atlas/wire · edge merging + SVG path for layered/arc
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase12] */
// Exports: merged, wire
const RANK = ['tokens', 'styles', 'imports'];
const fx = (v) => v.toFixed(1);
export const merged = (edges) => {
  const map = new Map();
  edges.forEach((e) => {
    const key = `${e.from}>${e.to}`;
    const cur = map.get(key);
    if (!cur) {
      map.set(key, { from: e.from, to: e.to, kinds: new Set([e.kind]) });
    } else cur.kinds.add(e.kind);
  });
  return [...map.values()];
};
export const wire = (e, pos, mode) => {
  const a = pos.get(e.from);
  const b = pos.get(e.to);
  if (!a || !b) return '';
  const kinds = [...e.kinds].sort();
  const kind = RANK.find((k) => kinds.includes(k)) || 'imports';
  const attrs = `data-kind="${kind}" data-from="${e.from}" data-to="${e.to}"`;
  if (mode === 'arc') {
    const mx = fx((a.x + b.x) / 2);
    const lift = 22 + Math.abs(b.x - a.x) * 0.06;
    const my = fx(Math.min(a.y, b.y) - lift);
    const d = `M${fx(a.x)},${fx(a.y)} Q${mx},${my} ${fx(b.x)},${fx(b.y)}`;
    return `<path class="atlas-wire" ${attrs} d="${d}"></path>`;
  }
  const ctrl = fx((a.x + b.x) / 2);
  const d = `M${fx(a.x)},${fx(a.y)} Q${ctrl},${fx(a.y)} ${fx(b.x)},${fx(b.y)}`;
  return `<path class="atlas-wire" ${attrs} d="${d}"></path>`;
};
