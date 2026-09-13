/* ADAM/DS — ds/specimens/color · color math + probe · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
export const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
/* — Live contrast (single home for Foundations + Patterns matrices) — */
export const toRGB = (s) => { s = String(s).trim();
  let m = s
    .match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) { let h = m[1];
    if (h.length === 3) h = [...h]
      .map((c) => c + c)
      .join('');
    const n = parseInt(h, 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  } m = s
    .match(/rgba?\(([^)]+)\)/);
  if (m) { const p = m[1].split(',').map(Number);
    return [p[0] || 0, p[1] || 0, p[2] || 0];
  } return [128,
    128,
    128]; };
const lumOf = (c) => {
  const a = c
    .map((v) => {
    v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};
export const contrastRatio = (a,
  b) => { const L1 = lumOf(toRGB(a)),
  L2 = lumOf(toRGB(b)); return ((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2); };
export const verdictRatio = (r) => { const n = Number(r);
  if (n >= 7) return 'AAA';
  if (n >= 4.5) return 'AA';
  if (n >= 3) return 'AA large';
  return 'Fail';
};
/* Read live token values as a theme probe: flips [data-theme] synchronously
   (no paint between set + restore, so no flash), resolves var() chains via
   getComputedStyle, then restores the user's theme. */
export const probeTheme = (theme, fn) => {
  const el = document.documentElement, had = el.getAttribute('data-theme');
  el.setAttribute('data-theme', theme);
  let out; try { out = fn(); } finally { had === null ? el.removeAttribute('data-theme') : el.setAttribute('data-theme',
      had); }
  return out;
};
