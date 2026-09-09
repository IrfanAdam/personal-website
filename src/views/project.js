import { projects, bodies } from '../data/site.js';
import { footer } from './shared.js';
import { mountHeroRise } from './rise.js';
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
  <div class="case-media hero-box" style="--hero-aspect:${w}/${h}" data-w="${w}" data-h="${h}"><canvas class="gr" aria-hidden="true"></canvas><img src="${heroSrc}" alt="${title}" width="${w}" height="${h}" decoding="async" fetchpriority="high"${heroSrc.startsWith('http') ? ' crossorigin="anonymous"' : ''} /></div></div>
  <a class="next" href="#/projects/${next[0]}"><small>See whats next</small><b>${next[1]}</b>
  <span class="work-meta">${next[2] ? next[2] + ' · ' : ''}${next[3] ? next[3] + ' · ' : ''}${next[0]}</span></a></article>${footer()}`;
}

export function mountProject(root) {
  const img = root.querySelector('.hero-box img');
  if (img?.src.startsWith('http') && !img.crossOrigin) {
    try { img.crossOrigin = 'anonymous'; } catch {}
  }
  return mountHeroRise(root);
}
