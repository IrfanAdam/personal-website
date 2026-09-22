/* ADAM/PAGE — views/project · project detail page · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
// Exports: Project, mountProject — detail page + rise/reveal
import { projects, bodies } from '../data/site.js';
import { footer } from './shared.js';
import { mountHeroRise } from './rise.js';
import { mountTitleReveal } from './title-reveal.js';
import { pictureMarkup } from './img-helpers.js';
import { promoVideoMarkup, mountPromoVideo } from './promo-video.js';
import { nextBlock } from './next-preview.js';
import { marked } from 'marked';

// — Body —
function renderBody(md) {
  if (!md || !md.trim()) {
    return [
      `<p class="todo">Case-study body — edit in <a href="/admin/" target="_blank">/admin</a> (Projects → this slug `,
      `→ Body).</p>`,
    ].join('');
  }
  return `<div class="prose">${marked.parse(md)}</div>`;
}

// — Page —
export function Project(slug) {
  const i = projects.findIndex((p) => p[0] === slug);
  if (i < 0) return `<p>Not found. <a href="#/">Back home</a>.</p>${footer()}`;
  const [s, title, a, b, date, timeline, role, , img, deliverables,
    platform, w = 3, h = 4, mock, hero, promoVideo] = projects[i];
  const next = projects[(i + 1) % projects.length];
  const cats = [a, b].filter(Boolean).join(' · ');
  const kicker = cats;
  const body = bodies[s] || '';
  const heroSrc = hero || mock || img;
  const heroPic = pictureMarkup(heroSrc, title, w, h, {
    loading: 'eager',
    fetchPriority: 'high',
    kind: 'hero',
    decoding: 'async',
  });
  const promo = promoVideoMarkup(promoVideo);
  const nextHtml = nextBlock(next);
  const specHtml = `<dl class="spec"><div><dt>Deliverables</dt><dd>`
    + (deliverables || '—')
    + `</dd></div><div><dt>Date</dt><dd>`
    + date
    + `</dd></div>\n  <div><dt>Timeline</dt><dd>`
    + (timeline || '—')
    + `</dd></div><div><dt>Role</dt><dd>`
    + (role || '—')
    + `</dd></div><div><dt>Platform</dt><dd>`
    + (platform || '—')
    + `</dd></div></dl>`;
  const mKicker = kicker ? `<p class="kicker kicker--mobile">${kicker}</p>` : '';
  const dKicker = kicker ? `<p class="kicker kicker--desktop">${kicker}</p>` : '';
  return [
    `<article class="case"><div class="case-grid">\n  <div class="case-copy"><h1>`,
    title,
    `</h1>`,
    dKicker,
    `\n  `,
    renderBody(body),
    `\n  `,
    specHtml,
    `</div>\n  <div class="case-media">`,
    mKicker,
    specHtml,
    `<div class="hero-box" style="--hero-aspect:`,
    w,
    `/`,
    h,
    `" data-w="`,
    w,
    `" data-h="`,
    h,
    `"><canvas class="gr" aria-hidden="true"></canvas>${heroPic}</div>${promo}</div></div>\n  `,
    nextHtml,
    `</article>`,
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
