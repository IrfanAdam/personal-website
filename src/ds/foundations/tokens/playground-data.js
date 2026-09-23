/* ADAM/DS — tokens playground data · [plan:2026-09-23_130000-ds-understandable-mutable.md#phase-2] */
// Exports: KEY, TOKS, hexOf, load, save
export const KEY = 'ds-tokens-override';
export const TOKS = [
  { k: '--color-accent', label: 'Accent', type: 'color', def: '' },
  { k: '--color-bg', label: 'Bg', type: 'color', def: '' },
  { k: '--color-ink', label: 'Ink', type: 'color', def: '' },
  { k: '--space-14', label: 'Rhythm', type: 'range', min: 8, max: 24, step: 1, unit: 'px' },
  { k: '--space-16', label: 'Gutter', type: 'range', min: 8, max: 32, step: 1, unit: 'px' },
  { k: '--text-body', label: 'Body', type: 'range', min: 12, max: 18, step: 0.5, unit: 'px' },
];
export function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } }
export function save(m) { localStorage.setItem(KEY, JSON.stringify(m)); }
export function hexOf(v) {
  if (!v || v.startsWith('#')) return v || '#000000';
  const m = v.trim().match(/^rgba?\(([^)]+)\)/);
  if (!m) return '#000000';
  const p = m[1].split(',').map(Number);
  return '#' + p.slice(0, 3).map((n) => Math.round(n).toString(16).padStart(2, '0')).join('');
}
