import { projects } from '../data/site.js';
import { distribute } from './masonry/layout.js';
import { attachParallax } from './masonry/parallax.js';
import { footer, aboutBlock } from './shared.js';

let filter = 'all';
const cols = 4;
let view = 'grid'; // 'grid' | 'list'
let redraw = null;
let parallaxOff = null;
let lingerOff = null;
const TEXT_H = 0; // overlay — no extra text block height

const filtered = () => projects.filter((p) => filter === 'all' || p[7] === filter);

function card(p, i) {
  const [slug, title, a, b, date, , , , img, , , w = 3, h = 4] = p;
  const tags = [a, b].filter(Boolean).map((c) => `<i>${c}</i>`).join('');
  return `<a class="card" style="transition-delay:${Math.min(i * 28, 280)}ms" href="#/projects/${slug}">`
    + `<span class="img" style="aspect-ratio:${w}/${h}">`
    + `<img loading="lazy" decoding="async" width="${w}" height="${h}" src="${img}" alt="${title}" /></span>`
    + `<span class="tags">${tags}</span>`
    + `<span class="scrim" aria-hidden="true"></span>`
    + `<span class="card-info"><b>${title}</b><small>${slug} · ${date}</small></span></a>`;
}

function row(p) {
  const [slug, title, a, b, date] = p;
  const cats = [a, b].filter(Boolean).join(' · ');
  return `<a class="work" href="#/projects/${slug}"><span class="work-title">${title}</span>`
    + `<span class="work-meta">${cats ? cats + ' · ' : ''}${slug} · ${date}</span></a>`;
}

function reveal(grid) {
  grid.querySelectorAll('.card').forEach((el) => {
    const img = el.querySelector('img');
    const ready = () => el.classList.add('ready');
    if (img.complete && img.naturalWidth) ready();
    else {
      img.addEventListener('load', ready, { once: true });
      img.addEventListener('error', ready, { once: true });
    }
  });
}

function attachLinger(grid) {
  // mobile 1-col: info shows when card is in view (no hover). lingers while visible.
  const cards = [...grid.querySelectorAll('.card')];
  if (!cards.length) return () => {};
  // disable on desktop 4/2-col where hover is primary; enable only when single col
  const isMobile = () => window.innerWidth <= 640;
  if (!isMobile() || !('IntersectionObserver' in window)) {
    // fallback: make all visible on narrow without observer
    if (isMobile()) cards.forEach((c) => c.classList.add('in-view'));
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        e.target.classList.toggle('in-view', e.isIntersecting && e.intersectionRatio > 0.22);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: [0, 0.22, 0.5, 1] }
  );
  cards.forEach((c) => io.observe(c));
  // handle resize column change: toggle observer
  const onResize = () => {
    if (!isMobile()) {
      cards.forEach((c) => c.classList.remove('in-view'));
      io.disconnect();
      window.removeEventListener('resize', onResize);
    }
  };
  window.addEventListener('resize', onResize);
  return () => {
    io.disconnect();
    window.removeEventListener('resize', onResize);
    cards.forEach((c) => c.classList.remove('in-view'));
  };
}

function draw(root) {
  const grid = root.querySelector('#grid');
  const count = document.getElementById('count');
  const list = filtered();
  if (parallaxOff) { parallaxOff(); parallaxOff = null; }
  if (lingerOff) { lingerOff(); lingerOff = null; }
  if (view === 'list') {
    grid.className = 'works';
    grid.style.removeProperty('--cols');
    grid.innerHTML = `<h2>All of my works</h2>${list.map(row).join('')}${aboutBlock()}`;
  } else {
    const heights = list.map((p) => (p[12] || 4) / (p[11] || 3) + TEXT_H);
    const buckets = distribute(cols, heights);
    grid.className = 'cols';
    grid.style.setProperty('--cols', cols);
    grid.innerHTML = buckets.map((b) => `<div class="col">${b.map((i) => card(list[i], i)).join('')}</div>`).join('');
    reveal(grid);
    // parallax aligns short-column bottoms as you scroll
    parallaxOff = attachParallax(grid);
    lingerOff = attachLinger(grid);
  }
  if (count) count.textContent = `${list.length} stories`;
}

export function Masonry() {
  return `<section class="hero"><h1>Working on stories that last</h1>`
  + `<p>Masonry view. Edit stories in <code>src/data/site.js</code>.</p></section>`
  + `<div class="filters"><button class="pill on" data-filter="all">All</button>`
  + `<button class="pill" data-filter="crm">Sales CRM</button>`
  + `<button class="pill" data-filter="goals">Sales Goals</button></div>`
  + `<main id="grid"></main>${footer()}`;
}

export function mountMasonry(root) {
  const onFilter = (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    root.querySelectorAll('[data-filter]').forEach((x) => x.classList.remove('on'));
    b.classList.add('on');
    filter = b.dataset.filter;
    redraw();
  };
  root.addEventListener('click', onFilter);
  redraw = () => draw(root);
  redraw();
  return () => {
    root.removeEventListener('click', onFilter);
    if (parallaxOff) { parallaxOff(); parallaxOff = null; }
    if (lingerOff) { lingerOff(); lingerOff = null; }
    redraw = null;
  };
}

export function setView(v) {
  view = v;
  if (redraw) redraw();
}
