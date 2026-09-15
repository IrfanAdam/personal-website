/* ADAM/PAGE — views/masonry/reveal · reveal · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: reveal(), attachLinger() — staggered reveal timing owns the slots
import { attachGridReveal } from './gridReveal.js';
import { fxMs } from '../fx-tokens.js';
import { playFileId } from '../element-sound.js';
import { isMuted } from '../audio-ctx.js';
// — Reel tick — mobile card highlight, throttled —
let lastPull = 0;
function tryPull() {
  if (isMuted()) return;
  try { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch {}
  const n = Date.now(); if (n - lastPull < 380) return;
  lastPull = n;
  try { playFileId('pull.mp3', 0.34); } catch {}
}
export function reveal(grid) {
  const t0 = performance.now();
  const SKELETON_MS = fxMs('--fx-skeleton', 120);
  const STAGGER_MS = fxMs('--fx-stagger', 140);
  const STAGGER_CAP = 8;
  const cards = [...grid.querySelectorAll('.card')];
  const slots = cards.map((_, i) => Math.min(i, STAGGER_CAP) * STAGGER_MS);
  for (let i = slots.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  const offs = cards.map((el, i) => {
    const box = el.querySelector('.img');
    const img = el.querySelector('img');
    const delay = Math.max(0, SKELETON_MS - (performance.now() - t0)) + slots[i];
    return attachGridReveal(box, img, delay, false, slots[i]);
  });
  return () => offs.forEach((fn) => fn());
}
export function attachLinger(grid) {
  const cards = [...grid.querySelectorAll('.card')];
  if (!cards.length) return () => {};
  const isMobile = () => window.innerWidth <= 640;
  if (!isMobile() || !('IntersectionObserver' in window)) {
    if (isMobile()) cards.forEach((c) => c.classList.add('in-view'));
    return () => {};
  }
  const LINGER_IN = 60, LINGER_OUT = 480;
  const showTimers = new Map(), hideTimers = new Map();
  const topEl = document.querySelector('.top');
  const hdr = () => (topEl ? topEl.offsetHeight : 56);
  const buildIO = () => new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const el = e.target;
        const whole = e.isIntersecting && e.intersectionRatio >= 0.8;
        if (whole) {
          if (hideTimers.has(el)) { clearTimeout(hideTimers.get(el)); hideTimers.delete(el); }
          if (el.classList.contains('in-view') || showTimers.has(el)) return;
          const t = setTimeout(() => {
            showTimers.delete(el);
            if (el.isConnected && isMobile()) {
              el.classList.add('in-view');
              tryPull();
            }
          }, LINGER_IN);
          showTimers.set(el, t);
        } else {
          if (showTimers.has(el)) { clearTimeout(showTimers.get(el)); showTimers.delete(el); }
          if (!el.classList.contains('in-view') || hideTimers.has(el)) return;
          const t = setTimeout(() => {
            hideTimers.delete(el);
            el.classList.remove('in-view');
          }, LINGER_OUT);
          hideTimers.set(el, t);
        }
      });
    },
    { rootMargin: `0px 0px -${hdr() + 12}px 0px`, threshold: [0, 0.8, 1] }
  );
  let io = buildIO();
  cards.forEach((c) => io.observe(c));
  const onResize = () => {
    if (!isMobile()) {
      showTimers.forEach((t) => clearTimeout(t));
      hideTimers.forEach((t) => clearTimeout(t));
      showTimers.clear(); hideTimers.clear();
      cards.forEach((c) => c.classList.remove('in-view'));
      io.disconnect();
      window.removeEventListener('resize', onResize);
      return;
    }
    io.disconnect(); io = buildIO();
    cards.forEach((c) => io.observe(c));
  };
  window.addEventListener('resize', onResize);
  return () => {
    showTimers.forEach((t) => clearTimeout(t));
    hideTimers.forEach((t) => clearTimeout(t));
    showTimers.clear(); hideTimers.clear();
    io.disconnect();
    window.removeEventListener('resize', onResize);
    cards.forEach((c) => c.classList.remove('in-view'));
  };
}
