import { projects } from '../data/site.js';
import { distribute } from './masonry/layout.js';
import { attachParallax } from './masonry/parallax.js';
import { attachGridReveal } from './masonry/gridReveal.js';
import { footer, aboutBlock } from './shared.js';

let filter = 'all';
const cols = 4;
let view = 'grid'; // 'grid' | 'list'
let redraw = null;
let parallaxOff = null;
let lingerOff = null;
let revealOff = null;
const TEXT_H = 0; // overlay — no extra text block height

const filtered = () => projects.filter((p) => filter === 'all' || p[7] === filter);

function card(p, i) {
  const [slug, title, a, b, date, , , , img, , , w = 3, h = 4] = p;
  const tags = [a, b].filter(Boolean).map((c) => `<i>${c}</i>`).join('');
  return `<a class="card" href="#/projects/${slug}">`
    + `<span class="img" style="aspect-ratio:${w}/${h}">`
    + `<canvas class="gr" aria-hidden="true"></canvas>`
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
  // GridReveal + image fade: canvas mosaic does per-cell shimmer &
  // pixelated (busy regions split first → variable sharpness), the
  // <img> above it de-blurs and fades in. Stagger keeps shine visible.
  const t0 = performance.now();
  const SKELETON_MS = 480, STAGGER_MS = 45, STAGGER_CAP = 500;
  const cards = [...grid.querySelectorAll('.card')];
  const offs = [];
  cards.forEach((el, idx) => {
    const box = el.querySelector('.img');
    const img = el.querySelector('img');
    offs.push(attachGridReveal(box, img));
    const show = () => {
      const wait = Math.max(0,
        SKELETON_MS + Math.min(idx * STAGGER_MS, STAGGER_CAP) - (performance.now() - t0));
      setTimeout(() => { if (el.isConnected) el.classList.add('ready'); }, wait);
    };
    if (img.complete && img.naturalWidth) show();
    else {
      img.addEventListener('load', show, { once: true });
      img.addEventListener('error', show, { once: true });
    }
  });
  return () => offs.forEach((fn) => fn());
}

function attachLinger(grid) {
  // mobile 1-col: info shows only when WHOLE card is visible, lingers in + out.
  const cards = [...grid.querySelectorAll('.card')];
  if (!cards.length) return () => {};
  const isMobile = () => window.innerWidth <= 640;
  if (!isMobile() || !('IntersectionObserver' in window)) {
    if (isMobile()) cards.forEach((c) => c.classList.add('in-view'));
    return () => {};
  }
  const LINGER_IN = 60, LINGER_OUT = 480;
  const showTimers = new Map(), hideTimers = new Map();
  const topEl = document.querySelector('.top');
  const hdr = () => (topEl ? topEl.offsetHeight : 56);
  // threshold ≈ 80% visible — forgiving while still requiring most of card
  // in viewport (not just peeking). root shrinks viewport by bottom bar.
  const buildIO = () => new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const el = e.target;
        const whole = e.isIntersecting && e.intersectionRatio >= 0.8;
        if (whole) {
          if (hideTimers.has(el)) { clearTimeout(hideTimers.get(el)); hideTimers.delete(el); }
          if (el.classList.contains('in-view') || showTimers.has(el)) return;
          const t = setTimeout(() => {
            showTimers.delete(el);
            if (el.isConnected && isMobile()) el.classList.add('in-view');
          }, LINGER_IN);
          showTimers.set(el, t);
        } else {
          if (showTimers.has(el)) { clearTimeout(showTimers.get(el)); showTimers.delete(el); }
          if (!el.classList.contains('in-view') || hideTimers.has(el)) return;
          const t = setTimeout(() => {
            hideTimers.delete(el);
            el.classList.remove('in-view');
          }, LINGER_OUT);
          hideTimers.set(el, t);
        }
      });
    },
    { rootMargin: `0px 0px -${hdr() + 12}px 0px`, threshold: [0, 0.8, 1] }
  );
  let io = buildIO();
  cards.forEach((c) => io.observe(c));
  const onResize = () => {
    if (!isMobile()) {
      showTimers.forEach((t) => clearTimeout(t)); hideTimers.forEach((t) => clearTimeout(t));
      showTimers.clear(); hideTimers.clear();
      cards.forEach((c) => c.classList.remove('in-view'));
      io.disconnect(); window.removeEventListener('resize', onResize);
      return;
    }
    // header height may have changed — rebuild observer with new rootMargin
    io.disconnect(); io = buildIO(); cards.forEach((c) => io.observe(c));
  };
  window.addEventListener('resize', onResize);
  return () => {
    showTimers.forEach((t) => clearTimeout(t)); hideTimers.forEach((t) => clearTimeout(t));
    showTimers.clear(); hideTimers.clear();
    io.disconnect(); window.removeEventListener('resize', onResize);
    cards.forEach((c) => c.classList.remove('in-view'));
  };
}

function draw(root) {
  const grid = root.querySelector('#grid');
  const count = document.getElementById('count');
  const list = filtered();
  if (parallaxOff) { parallaxOff(); parallaxOff = null; }
  if (lingerOff) { lingerOff(); lingerOff = null; }
  if (revealOff) { revealOff(); revealOff = null; }
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
    revealOff = reveal(grid);
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
    if (revealOff) { revealOff(); revealOff = null; }
    redraw = null;
  };
}

export function setView(v) {
  view = v;
  if (redraw) redraw();
}
