/* Specimen builders — render REAL site classes (base/pages/masonry), unmodified,
   inside doc framing. This is what makes the DS pixel-true: dogfooding. */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const fig = (demo, caption) => `<figure>${demo}<figcaption>${caption}</figcaption></figure>`;
export const code = (s) => `<div class="ds-code"><pre>${esc(s)}</pre></div>`;
export const note = (title, body, kind = 'do') =>
  `<div class="ds-note${kind === 'dont' ? ' dont' : ''}"><b>${title}</b>${body}</div>`;
export const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
export const cell = (demo, nm, vl) =>
  `<div class="ds-cell"><figure style="margin:0">${demo}</figure><div class="nm">${nm}</div>${vl ? `<div class="vl">${vl}</div>` : ''}</div>`;
export const copy = async (v, el) => {
  try { await navigator.clipboard.writeText(v); } catch (_) {}
  if (!el) return; el.style.outline = `var(--space-2) solid var(--color-ink)`;
  setTimeout(() => { el.style.outline = ''; }, 600);
};
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-copy]'); if (t) copy(t.dataset.copy, t);
});
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-copy-token]'); if (t) copy(cssVar(t.dataset.copyToken), t);
});
/* — Site components (real classes) — */
export const cardHTML = (title, meta, img, tags = [], extraClass = '') => `
<a class="card ready${extraClass ? ' ' + extraClass : ''}" href="javascript:void(0)"><span class="img"><img src="${img}" alt="" loading="lazy"/></span>
<span class="tags">${tags.map((t) => `<i>${t}</i>`).join('')}</span><span class="scrim"></span>
<span class="card-info"><b>${title}</b><small>${meta}</small></span></a>`;
export const pillHTML = (label, on = false) =>
  `<a class="pill${on ? ' on' : ''}" href="javascript:void(0)">${label}</a>`;
export const workRowHTML = (title, meta) =>
  `<a class="work" href="javascript:void(0)"><span class="work-title">${title}</span><span class="work-meta">${meta}</span></a>`;
export const specItemHTML = (dt, dd) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`;
export const swatch = (name, token) =>
  `<div class="ds-cell" data-copy-token="${token}" title="Click to copy live value" style="cursor:pointer"><div class="ds-sw" style="background:var(${token})"></div><div class="nm">${name}</div><div class="vl"><span class="tok">${token}</span></div><div class="vl" data-live="${token}">${cssVar(token)}</div></div>`;
export const refreshLive = () =>
  document.querySelectorAll('[data-live]').forEach((el) => { el.textContent = cssVar(el.dataset.live); });
export const ramp = (tokens) => `<div class="ds-ramp">${tokens.map((s) => `<i style="background:var(${s})" title="${s}"></i>`).join('')}</div>`;
export const typeRow = (demo, token, value) =>
  `<tr><td>${demo}</td><td><span class="tok">${token}</span></td><td style="font-family:var(--font-mono);font-size:var(--text-label);color:var(--color-ink-muted)">${value}</td></tr>`;
