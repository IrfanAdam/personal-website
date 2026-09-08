import { projects, bodies } from '../data/site.js';
import { footer } from './shared.js';
import { attachGridReveal } from './masonry/gridReveal.js';
import { marked } from 'marked';

function renderBody(md) {
  if (!md || !md.trim()) {
    return `<p class="todo">Case-study body — edit in <a href="/admin/" target="_blank">/admin</a> (Projects → this slug → Body).</p>`;
  }
  return `<div class="prose">${marked.parse(md)}</div>`;
}

export function Project(slug) {
  const i = projects.findIndex((p) => p[0] === slug);
  if (i < 0) return `<p>Not found. <a href="#/">Back home</a>.</p>${footer()}`;
  const [s, title, a, b, date, timeline, role, , img, deliverables, platform, w = 3, h = 4, mock, hero] = projects[i];
  const next = projects[(i + 1) % projects.length];
  const cats = [a, b].filter(Boolean).join(' · ');
  const body = bodies[s] || '';
  const heroSrc = hero || mock || img;
  return `<article class="case"><div class="case-grid">
  <div class="case-copy"><h1>${title}</h1><p class="kicker">${cats ? cats + ' · ' : ''}${date}</p>
  ${renderBody(body)}
  <dl class="spec"><div><dt>Deliverables</dt><dd>${deliverables || '—'}</dd></div><div><dt>Date</dt><dd>${date}</dd></div>
  <div><dt>Timeline</dt><dd>${timeline || '—'}</dd></div><div><dt>Role</dt><dd>${role || '—'}</dd></div><div><dt>Platform</dt><dd>${platform || '—'}</dd></div></dl></div>
  <div class="case-media hero-box" style="--hero-aspect:${w}/${h}" data-w="${w}" data-h="${h}"><canvas class="gr" aria-hidden="true"></canvas><img src="${heroSrc}" alt="${title}" width="${w}" height="${h}" decoding="async" fetchpriority="high" /></div></div>
  <a class="next" href="#/projects/${next[0]}"><small>See whats next</small><b>${next[1]}</b>
  <span class="work-meta">${next[2] ? next[2] + ' · ' : ''}${next[3] ? next[3] + ' · ' : ''}${next[0]}</span></a></article>${footer()}`;
}

export function mountProject(root) {
  const box = root.querySelector('.hero-box');
  const img = box?.querySelector('img');
  if (!box || !img) return () => {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = matchMedia('(max-width: 640px)').matches;
  let offReveal = () => {};
  let cleanupHeight = () => {};

  if (isMobile && !reduce) {
    const w = parseFloat(box.dataset.w) || 3;
    const h = parseFloat(box.dataset.h) || 4;
    const asp = h / w;
    const cw = box.getBoundingClientRect().width || window.innerWidth - 24;
    const finalH = Math.round(cw * asp);
    let placeholderH = Math.round(Math.min(420, Math.max(300, cw * 0.82)));
    if (finalH - placeholderH < 28) placeholderH = Math.max(220, finalH - 80);
    placeholderH = Math.min(placeholderH, finalH - 24);
    if (placeholderH < 180) placeholderH = Math.min(220, finalH - 24);
    box.style.aspectRatio = 'auto';
    box.style.height = placeholderH + 'px';
    box.getBoundingClientRect();
    box.style.transition = 'height 860ms cubic-bezier(0.32,0.72,0,1)';
    box.style.willChange = 'height';
    let done = false;
    const expand = () => {
      if (done) return;
      done = true;
      box.style.height = finalH + 'px';
      const onEnd = (e) => {
        if (e.propertyName !== 'height') return;
        box.removeEventListener('transitionend', onEnd);
        box.style.height = '';
        box.style.aspectRatio = 'var(--hero-aspect)';
        box.style.transition = '';
        box.style.willChange = '';
      };
      box.addEventListener('transitionend', onEnd);
      setTimeout(() => {
        if (box.style.height) {
          box.style.height = '';
          box.style.aspectRatio = 'var(--hero-aspect)';
          box.style.transition = '';
          box.style.willChange = '';
        }
      }, 1180);
    };
    const t = setTimeout(expand, 96);
    const onResize = () => {
      if (done) return;
    };
    window.addEventListener('resize', onResize, { once: true });
    cleanupHeight = () => {
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
      box.style.height = '';
      box.style.aspectRatio = '';
      box.style.transition = '';
      box.style.willChange = '';
    };
  }

  offReveal = attachGridReveal(box, img, 80, true);

  return () => {
    cleanupHeight();
    offReveal();
  };
}
