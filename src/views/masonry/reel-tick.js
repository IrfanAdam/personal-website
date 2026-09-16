/* ADAM/SOUND — views/masonry/reel-tick · interruptible zing · [plan:2026-09-15_183400-lump-sum-builds.md#phase-4] */
// Exports: reelTick() — shutter: kill previous before firing next
import { isMuted, scaledGain } from '../audio-ctx.js';

let last = 0;
let active = null;

export function reelTick() {
  if (isMuted()) return;
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  } catch {}
  if (window.innerWidth > 640) return;
  const grid = document.getElementById('grid');
  if (!grid) return;
  const ready = grid.querySelectorAll('.card.ready').length;
  const total = grid.querySelectorAll('.card').length;
  if (ready < Math.min(6, total)) return;
  const now = Date.now();
  if (now - last < 45) return;
  last = now;
  if (active) {
    try {
      active.onended = null;
      active.onerror = null;
      active.pause();
      active.currentTime = 0;
    } catch {}
    active = null;
  }
  try {
    const a = new Audio('/sounds/zing.mp3');
    a.volume = scaledGain(0.2);
    a.onended = () => {
      if (active === a) active = null;
    };
    a.onerror = () => {
      if (active === a) active = null;
    };
    active = a;
    const p = a.play();
    if (p && p.catch) p.catch(() => {
      if (active === a) active = null;
    });
  } catch {}
}
