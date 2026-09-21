/* ADAM/PAGE — views/project · project detail page · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
import { projects, bodies } from '../data/site.js';
import { footer } from './shared.js';
import { mountHeroRise } from './rise.js';
import { mountTitleReveal } from './title-reveal.js';
import { pictureMarkup } from './img-helpers.js';
import { promoVideoMarkup, mountPromoVideo } from './promo-video.js';
import { marked } from 'marked';

function renderBody(md) {
  if (!md || !md.trim()) {
    return [
      `<p class="todo">Case-study body — edit in <a href="/admin/" target="_blank">/admin</a> (Projects → this slug `,
      `→ Body).</p>`,
    ].join('');
  }
  return `<div class="prose">${marked.parse(md)}</div>`;
}

export function Project(slug) {
  const i = projects.findIndex((p) => p[0] === slug);
  if (i < 0) return `<p>Not found. <a href="#/">Back home</a>.</p>${footer()}`;
  const [s, title, a, b, date, timeline, role, , img, deliverables, platform, w = 3, h = 4, mock, hero, promoVideo] = projects[i];
  const next = projects[(i + 1) % projects.length];
  const cats = [a, b].filter(Boolean).join(' · ');
  const body = bodies[s] || '';
  const heroSrc = hero || mock || img;
  const heroPic = pictureMarkup(heroSrc, title, w, h, {
    loading: 'eager',
    fetchPriority: 'high',
    kind: 'hero',
    decoding: 'async',
  });
  const promo = promoVideoMarkup(promoVideo);
  return [
    `<article class="case"><div class="case-grid">\n  <div class="case-copy"><h1>`,
    title,
    `</h1><p class="kicker">`,
    cats ? cats + ' · ' : '',
    date,
    `</p>\n  `,
    renderBody(body),
    `\n  <dl class="spec"><div><dt>Deliverables</dt><dd>`,
    deliverables || '—',
    `</dd></div><div><dt>Date</dt><dd>`,
    date,
    `</dd></div>\n  <div><dt>Timeline</dt><dd>`,
    timeline || '—',
    `</dd></div><div><dt>Role</dt><dd>`,
    role || '—',
    `</dd></div><div><dt>Platform</dt><dd>`,
    platform || '—',
    `</dd></div></dl></div>\n  <div class="case-media"><div class="hero-box" style="--hero-aspect:`,
    w,
    `/`,
    h,
    `" data-w="`,
    w,
    `" data-h="`,
    h,
    `"><canvas class="gr" aria-hidden="true"></canvas>${heroPic}</div>${promo}</div></div>\n  <a class="next" href="#/projects/`,
    next[0],
    `"><small>See whats next</small><b>`,
    next[1],
    `</b>\n  <span class="work-meta">`,
    next[2] ? next[2] + ' · ' : '',
    next[3] ? next[3] + ' · ' : '',
    next[0],
    `</span></a></article>`,
    footer(),
  ].join('');
}

export function mountProject(root) {
  const img = root.querySelector('.hero-box img');
  if (img?.src.startsWith('http') && !img.crossOrigin) {
    try { img.crossOrigin = 'anonymous'; } catch {}
  }
  const offRise = mountHeroRise(root);
  const offTitle = mountTitleReveal(root);
  const offPromo = mountPromoVideo(root);
  return () => { try { offRise(); } catch {} try { offTitle(); } catch {} try { offPromo(); } catch {} };
}
