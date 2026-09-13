/* ADAM/DS — fx-lab · thin composer · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: mountFx, mountCells, mountShimmer, mountRise — delegates to fx-lab/
export { mountCells } from './fx-lab/cells.js';
export { mountShimmer, mountRise } from './fx-lab/panels.js';
import { mountCells } from './fx-lab/cells.js';
import { mountShimmer, mountRise } from './fx-lab/panels.js';

// — Composer —
export function mountFx(root) {
  const offs = [mountCells(root), mountShimmer(root), mountRise(root)];
  return () => offs.forEach((fn) => fn());
}
