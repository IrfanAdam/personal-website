/* ADAM/DS — fx-lab/color · palette helpers · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: toRGB, css, tok, rgb, mix3, reduced, SAMPLE
import { mix } from '../../views/masonry/cells.js';
import { cssVar } from '../specimens.js';

export const toRGB = (s) => {
  s = String(s).trim();
  let m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = [...h].map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(',').map(Number);
    return [p[0] || 0, p[1] || 0, p[2] || 0];
  }
  return [128, 128, 128];
};

export const css = (n, fb) => {
  try {
    const v = cssVar(n);
    if (v) return toRGB(v);
  } catch {}
  return fb;
};

export const tok = (n, val) => {
  try { document.documentElement.style.setProperty(n, val); } catch {}
};

export const rgb = (c) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
export const mix3 = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const SAMPLE = 64;
