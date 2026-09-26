/* ADAM/SOUND — views/masonry/reel-tick · interruptible zing · [plan:2026-09-21_125642-lump-sum-builds.md#phase-8] */
// Exports: reelTick() — shutter: kill previous before firing next
//          desktopZing() / attachDesktopZing() — hover variant for >640
import { isMuted, scaledGain } from '../audio-ctx.js';
import { scrollState } from './parallax-chase.js';

let last = 0;
let active = null;

function canZing(el) {
  if (isMuted()) return false;
  if (scrollState.active) return false;
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  } catch {}
  if (el && !el.classList.contains('ready')) return false;
  const grid = document.getElementById('grid');
  if (!grid) return false;
  const ready = grid.querySelectorAll('.card.ready').length;
  const total = grid.querySelectorAll('.card').length;
  if (ready < Math.min(6, total)) return false;
  const now = Date.now();
  if (now - last < 45) return false;
  last = now;
  return true;
}

function playZing() {
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

export function reelTick(el) {
  if (window.innerWidth > 640) return;
  if (!canZing(el)) return;
  playZing();
}

export function desktopZing(el) {
  if (window.innerWidth <= 640) return;
  try {
    if (!matchMedia('(hover: hover)').matches) return;
  } catch {}
  if (!canZing(el)) return;
  playZing();
}

export function attachDesktopZing(grid) {
  const cards = [...grid.querySelectorAll('.card')];
  if (!cards.length) return () => {};
  if (window.innerWidth <= 640) return () => {};
  try {
    if (!matchMedia('(hover: hover)').matches) return () => {};
  } catch {}
  const onEnter = (e) => {
    const c = e.currentTarget;
    desktopZing(c);
  };
  cards.forEach((c) => c.addEventListener('mouseenter', onEnter, { passive: true }));
  return () => {
    cards.forEach((c) => c.removeEventListener('mouseenter', onEnter));
  };
}
