/* ADAM/DS — ds/specimens/markup · markup builders · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
/* Specimen builders — render REAL site classes (base/pages/masonry), unmodified,
   inside doc framing. This is what makes the DS pixel-true: dogfooding. */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const fig = (demo, caption) => `<figure>${demo}<figcaption>${caption}</figcaption></figure>`;
export const code = (s) => `<div class="ds-code"><pre>${esc(s)}</pre></div>`;
export const note = (title, body, kind = 'do') =>
  `<div class="ds-note${kind === 'dont' ? ' dont' : ''}"><b>${title}</b>${body}</div>`;
export const cell = (demo, nm, vl) =>
  [
    `<div class="ds-cell"><figure style="margin:0">`,
    demo,
    `</figure><div class="nm">`,
    nm,
    `</div>`,
    vl ? `<div class="vl">${vl}</div>` : '',
    `</div>`,
  ].join('');
/* — Site components (real classes) — */
export const cardHTML = (title, meta, img, tags = [], extraClass = '') => [
  `
<a class="card ready`,
  extraClass ? ' ' + extraClass : '',
  `" href="javascript:void(0)"><span class="img"><img src="`,
  img,
  `" alt="" loading="lazy"/></span>
<span class="tags">`,
  tags.map((t) => `<i>${t}</i>`).join(''),
  `</span><span class="scrim"></span>
<span class="card-info"><b>`,
  title,
  `</b><small>`,
  meta,
  `</small></span></a>`,
].join('');
export const pillHTML = (label, on = false) =>
  `<a class="pill${on ? ' on' : ''}" href="javascript:void(0)">${label}</a>`;
export const workRowHTML = (title, meta) =>
  [
    `<a class="work" href="javascript:void(0)"><span class="work-title">`,
    title,
    `</span><span class="work-meta">`,
    meta,
    `</span></a>`,
  ].join('');
export const specItemHTML = (dt, dd) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`;
