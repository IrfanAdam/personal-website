import { projects } from '../data/site.js';
import { footer } from './shared.js';
let filter = 'all';
let cols = 4;
export function Masonry() {
  return `<section class="hero"><h1>Working on stories that last</h1>
  <p>Masonry view. Edit stories in <code>src/data/site.js</code>.</p></section>
  <div class="filters"><button class="pill on" data-filter="all">All</button>
  <button class="pill" data-filter="crm">Sales CRM</button>
  <button class="pill" data-filter="goals">Sales Goals</button></div>
  <main class="grid" id="grid" data-cols="4"></main>${footer()}`;
}
export function mountMasonry(root) {
  const grid = root.querySelector('#grid');
  const count = document.getElementById('count');
  const draw = () => {
    grid.dataset.cols = cols;
    const list = projects.filter((p) => filter === 'all' || p[7] === filter);
    grid.innerHTML = list.map(([slug, title, , , date, , , , img]) =>
      `<a class="card" href="#/projects/${slug}"><span class="img"><img loading="lazy" src="${img}" alt="${title}" /></span>
      <span class="tags"><i>Sales CRM</i><i>Sales Goals</i></span>
      <span class="meta"><b>${title}</b><small>${slug} · ${date}</small></span></a>`).join('');
    if (count) count.textContent = `${list.length} stories`;
  };
  root.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => {
    root.querySelectorAll('[data-filter]').forEach((x) => x.classList.remove('on'));
    b.classList.add('on'); filter = b.dataset.filter; draw();
  }));
  draw();
  return () => cols;
}
export function setCols(n) {
  cols = n;
  const grid = document.getElementById('grid');
  if (grid) grid.dataset.cols = n;
}
