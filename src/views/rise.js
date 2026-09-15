/* ADAM/FX — views/rise · scroll rise effect · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
/* Shared mobile hero rise — placeholder height → final aspect height on
   --dur-hero-rise / --ease-signature, then cell-grid reveal. Reduced-motion
   and desktop pass straight through to the reveal. (5.2 dedup: project.js +
   contact.js ran this morph inline and duplicated.) */
import { attachGridReveal } from './masonry/gridReveal.js';
import { fxMs, fxVar } from './fx-tokens.js';
import { hasHeroSeen, markHeroSeen, heroKey } from './hero-height-cache.js';

function skipRise(box, img, finalH) {
  box.style.aspectRatio = 'var(--hero-aspect)';
  box.style.height = '';
  box.style.transition = '';
  box.style.willChange = '';
  box.classList.remove('loading');
  if (Number.isFinite(finalH) && finalH > 0) markHeroSeen(heroKey(), finalH);
  return attachGridReveal(box, img, 20, true);
}

export function mountHeroRise(root) {
  const box = root.querySelector('.hero-box');
  const img = box?.querySelector('img');
  if (!box || !img) return () => {};
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    box.classList.add('ready');
    return () => {};
  }
  if (!matchMedia('(max-width: 640px)').matches) return attachGridReveal(box, img, 80, true);
  // Cached hero — image already complete or this hash already rose this session
  const k = heroKey();
  const cached = hasHeroSeen(k);
  const imgCached = img.complete && img.naturalWidth > 0;
  // If we have seen this tab before and the image is cached, skip the height morph
  if (cached && imgCached) return skipRise(box, img, 0);
  // Also skip if seen but image not yet decoded? still skip morph, grid reveal handles tint
  if (cached) return skipRise(box, img, 0);
  const w = parseFloat(box.dataset.w) || 3;
  const h = parseFloat(box.dataset.h) || 4;
  const cw = box.getBoundingClientRect().width || window.innerWidth - 24;
  const finalH = Math.round(cw * (h / w));
  let placeholderH = Math.round(Math.min(420, Math.max(300, cw * 0.82)));
  if (finalH - placeholderH < 28) placeholderH = Math.max(220, finalH - 80);
  placeholderH = Math.min(placeholderH, finalH - 24);
  if (placeholderH < 180) placeholderH = Math.min(220, finalH - 24);
  // Persist finalH per tab so revisit can skip without remeasuring
  markHeroSeen(k, finalH);
  // Edge: instantly cached image — no morph, straight to mosaic
  if (img.complete && img.naturalWidth > 0 && finalH - placeholderH < 36) {
    return skipRise(box, img, finalH);
  }
  const dur = Math.round(fxMs('--dur-hero-rise', 860));
  const ease = fxVar('--ease-signature', 'cubic-bezier(0.32,0.72,0,1)');
  box.style.aspectRatio = 'auto';
  box.style.height = placeholderH + 'px';
  box.classList.add('loading');
  box.getBoundingClientRect();
  box.style.transition = `height ${dur}ms ${ease}`;
  box.style.willChange = 'height';
  let done = false, tFallback = 0, offReveal = () => {};
  const finishHeight = () => {
    if (done) return;
    done = true;
    box.removeEventListener('transitionend', onEnd);
    clearTimeout(tFallback);
    box.style.height = '';
    box.style.aspectRatio = 'var(--hero-aspect)';
    box.style.transition = '';
    box.style.willChange = '';
    box.classList.remove('loading');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!box.isConnected) return;
      offReveal = attachGridReveal(box, img, 80, true);
    }));
  };
  const onEnd = (e) => { if (e.propertyName !== 'height') return; finishHeight(); };
  box.addEventListener('transitionend', onEnd);
  tFallback = setTimeout(finishHeight, dur + 120);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (!done) box.style.height = finalH + 'px';
  }));
  return () => {
    done = true;
    clearTimeout(tFallback);
    box.removeEventListener('transitionend', onEnd);
    box.classList.remove('loading');
    box.style.height = '';
    box.style.aspectRatio = '';
    box.style.transition = '';
    box.style.willChange = '';
    offReveal();
  };
}
