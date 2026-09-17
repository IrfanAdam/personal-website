/* ADAM/PAGE — views/masonry · masonry · [plan:2026-09-15_183400-lump-sum-builds.md#phase-11] */
import { projects } from '../data/site.js';
import { distribute } from './masonry/layout.js';
import { attachParallax } from './masonry/parallax.js';
import { card, row } from './masonry/cards.js';
import { reveal, attachLinger } from './masonry/reveal.js';
import { attachDesktopZing } from './masonry/reel-tick.js';
import { attachViewer } from './masonry/viewer.js';
import { attachListViewer } from './masonry/list-viewer.js';
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
let desktopZingOff = null;
let listViewOff = null;
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
  if (desktopZingOff) { desktopZingOff(); desktopZingOff = null; }
  if (listViewOff) { listViewOff(); listViewOff = null; }
  if (view === 'list') {
    grid.className = 'works';
    grid.style.removeProperty('--cols');
    grid.innerHTML = `<h2>All of my works</h2>${list.map(row).join('')}${aboutBlock()}`;
    if (window.innerWidth > 640) listViewOff = attachListViewer(grid);
  } else {
    const heights = list.map((p) => (p[12] || 4) / (p[11] || 3) + TEXT_H);
    const buckets = distribute(cols, heights);
    grid.className = 'cols';
    grid.style.setProperty('--cols', cols);
    // first 6 cards eager — above the fold on both desktop & mobile
    let n = 0;
    grid.innerHTML = buckets.map((b) => `<div class="col">${
      b.map((i) => card(list[i], n++ < 6)).join('')}</div>`).join('');
    revealOff = reveal(grid);
    parallaxOff = attachParallax(grid);
    lingerOff = attachLinger(grid);
    desktopZingOff = attachDesktopZing(grid);
    if (window.innerWidth > 640) viewerOff = attachViewer(grid);
  }
  if (count) count.textContent = `${list.length} stories`;
}
export function Masonry() {
  return [
    `<div class="filters" id="filtersBar"><button class="pill on" data-filter="all">All</button>`,
    `<button class="pill" data-filter="crm">Sales CRM</button>`,
    `<button class="pill" data-filter="goals">Sales Goals</button>`,
    `<span class="f-wrap" id="fWrap"><button class="pill f-settings" id="fSettingsBtn"`,
    ` aria-haspopup="true" aria-expanded="false"`,
    ` aria-controls="smenuPop" title="Settings">⚙</button></span></div>`,
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
    if (desktopZingOff) { desktopZingOff(); desktopZingOff = null; }
    if (listViewOff) { listViewOff(); listViewOff = null; }
    redraw = null;
  };
}
export function setView(v) { view = v; if (redraw) redraw(); }
