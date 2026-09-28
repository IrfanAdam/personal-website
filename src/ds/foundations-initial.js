/* ADAM/DS — ds/foundations-initial · Foundations initial pane ·
   [plan:2026-09-28_130000-code-cleanup-perf.md#phase-1] */
// Exports: outerInitial

// — Initial —
export function outerInitial() {
  const h = window.location.hash || '';
  const qs = h.includes('?') ? h.split('?')[1] : (window.location.search.slice(1) || '');
  const sp = new URLSearchParams(qs);
  const p = (sp.get('pane') || '').toLowerCase();
  if (p.includes('sound')) return 6;
  if (p.includes('contract') || p.includes('token')) return 7;
  if (p.includes('motion')) return 4;
  const m = { color: 0, type: 1, space: 2, shape: 3, motion: 4, fx: 5, sound: 6, tokens: 7, contract: 7 };
  if (m[p] != null) return m[p];
  if (p.includes('space')) return 2;
  if (p.includes('token')) return 7;
  return 0;
}
