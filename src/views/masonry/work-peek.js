/* ADAM/PAGE — views/masonry/work-peek · list preview pane (detail media) ·
   [plan:2026-09-15_183400-lump-sum-builds.md#phase-20] */
// Exports: peekMarkup — pane markup · attachWorkPeek — hover swap + mosaic
import { attachGridReveal } from './gridReveal.js';
import { hasReveal } from './gridReveal-load.js';
import { cardSrc } from '../img-helpers.js';

// Detail-page media: hero composite first, mock/image as fallback.
const mediaOf = (p) => p[14] || p[13] || p[8];

// Hover intent: popover is instant; the pane waits a beat so fast travel starts no mosaic.
// 120ms lets a quick sweep across 5 rows skip the canvas work.
const INTENT_MS = 120;

// — Section: markup —
export function peekMarkup(p) {
  const [slug, title, , , , , , , , , , w = 3, h = 4] = p;
  const src = cardSrc(mediaOf(p), 800);
  const head = `<aside class="peek case-media hero-box" id="workPeek" data-slug="${slug}" aria-hidden="true"`
    + ` style="--hero-aspect:${w}/${h}">`;
  const inner = `<canvas class="gr" aria-hidden="true"></canvas>`
    + `<img src="${src}" alt="${title}" width="${w}" height="${h}" loading="eager" decoding="async" /></aside>`;
  return head + inner;
}

// — Section: behaviour —
export function attachWorkPeek(grid) {
  if (matchMedia('(hover: none)').matches) return () => {};
  const pane = grid.querySelector('#workPeek');
  const img = pane && pane.querySelector('img');
  if (!pane || !img) return () => {};
  const rows = [...grid.querySelectorAll('.work[data-media]')];
  if (!rows.length) return () => {};
  const warm = () => rows.forEach((r) => {
    const s = r.dataset.media;
    if (!s) return;
    const im = new Image();
    im.decoding = 'async';
    im.src = s;
  });
  setTimeout(warm, 800);
  let offReveal = attachGridReveal(pane, img, 0, true);
  let pending = 0;
  const clearPending = () => {
    if (!pending) return;
    clearTimeout(pending);
    pending = 0;
  };
  const applyMeta = (row, slug, src) => {
    const w = row.dataset.w || 3;
    const h = row.dataset.h || 4;
    pane.dataset.slug = slug;
    pane.style.setProperty('--hero-aspect', `${w}/${h}`);
    img.alt = (row.querySelector('.work-title') || {}).textContent || '';
    img.setAttribute('width', w);
    img.setAttribute('height', h);
  };
  const swapFast = (row, slug, src) => {
    applyMeta(row, slug, src);
    clearPending();
    offReveal();
    img.src = src;
    if (!pane.classList.contains('ready')) pane.classList.add('ready');
    offReveal = () => {}; // seen asset: no mosaic, so nothing to tear down next time
  };
  const swapReveal = (row, slug, src) => {
    applyMeta(row, slug, src);
    pane.classList.remove('ready'); // mosaic holds the frame while the new media decodes
    img.src = src;
    offReveal();
    offReveal = attachGridReveal(pane, img, 0, true, 0, true);
  };
  const show = (row) => {
    const raw = row.dataset.media;
    const slug = (row.getAttribute('href') || '').split('/').pop();
    if (!raw || slug === pane.dataset.slug) {
      clearPending();
      return;
    }
    clearPending();
    const src = new URL(raw, document.baseURI).href;
    if (hasReveal(src)) {
      swapFast(row, slug, src);
      return;
    }
    pending = setTimeout(() => {
      pending = 0;
      swapReveal(row, slug, src);
    }, INTENT_MS);
  };
  const onEnter = (e) => show(e.currentTarget);
  rows.forEach((r) => r.addEventListener('mouseenter', onEnter));
  grid.addEventListener('mouseleave', clearPending);
  return () => {
    clearPending();
    grid.removeEventListener('mouseleave', clearPending);
    rows.forEach((r) => r.removeEventListener('mouseenter', onEnter));
    offReveal();
  };
}
