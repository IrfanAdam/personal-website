/* ADAM/DS — ds/changelog/drawer-head · mobile two-level head ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-10] */
// Exports: mlevelOf, backLabelOf, drawerHeadHtml, syncDrawerLevels —
// stage IS the level (list = L1 rail, tasks = L2 detail), no new field.
import { isMobile } from './mobile.js';
// — Level —
// [plan:2026-11-02_192021-changelog-parity.md#phase-10]
export const mlevelOf = (stage) => (stage === 'tasks' ? 'l2' : 'l1');
// [plan:2026-11-02_192021-changelog-parity.md#phase-10]
export const backLabelOf = (stage) => (mlevelOf(stage) === 'l2' ? '‹ Phases' : '‹ All plans');
// — Head —
// Desktop keeps the ✕-only head; the back step rides the phone head only.
// [plan:2026-11-02_192021-changelog-parity.md#phase-10]
export const drawerHeadHtml = (stage) => {
  const bits = [];
  if (isMobile()) bits.push(`<button data-mback aria-label="Back">${backLabelOf(stage)}</button>`);
  bits.push('<button data-close aria-label="Close detail">✕</button>');
  return `<div class="ds-drawer-head">${bits.join('')}</div>`;
};
// — Sync —
// data-mlevel and .is-l1/.is-l2 ride together; entering L2 resets the pane.
// [plan:2026-11-02_192021-changelog-parity.md#phase-10]
export const syncDrawerLevels = (root, stage, prev) => {
  const drawer = root.querySelector('[data-drawer]');
  if (!drawer) return;
  const level = mlevelOf(stage);
  drawer.dataset.mlevel = level;
  drawer.classList.toggle('is-l1', level === 'l1');
  drawer.classList.toggle('is-l2', level === 'l2');
  if (!isMobile()) return;
  if (mlevelOf(prev) !== 'l1' || level !== 'l2') return;
  const pane = root.querySelector('[data-col="tasks"]');
  if (pane) pane.scrollTop = 0;
};
