/* ADAM/DS app shell — hash router + theme toggle + section nav. */
import { render as overview } from './pages-overview.js';
import { render as foundations } from './pages-foundations.js';
import { render as tokens } from './pages-tokens.js';
import { render as components } from './pages-components.js';
import { render as patterns } from './pages-patterns.js';
import { refreshLive } from './specimens.js';
const routes = [
  { hash: '#/', label: 'Overview', group: 'Start', render: overview },
  { hash: '#/foundations', label: 'Foundations', group: 'Foundations', render: foundations },
  { hash: '#/tokens', label: 'Tokens', group: 'Foundations', render: tokens },
  { hash: '#/components', label: 'Components', group: 'Library', render: components },
  { hash: '#/patterns', label: 'Patterns · Quality', group: 'Library', render: patterns },
];
const main = document.getElementById('ds-main');
const nav = document.getElementById('ds-nav');
/* theme: system / light / dark, persisted — shared with site (adam-theme) */
const root = document.documentElement;
const saved = localStorage.getItem('adam-theme') || localStorage.getItem('adam-ds-theme') || 'system';
const bar = document.createElement('div');
bar.className = 'ds-controls';
bar.innerHTML = ['system', 'light', 'dark'].map((m) => `<button class="pill" data-theme-btn="${m}">${m}</button>`).join('');
document.body.prepend(bar);
function applyTheme(m) {
  root.removeAttribute('data-theme');
  if (m === 'light') root.setAttribute('data-theme', 'light');
  if (m === 'dark') root.setAttribute('data-theme', 'dark');
  localStorage.setItem('adam-theme', m);
  localStorage.setItem('adam-ds-theme', m);
  bar.querySelectorAll('[data-theme-btn]').forEach((b) => b.classList.toggle('on', b.dataset.themeBtn === m));
}
bar.addEventListener('click', (e) => {
  const b = e.target.closest('[data-theme-btn]'); if (b) { applyTheme(b.dataset.themeBtn); refreshLive(); }
});
applyTheme(saved);
/* nav */
let lastGroup = '';
nav.innerHTML = routes.map((r) => {
  const h = r.group !== lastGroup ? `<div class="ds-nav-label">${r.group}</div>` : '';
  lastGroup = r.group; return `${h}<a href="${r.hash}">${r.label}</a>`;
}).join('');
function route() {
  const h = location.hash || '#/';
  const i = Math.max(0, routes.findIndex((r) => r.hash === h));
  const r = routes[i];
  nav.querySelectorAll('a').forEach((a) => a.classList.toggle('on', a.getAttribute('href') === r.hash));
  const prev = routes[(i - 1 + routes.length) % routes.length];
  const next = routes[(i + 1) % routes.length];
  main.innerHTML = r.render()
    + `<div class="ds-footnav"><a href="${prev.hash}"><small>← Prev</small>${prev.label}</a><a href="${next.hash}" style="text-align:right"><small>Next →</small>${next.label}</a></div>`;
  window.scrollTo(0, 0); refreshLive();
}
window.addEventListener('hashchange', route);
if (!location.hash) location.hash = '#/';
route();
