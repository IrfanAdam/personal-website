/* ADAM/PAGE — views/next-preview · next link · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
// Exports: nextBlock — HTML for the "See whats next" block
import { pictureMarkup } from './img-helpers.js';
import { nextCopy } from '../data/next-copy.js';

// — Next preview —
export function nextBlock(next) {
  const [ns, ntitle, , , , , , , nimg, , , , , nmock, nhero, , nNextImg, nNextW = 3, nNextH = 4] = next;
  const src = nNextImg || nhero || nmock || nimg;
  const pic = pictureMarkup(src, ntitle, nNextW, nNextH, {
    loading: 'lazy',
    decoding: 'async',
    kind: 'hero',
  });
  const paras = nextCopy[ns] || [];
  const desc = paras.length
    ? `<div class="next-desc">${paras.map((p) => `<p>${p}</p>`).join('')}</div>`
    : '';
  return [
    `<a class="next" href="#/projects/`,
    ns,
    `"><div class="next-copy"><small>See whats next</small><h2>`,
    ntitle,
    `</h2>`,
    desc,
    `</div><div class="next-media">`,
    pic,
    `</div></a>`,
  ].join('');
}
