/* ADAM/PAGE — views/masonry/work-peek · list preview pane (detail media) ·
   [plan:2026-09-15_183400-lump-sum-builds.md#phase-20] */
// Exports: peekMarkup — pane markup · attachWorkPeek — hover swap + mosaic
import { attachGridReveal } from './gridReveal.js';
import { cardSrc } from '../img-helpers.js';

// Detail-page media: hero composite first, mock/image as fallback.
const mediaOf = (p) => p[14] || p[13] || p[8];

// — Section: markup —
export function peekMarkup(p) {
  const [slug, title, , , , , , , , , , w = 3, h = 4] = p;
  const src = cardSrc(mediaOf(p), 800);
  return `<aside class="peek case-media hero-box" id="workPeek" data-slug="${slug}" aria-hidden="true"`
    + ` style="--hero-aspect:${w}/${h}">`
    + `<canvas class="gr" aria-hidden="true"></canvas>`
    + `<img src="${src}" alt="${title}" width="${w}" height="${h}" loading="eager" decoding="async" />`
    + `</aside>`;
}

// — Section: behaviour —
export function attachWorkPeek(grid) {
  if (matchMedia('(hover: none)').matches) return () => {};
  const pane = grid.querySelector('#workPeek');
  const img = pane && pane.querySelector('img');
  if (!pane || !img) return () => {};
  const rows = [...grid.querySelectorAll('.work[data-media]')];
  if (!rows.length) return () => {};
  let offReveal = attachGridReveal(pane, img, 0, true);
  const show = (row) => {
    const src = row.dataset.media;
    const slug = (row.getAttribute('href') || '').split('/').pop();
    if (!src || slug === pane.dataset.slug) return;
    const w = row.dataset.w || 3, h = row.dataset.h || 4;
    pane.dataset.slug = slug;
    pane.style.setProperty('--hero-aspect', `${w}/${h}`);
    img.alt = (row.querySelector('.work-title') || {}).textContent || '';
    img.setAttribute('width', w);
    img.setAttribute('height', h);
    pane.classList.remove('ready'); // mosaic holds the frame while the new media decodes
    img.src = src;
    offReveal();
    offReveal = attachGridReveal(pane, img, 0, true);
  };
  const onEnter = (e) => show(e.currentTarget);
  rows.forEach((r) => r.addEventListener('mouseenter', onEnter));
  return () => {
    rows.forEach((r) => r.removeEventListener('mouseenter', onEnter));
    offReveal();
  };
}
