/* ADAM/DS — ds/specimens/copy · copy wiring · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { cssVar } from './color.js';
export const copy = async (v, el) => {
  try { await navigator.clipboard.writeText(v); } catch (_) {}
  if (!el) return; el.style.outline = `var(--space-2) solid var(--color-ink)`;
  setTimeout(() => { el.style.outline = ''; }, 600);
};
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-copy]'); if (t) copy(t.dataset.copy, t);
});
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-copy-token]'); if (t) copy(cssVar(t.dataset.copyToken), t);
});
