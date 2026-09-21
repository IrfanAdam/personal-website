/* ADAM/PAGE — views/masonry/brand-tokens · recall swatches from image ·
   [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
// Exports: paletteFor(slug) · attachBrandTokens(root)
// Fallback palettes = quantized heroes (4) — tas-51/tas-58 overridden to match the
// screenshot's recall cue (pink/purple/amber/blue + 4× blue). Runtime canvas refine
// overwrites these when the row's preview image loads.
import { extractPalette } from './brand-tokens-extract.js';
const FALLBACK = {
  'tas-51': ['#e84a6b', '#8a5cff', '#ffb020', '#3b82ff'],
  'tas-58': ['#1e40af', '#2563eb', '#3b82ff', '#60a5fa'],
  'tas-35': ['#e7e260', '#9e9ea2', '#5b5b5d', '#f3f1f2'],
  'tas-69': ['#6095a5', '#9ca3a3', '#5b6261', '#ebeced'],
  'fluxx': ['#d7315b', '#a3a3a3', '#5b5c5b', '#f0efef'],
  'helix': ['#97cbe9', '#1c232e', '#9a9ba1', '#f5f6f8'],
  'velocity': ['#8735b3', '#aeb8cf', '#0b070b', '#e3e6ec'],
  'grovegoods': ['#cfe59e', '#bac8c9', '#595b5c', '#dee7e7'],
  'acquapanna': ['#67a9cf', '#aad0da', '#6d6f70', '#f2f2f4'],
  'apparel-manufacturing-system-reimagined': ['#072024', '#576b6d', '#aebbbc', '#f6f7f7'],
  'bloomify': ['#807c74', '#a2a09b', '#666664', '#f4f7f5'],
  'earthlyessence': ['#1b63ca', '#a2a2a3', '#171818', '#f0f0f1'],
  'zenithlabs': ['#b5cee0', '#9ebace', '#95a9b7', '#dbebf5'],
  'gravitas': ['#b4aee9', '#60675a', '#232222', '#edebee'],
};
export function paletteFor(slug) {
  return FALLBACK[slug] || ['#e84a6b', '#8a5cff', '#ffb020', '#3b82ff'];
}
export function attachBrandTokens(root) {
  const rows = root.querySelectorAll('.work[data-card]');
  const cleanups = [];
  rows.forEach(row => {
    const sw = row.querySelector('[data-swatches]');
    if (!sw) return;
    const src = row.getAttribute('data-card');
    if (!src || src.startsWith('http')) return; // cross-origin taint
    const img = new Image();
    img.decoding = 'async';
    img.crossOrigin = 'anonymous';
    let done = false;
    const onLoad = () => {
      if (done) return;
      done = true;
      const pal = extractPalette(img);
      if (!pal || pal.length < 4) return;
      const nodes = sw.querySelectorAll('i');
      pal.forEach((c, i) => { if (nodes[i]) nodes[i].style.background = c; });
    };
    const onErr = () => { done = true; };
    img.addEventListener('load', onLoad, { once: true });
    img.addEventListener('error', onErr, { once: true });
    img.src = src;
    cleanups.push(() => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onErr);
      try { img.src = ''; } catch {}
    });
  });
  return () => cleanups.forEach(fn => fn());
}
