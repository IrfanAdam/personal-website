/* ADAM/FX — views/rise · scroll rise effect · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
/* Shared mobile hero rise — placeholder height → final aspect height on
   --dur-hero-rise / --ease-signature, then cell-grid reveal. Reduced-motion
   and desktop pass straight through to the reveal. (5.2 dedup: project.js +
   contact.js ran this morph inline and duplicated.) */
import { attachGridReveal } from './masonry/gridReveal.js';
import { fxMs, fxVar } from './fx-tokens.js';
import { hasHeroSeen, markHeroSeen, heroKey } from './hero-height-cache.js';
import { syncPull } from './rise-sound.js';
// Exports: mountHeroRise — mobile height morph then grid reveal + pull

// — Skip path — cached hero goes straight to mosaic + pull —
function skipRise(box, img, finalH) {
  box.style.aspectRatio = 'var(--hero-aspect)';
  box.style.height = '';
  box.style.transition = '';
  box.style.willChange = '';
  box.classList.remove('loading');
  if (Number.isFinite(finalH) && finalH > 0) markHeroSeen(heroKey(), finalH);
  const off = attachGridReveal(box, img, 20, true, 0, box.hasAttribute('data-reveal'));
  syncPull(20);
  return off;
}

export function mountHeroRise(root) {
  const box = root.querySelector('.hero-box');
  const img = box?.querySelector('img');
  if (!box || !img) return () => {};
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    box.classList.add('ready');
    return () => {};
  }
  if (!matchMedia('(max-width: 640px)').matches) {
    const k = heroKey(), seen = hasHeroSeen(k);
    const off = attachGridReveal(box, img, 80, true, 0, box.hasAttribute('data-reveal'));
    if (!seen) { markHeroSeen(k, 0); syncPull(480); }
    return off;
  }
  // Cached hero — skip height morph, keep mosaic pull
  const k = heroKey();
  const cached = hasHeroSeen(k);
  const imgCached = img.complete && img.naturalWidth > 0;
  if (cached && imgCached) return skipRise(box, img, 0);
  if (cached) return skipRise(box, img, 0);
  const w = parseFloat(box.dataset.w) || 3;
  const h = parseFloat(box.dataset.h) || 4;
  const cw = box.getBoundingClientRect().width || window.innerWidth - 24;
  const finalH = Math.round(cw * (h / w));
  let placeholderH = Math.round(Math.min(420, Math.max(300, cw * 0.82)));
  if (finalH - placeholderH < 28) placeholderH = Math.max(220, finalH - 80);
  placeholderH = Math.min(placeholderH, finalH - 24);
  if (placeholderH < 180) placeholderH = Math.min(220, finalH - 24);
  markHeroSeen(k, finalH);
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
      offReveal = attachGridReveal(box, img, 80, true, 0, box.hasAttribute('data-reveal'));
      syncPull(80);
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
