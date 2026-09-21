/* ADAM/PAGE — views/masonry/cards · cards · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: card(), row() — pure markup for grid + list
import { pictureMarkup, cardSrc } from '../img-helpers.js';
import { paletteFor } from './brand-tokens.js';
export function card(p, eager = false) {
  const [slug, title, a, b, date, , , , img, , , w = 3, h = 4, mock] = p;
  const tags = [a, b].filter(Boolean).map((c) => `<i>${c}</i>`).join('');
  const open = `<a class="card" href="#/projects/${slug}" data-mock="${mock || img}">`;
  const pic = pictureMarkup(img, title, w, h, {
    loading: eager ? 'eager' : 'lazy',
    fetchPriority: eager ? 'high' : 'low',
    kind: 'grid',
    decoding: 'async',
  });
  const media = `<span class="img" style="aspect-ratio:${w}/${h}">`
    + `<canvas class="gr" aria-hidden="true"></canvas>`
    + pic + `</span>`;
  const brackets = [
    `<span class="card-dim" aria-hidden="true"></span>`,
    `<span class="card-bracket card-bracket--tl" aria-hidden="true"></span>`,
    `<span class="card-bracket card-bracket--tr" aria-hidden="true"></span>`,
    `<span class="card-bracket card-bracket--bl" aria-hidden="true"></span>`,
    `<span class="card-bracket card-bracket--br" aria-hidden="true"></span>`,
  ].join('');
  const meta = `<span class="tags">${tags}</span>`
    + `<span class="scrim" aria-hidden="true"></span>`
    + `<span class="card-info"><b>${title}</b><small>${slug} · ${date}</small></span>` + brackets + `</a>`;
  return open + media + meta;
}
export function row(p) {
  const [slug, title, a, b, date, , , , img, , , w = 3, h = 4, mock, hero] = p;
  const cats = [a, b].filter(Boolean).join(' · ');
  const cat = cats ? cats + ' · ' : '';
  const card = cardSrc(img, 480), media = cardSrc(hero || mock || img, 800);
  const sw = paletteFor(slug).map(c => `<i style="background:${c}"></i>`).join('');
  const open = `<a class="work" href="#/projects/${slug}" data-card="${card}"`
    + ` data-media="${media}" data-w="${w}" data-h="${h}">`;
  const titleRow = `<span class="work-row work-row--main"><span class="work-title">${title}</span>`
    + `<span class="work-swatches" aria-hidden="true" data-swatches>${sw}</span></span>`;
  const metaRow = `<span class="work-row work-row--sub"><span class="work-meta">${cat}${slug}</span>`
    + `<span class="work-date">${date}</span></span></a>`;
  return open + titleRow + metaRow;
}
