/* Specimen builders — render REAL site classes (base/pages/masonry), unmodified,
   inside doc framing. This is what makes the DS pixel-true: dogfooding. */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const fig = (demo, caption) => `<figure>${demo}<figcaption>${caption}</figcaption></figure>`;
export const code = (s) => `<div class="ds-code"><pre>${esc(s)}</pre></div>`;
export const note = (title, body, kind = 'do') =>
  `<div class="ds-note${kind === 'dont' ? ' dont' : ''}"><b>${title}</b>${body}</div>`;
export const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
/* — Live contrast (single home for Foundations + Patterns matrices) — */
export const toRGB = (s) => { s = String(s).trim(); let m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i); if (m) { let h = m[1]; if (h.length === 3) h = [...h].map((c) => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; } m = s.match(/rgba?\(([^)]+)\)/); if (m) { const p = m[1].split(',').map(Number); return [p[0] || 0, p[1] || 0, p[2] || 0]; } return [128, 128, 128]; };
const lumOf = (c) => { const a = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; };
export const contrastRatio = (a, b) => { const L1 = lumOf(toRGB(a)), L2 = lumOf(toRGB(b)); return ((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2); };
export const verdictRatio = (r) => { const n = Number(r); if (n >= 7) return 'AAA'; if (n >= 4.5) return 'AA'; if (n >= 3) return 'AA large'; return 'Fail'; };
/* Read live token values as a theme probe: flips [data-theme] synchronously
   (no paint between set + restore, so no flash), resolves var() chains via
   getComputedStyle, then restores the user's theme. */
export const probeTheme = (theme, fn) => {
  const el = document.documentElement, had = el.getAttribute('data-theme');
  el.setAttribute('data-theme', theme);
  let out; try { out = fn(); } finally { had === null ? el.removeAttribute('data-theme') : el.setAttribute('data-theme', had); }
  return out;
};
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
export const ramp = (tokens, mat = '', use = 'ref-only · click to copy') => `<div class="ds-ramp">${tokens.map((s) => `<i style="background:var(${s})" tabindex="0" data-copy-token="${s}" title="${s} — click to copy"><span class="tip"><b>${mat ? `${mat} · ` : ''}${s.split('-').pop()}</b><span class="tok">${s}</span><span data-live="${s}">${cssVar(s)}</span><em>${use}</em></span></i>`).join('')}</div>`;
export const typeRow = (demo, token, value) =>
  `<tr><td>${demo}</td><td><span class="tok">${token}</span></td><td style="font-family:var(--font-mono);font-size:var(--text-label);color:var(--color-ink-muted)">${value}</td></tr>`;
/* — specCells: trace rows WITHOUT color swatches (Update 4 Task 10 shared variant).
   rows: [[name, token, usage?, demoHTML?]] — demoHTML renders live instead of
   .ds-sw, so unitless tokens (leading/tracking/space/fx) get real specimens. */
export const specCells = (rows) =>
  `<div class="ds-grid c4">${rows.map(([name, token, usage, demo]) => `<div class="ds-cell" data-copy-token="${token}" title="Click to copy live value" style="cursor:pointer">${demo || ''}<div class="nm">${name}</div><div class="vl"><span class="tok">${token}</span></div><div class="vl" data-live="${token}">${cssVar(token)}</div>${usage ? `<div class="vl">${usage}</div>` : ''}</div>`).join('')}</div>`;
/* — tokenTrace: ramp → semantic → usage in one renderer (Phase 1 shared infra).
   rows: [[name, token, usage?]]; copy via [data-copy-token], live via [data-live].
   Pass plain:true for non-color tokens (space/size/measure/radius/leading) to
   omit the color swatch and avoid blank cards (shared fix: Tasks 10/13/18/24). */
export const tokenTrace = ({ ramp: rampTokens = [], rows = [], plain = false } = {}) =>
  `${rampTokens.length ? ramp(rampTokens) : ''}${rows.length ? `<div class="ds-grid c4">${rows.map(([name, token, usage]) => plain ? `<div class="ds-cell" data-copy-token="${token}" title="Click to copy live value" style="cursor:pointer"><div class="nm">${name}</div><div class="vl"><span class="tok">${token}</span></div><div class="vl" data-live="${token}">${cssVar(token)}</div>${usage ? `<div class="vl">${usage}</div>` : ''}</div>` : `<div class="ds-cell" data-copy-token="${token}" title="Click to copy live value" style="cursor:pointer"><div class="ds-sw" style="background:var(${token})"></div><div class="nm">${name}</div><div class="vl"><span class="tok">${token}</span></div><div class="vl" data-live="${token}">${cssVar(token)}</div>${usage ? `<div class="vl">${usage}</div>` : ''}</div>`).join('')}</div>` : ''}`;
