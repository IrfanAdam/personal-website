/* ADAM/FX — views/glimmer-color · orb color utils · [plan:2026-09-13_235413-over-limit-splits.md#phase-3] */
// Exports: parseColor, tokenColor — hex/rgb parse + --color-accent resolve
export const parseColor = (s) => {
  s = String(s || '').trim();
  let m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) { let h = m[1]; if (h.length === 3) h = [...h].map((c) => c + c).join(''); const n = parseInt(h,
      16); return [n >> 16 & 255,
      n >> 8 & 255,
      n & 255]; }
  m = s.match(/rgba?\(([^)]+)\)/);
  if (m) { const p = m[1].split(',').map(Number); return [p[0] || 0, p[1] || 0, p[2] || 0]; }
  return [232, 68, 46];
};
export const tokenColor = () => {
  try { const v = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
    if (v) return parseColor(v);
  } catch (_) {}
  return [232, 68, 46];
};
