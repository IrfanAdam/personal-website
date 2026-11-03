/* ADAM/DS — ds/changelog/drawer-head · phone two-level heads ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-10] */
// Exports: mlevelOf, backLabelOf, drawerHeadHtml, railHeadHtml, syncDrawerLevels
// stage IS the level (list = L1 rail, tasks = L2 detail), no new field.
import { esc } from './esc.js';
import { isMobile } from './mobile.js';
// — Level —
// [plan:2026-11-02_192021-changelog-parity.md#phase-10]
export const mlevelOf = (stage) => (stage === 'tasks' ? 'l2' : 'l1');
// [plan:2026-11-02_192021-changelog-parity.md#phase-10]
export const backLabelOf = (stage) => (mlevelOf(stage) === 'l2' ? '‹ Phases' : '‹ All plans');
// — Heads —
// Every head ships both controls on every viewport; CSS shows the one the
// level needs, so a resize can never strand a drawer with no way back.
// [plan:2026-11-02_192021-changelog-parity.md#phase-10]
export const drawerHeadHtml = (stage) => [
  `<div class="ds-drawer-head">`,
  `<button class="ds-mback" data-mback aria-label="Back">${backLabelOf(stage)}</button>`,
  `<button data-close aria-label="Close detail">✕</button>`,
  `</div>`,
].join('');
// [plan:2026-11-02_192021-changelog-parity.md#phase-10]
export const railHeadHtml = (plan, seq) => [
  `<div class="ds-rail-head">`,
  `<button class="ds-mback" data-mback aria-label="Back to plans">‹ All plans</button>`,
  `<span class="ds-rail-num">${esc(plan.id || seq)}</span>`,
  `<span class="ds-rail-title">${esc(String(plan.title || '').toUpperCase())}</span>`,
  `</div>`,
].join('');
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
