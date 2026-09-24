/* ADAM/DS — ds/specimens/markup.js · markup builders · [plan:2026-09-24_170000-code-syntax-highlight.md#phase-2] */
// Exports: fig, code, note, cell, cardHTML, pillHTML, workRowHTML, specItemHTML — builders
// — Builders · Site —
import { highlight } from '../code-highlight.js';
/* — Builders — */
export const fig = (demo, caption) => `<figure>${demo}<figcaption>${caption}</figcaption></figure>`;
export const code = (s, lang) => {
  const l = lang || 'html';
  const body = highlight(s);
  return '<div class="ds-code" data-lang="' + l + '"><pre><code class="hl">' + body + '</code></pre></div>';
};
export const note = (title, body, kind = 'do') => {
  const extra = kind === 'dont' ? ' dont' : '';
  return '<div class="ds-note' + extra + '"><b>' + title + '</b>' + body + '</div>';
};
export const cell = (demo, nm, vl) => [
  '<div class="ds-cell"><figure style="margin:0">',
  demo,
  '</figure><div class="nm">',
  nm,
  '</div>',
  vl ? '<div class="vl">' + vl + '</div>' : '',
  '</div>',
].join('');
/* — Site components (real classes) — */
export const cardHTML = (title, meta, img, tags = [], extraClass = '') => [
  '\n<a class="card ready',
  extraClass ? ' ' + extraClass : '',
  '" href="javascript:void(0)"><span class="img"><img src="',
  img,
  '" alt="" loading="lazy"/></span>\n<span class="tags">',
  tags.map((t) => '<i>' + t + '</i>').join(''),
  '</span><span class="scrim"></span>\n<span class="card-info"><b>',
  title,
  '</b><small>',
  meta,
  '</small></span></a>',
].join('');
export function pillHTML(label, on) {
  const cls = on ? 'pill on' : 'pill';
  return '<a class="' + cls + '" href="javascript:void(0)">' + label + '</a>';
}
export const workRowHTML = (title, meta) => [
  '<a class="work" href="javascript:void(0)"><span class="work-title">',
  title,
  '</span><span class="work-meta">',
  meta,
  '</span></a>',
].join('');
export const specItemHTML = (dt, dd) => '<div><dt>' + dt + '</dt><dd>' + dd + '</dd></div>';
