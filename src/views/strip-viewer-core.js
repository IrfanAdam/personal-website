/* ADAM/SHARED — views/strip-viewer-core · viewer core · [plan:2026-09-22_141500-housekeeping-refactor.md#{#phase-2}] */
// Exports: makeViewerCore
import { fxNum, fxMs } from './fx-tokens.js';
import { makeStripEl, createFollower } from './strip-viewer-helpers.js';

export function makeViewerCore() {
  const VW = fxNum('--size-viewer-w', 180);
  const GAP = fxNum('--space-8', 8) * 0.1;
  const PAD = fxNum('--space-12', 12);
  const HIDE = fxMs('--fx-viewer-debounce', 70);
  const SWAP = fxMs('--dur-viewer-swap', 110);
  const el = makeStripEl();
  const img = el.querySelector('img');
  const fol = createFollower(el);
  const VH = 240;
  return { VW, GAP, PAD, HIDE, SWAP, el, img, fol, VH };
}
