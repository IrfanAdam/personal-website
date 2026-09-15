/* ADAM/FX — views/rise-sound · grid reveal sync helper ·
   [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
// Exports: syncPull — plays window-open in sync with hero mosaic
import { playFileId } from './element-sound.js';
import { isMuted } from './audio-ctx.js';
export function syncPull(delay = 80) {
  if (isMuted()) return;
  try { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch {}
  const go = () => { try { playFileId('window-open.mp3', 0.12); } catch {} };
  if (delay > 0) setTimeout(go, delay);
  else go();
}
