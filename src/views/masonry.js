/* ADAM/PAGE — views/masonry · masonry · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
import { projects } from '../data/site.js';
import { distribute } from './masonry/layout.js';
import { attachParallax } from './masonry/parallax.js';
import { card, row } from './masonry/cards.js';
import { reveal, attachLinger } from './masonry/reveal.js';
import { attachViewer } from './masonry/viewer.js';
import { footer, aboutBlock } from './shared.js';
import { mountTitleReveal } from './title-reveal.js';
let filter = 'all';
const cols = 4;
let view = 'grid';
let redraw = null;
let parallaxOff = null;
let lingerOff = null;
let revealOff = null;
let viewerOff = null;
const TEXT_H = 0;
const filtered = () => projects.filter((p) => filter === 'all' || p[7] === filter);
function draw(root) {
  const grid = root.querySelector('#grid');
  const count = document.getElementById('count');
  const list = filtered();
  if (parallaxOff) { parallaxOff(); parallaxOff = null; }
  if (lingerOff) { lingerOff(); lingerOff = null; }
  if (revealOff) { revealOff(); revealOff = null; }
  if (viewerOff) { viewerOff(); viewerOff = null; }
  if (view === 'list') {
    grid.className = 'works';
    grid.style.removeProperty('--cols');
    grid.innerHTML = `<h2>All of my works</h2>${list.map(row).join('')}${aboutBlock()}`;
  } else {
    const heights = list.map((p) => (p[12] || 4) / (p[11] || 3) + TEXT_H);
    const buckets = distribute(cols, heights);
    grid.className = 'cols';
    grid.style.setProperty('--cols', cols);
    grid.innerHTML = buckets.map((b) => `<div class="col">${b.map((i) => card(list[i])).join('')}</div>`).join('');
    revealOff = reveal(grid);
    parallaxOff = attachParallax(grid);
    lingerOff = attachLinger(grid);
    if (window.innerWidth > 640) viewerOff = attachViewer(grid);
  }
  if (count) count.textContent = `${list.length} stories`;
}
export function Masonry() {
  return [
    `<section class="hero"><h1>Working on stories that last</h1>`,
    `<p>Masonry view. Edit stories in <code>src/data/site.js</code>.</p></section>`,
    `<div class="filters"><button class="pill on" data-filter="all">All</button>`,
    `<button class="pill" data-filter="crm">Sales CRM</button>`,
    `<button class="pill" data-filter="goals">Sales Goals</button></div>`,
    `<main id="grid"></main>${footer()}`,
  ].join('');
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
  const offTitle = mountTitleReveal(root);
  return () => {
    root.removeEventListener('click', onFilter);
    try { offTitle(); } catch {}
    if (parallaxOff) { parallaxOff(); parallaxOff = null; }
    if (lingerOff) { lingerOff(); lingerOff = null; }
    if (revealOff) { revealOff(); revealOff = null; }
    if (viewerOff) { viewerOff(); viewerOff = null; }
    redraw = null;
  };
}
export function setView(v) { view = v; if (redraw) redraw(); }
