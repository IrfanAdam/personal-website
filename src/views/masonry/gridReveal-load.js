/* ADAM/FX — gridReveal-load · decode gate + buffers · [plan:2026-09-21_125642-lump-sum-builds.md#phase-8] */
// Exports: makeDecode, gateLoad, forgetReveal — session-seen cache, replay, mobile replay, timeout
import { measureTree, orderRandom } from './cells.js';
import { fxMs } from '../fx-tokens.js';

const SAMPLE = 128;
const seen = new Set();

// — Cache — a preview reveal must not consume the project page's mosaic —
export function forgetReveal(src) {
  if (src) seen.delete(src);
}

// — Read probe — lets the list pane reuse the project page's seen rule —
export function hasReveal(src) {
  if (!src) return false;
  return seen.has(src);
}

// — Decode factory — async decode ensures bitmap ready before mosaic tint —
export function makeDecode(img, root, branches, s, makeBuffers, render, finish, reduce) {
  return async () => {
    try { if (img.decode) await img.decode(); } catch {}
    const buf = document.createElement('canvas');
    buf.width = SAMPLE;
    buf.height = SAMPLE;
    const btx = buf.getContext('2d', { willReadFrequently: true });
    if (btx && img.naturalWidth) {
      const sc = Math.max(SAMPLE / img.naturalWidth, SAMPLE / img.naturalHeight);
      btx.drawImage(img,
        (SAMPLE - img.naturalWidth * sc) / 2,
        (SAMPLE - img.naturalHeight * sc) / 2,
        img.naturalWidth * sc,
        img.naturalHeight * sc);
      try {
        measureTree(root, btx.getImageData(0, 0, SAMPLE, SAMPLE).data, SAMPLE);
        orderRandom(branches, s.split);
        s.hasColors = true;
      } catch {}
    }
    seen.add(img.currentSrc || img.src);
    s.done = true;
    s.loadedAt = performance.now();
    makeBuffers();
    if (reduce) {
      try { if (img.decode) await img.decode(); } catch {}
      s.split = 1;
      s.eased = 1;
      s.fade = 1;
      render(s.loadedAt + s.colorMs);
      requestAnimationFrame(() => finish());
    }
  };
}

// — Gate: seen cache, replay, broken-file fast path, load listeners, timeout —
// `replay` forces the mosaic even when the bitmap is already decoded: the pane's
// hover swaps and the flight in from the list both want the reveal again.
export function gateLoad(img, hero, reduce, s, decode, render, finish, replay = false) {
  const key = img.currentSrc || img.src;
  const mobile = matchMedia('(max-width: 640px)').matches;
  const wantReplay = replay || (hero && mobile && !reduce);
  if ((seen.has(key) || (img.complete && img.naturalWidth)) && !wantReplay) {
    seen.add(key);
    s.done = true;
    s.loadedAt = performance.now();
    s.split = 1;
    s.eased = 1;
    s.fade = 1;
    finish();
    return true;
  }
  if (img.complete && img.naturalWidth) {
    decode(); // data is ready — the ticker mosaics it in
    return false;
  }
  if (img.complete) {
    s.done = true;
    s.loadedAt = performance.now();
    return false;
  }
  img.addEventListener('load', decode, { once: true });
  img.addEventListener('error', () => {
    s.done = true;
    s.loadedAt = performance.now();
    if (reduce) {
      render(s.loadedAt);
      requestAnimationFrame(() => finish());
    }
  }, { once: true });
  setTimeout(() => {
    if (!s.done) {
      s.done = true;
      s.loadedAt = performance.now();
    }
  }, fxMs('--fx-load-timeout', 9000));
  return false;
}
