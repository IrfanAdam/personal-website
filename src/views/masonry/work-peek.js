/* ADAM/PAGE — views/masonry/work-peek · list preview pane ·
   [plan:2026-09-15_183400-lump-sum-builds.md#phase-19] */
// Exports: peekMarkup — pane markup · attachWorkPeek — hover-driven swap
import { fxMs } from '../fx-tokens.js';
import { cardSrc } from '../img-helpers.js';

// — Section: markup —
export function peekMarkup(p) {
  const [slug, title, , , , , , , img, , , w = 3, h = 4] = p;
  const src = cardSrc(img, 800);
  return `<aside class="peek" id="workPeek" data-slug="${slug}" aria-hidden="true">`
    + `<div class="peek-frame"><img src="${src}" alt="${title}" width="${w}" height="${h}"`
    + ` decoding="async" fetchpriority="low" /></div></aside>`;
}

// — Section: behaviour —
export function attachWorkPeek(grid) {
  if (matchMedia('(hover: none)').matches) return () => {};
  const pane = grid.querySelector('#workPeek');
  const img = pane && pane.querySelector('img');
  if (!img) return () => {};
  const rows = [...grid.querySelectorAll('.work[data-peek]')];
  if (!rows.length) return () => {};
  const SWAP = fxMs('--dur-viewer-swap', 110);
  let cur = img.getAttribute('src');
  const settle = () => pane.classList.remove('is-swap');
  const show = (row) => {
    const src = row && row.dataset.peek;
    if (!src || src === cur) return;
    cur = src;
    img.alt = row.querySelector('.work-title').textContent;
    pane.dataset.slug = (row.getAttribute('href') || '').split('/').pop();
    pane.classList.add('is-swap');
    img.src = src;
    if (img.decode) img.decode().then(settle, settle);
    else settle();
  };
  const onEnter = (e) => show(e.currentTarget);
  rows.forEach((r) => r.addEventListener('mouseenter', onEnter));
  return () => {
    rows.forEach((r) => r.removeEventListener('mouseenter', onEnter));
  };
}
