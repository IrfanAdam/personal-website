/* ADAM/FX — gridReveal-load · decode gate + buffers · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: makeDecode, gateLoad — session-seen cache, mobile replay, timeout
import { measureTree, orderRandom } from './cells.js';
import { fxMs } from '../fx-tokens.js';

const SAMPLE = 128;
const seen = new Set();

// — Decode factory —
export function makeDecode(img, root, branches, s, makeBuffers, render, finish, reduce) {
  return () => {
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
      s.split = 1;
      s.eased = 1;
      s.fade = 1;
      render(s.loadedAt + s.colorMs);
      finish();
    }
  };
}

// — Gate: seen cache, broken-file fast path, load listeners, timeout —
export function gateLoad(img, hero, reduce, s, decode, render, finish) {
  const key = img.currentSrc || img.src;
  const mobile = matchMedia('(max-width: 640px)').matches;
  const replay = hero && mobile;
  if (seen.has(key) || (img.complete && img.naturalWidth)) {
    decode();
    if (!replay || reduce) {
      s.split = 1;
      s.eased = 1;
      s.fade = 1;
      finish();
      return true;
    }
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
      finish();
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
