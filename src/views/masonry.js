import { projects } from '../data/site.js';
import { distribute } from './masonry/layout.js';
import { footer, aboutBlock } from './shared.js';

let filter = 'all';
const cols = 4;
let view = 'grid'; // 'grid' | 'list'
let redraw = null;
const TEXT_H = 0.28; // text block as fraction of column width

const filtered = () => projects.filter((p) => filter === 'all' || p[7] === filter);

function card(p, i) {
  const [slug, title, a, b, date, , , , img, , , w = 3, h = 4] = p;
  const tags = [a, b].filter(Boolean).map((c) => `<i>${c}</i>`).join('');
  return `<a class="card" style="transition-delay:${Math.min(i * 30, 300)}ms" href="#/projects/${slug}">`
    + `<span class="img" style="aspect-ratio:${w}/${h}">`
    + `<img loading="lazy" decoding="async" width="${w}" height="${h}" src="${img}" alt="${title}" /></span>`
    + `<span class="tags">${tags}</span>`
    + `<span class="meta"><b>${title}</b><small>${slug} · ${date}</small></span></a>`;
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

function draw(root) {
  const grid = root.querySelector('#grid');
  const count = document.getElementById('count');
  const list = filtered();
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
  }
  if (count) count.textContent = `${list.length} stories`;
}

export function Masonry() {
  return `<section class="hero"><h1>Working on stories that last</h1>
  <p>Masonry view. Edit stories in <code>src/data/site.js</code>.</p></section>
  <div class="filters"><button class="pill on" data-filter="all">All</button>
  <button class="pill" data-filter="crm">Sales CRM</button>
  <button class="pill" data-filter="goals">Sales Goals</button></div>
  <main id="grid"></main>${footer()}`;
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
    redraw = null;
  };
}

export function setView(v) {
  view = v;
  if (redraw) redraw();
}
