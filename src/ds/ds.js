/* ADAM/DS app shell — hash router + theme toggle + section nav. */
import { render as changelog, mount as mountChangelog } from './pages-changelog.js';
import { render as overview } from './pages-overview.js';
import { render as foundations, mount as mountFoundations } from './pages-foundations.js';
import { render as tokens } from './pages-tokens.js';
import { render as components } from './pages-components.js';
import { render as patterns, mount as mountPatterns } from './pages-patterns.js';
import { render as functions, mount as mountFunctions } from './pages-functions.js';
import { render as primitives, mount as mountPrimitives } from './pages-primitives.js';
import { render as library, mount as mountLibrary } from './pages-library.js';
import { render as gridReveal, mount as mountGrid } from './functions/grid-reveal.js';
import { render as shimmer, mount as mountShimmer } from './functions/shimmer.js';
import { render as rise, mount as mountRise } from './functions/rise.js';
import { render as viewer, mount as mountViewer } from './functions/viewer.js';
import { refreshLive } from './specimens.js';
import { mountTabs } from './tabs.js';
const routes = [
  { hash: '#/changelog', label: 'Changelog', group: 'Start', render: changelog, mount: mountChangelog },
  { hash: '#/', label: 'Overview', group: 'Start', render: overview },
  { hash: '#/foundations', label: 'Foundations', group: 'Foundations', render: foundations, mount: mountFoundations },
  { hash: '#/tokens', label: 'Tokens', group: 'Foundations', render: tokens },
  { hash: '#/primitives', label: 'Primitives', group: 'Components', render: primitives, mount: mountPrimitives },
  { hash: '#/library', label: 'Library · Landing', group: 'Components', render: library, mount: mountLibrary },
  { hash: '#/components', label: 'Components', group: 'Components', render: components },
  { hash: '#/patterns', label: 'Patterns · Quality', group: 'Components', render: patterns, mount: mountPatterns },
  { hash: '#/functions', label: 'Functions', group: 'Functions', render: functions, mount: mountFunctions },
  { hash: '#/functions/grid-reveal', label: 'GridReveal', group: 'Functions', render: gridReveal, mount: mountGrid },
  { hash: '#/functions/shimmer', label: 'Shimmer', group: 'Functions', render: shimmer, mount: mountShimmer },
  { hash: '#/functions/rise', label: 'Rise', group: 'Functions', render: rise, mount: mountRise },
  { hash: '#/functions/viewer', label: 'Viewer', group: 'Functions', render: viewer, mount: mountViewer },
];
const main = document.getElementById('ds-main');
const nav = document.getElementById('ds-nav');
/* theme: system / light / dark, persisted — shared with site (adam-theme) */
const root = document.documentElement;
const saved = localStorage.getItem('adam-theme') || localStorage.getItem('adam-ds-theme') || 'system';
const bar = document.createElement('div');
bar.className = 'ds-controls';
bar.innerHTML = ['system', 'light', 'dark'].map((m) => `<button class="pill" data-theme-btn="${m}\">${m}</button>`).join('');
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
let cleanup = null;
function route() {
  if (cleanup) { cleanup(); cleanup = null; }
  const h = location.hash || '#/';
  const i = Math.max(0, routes.findIndex((r) => r.hash === h));
  const r = routes[i];
  nav.querySelectorAll('a').forEach((a) => a.classList.toggle('on', a.getAttribute('href') === r.hash));
  const prev = routes[(i - 1 + routes.length) % routes.length];
  const next = routes[(i + 1) % routes.length];
  main.innerHTML = r.render()
    + `<div class="ds-footnav"><a href="${prev.hash}"><small>← Prev</small>${prev.label}</a><a href="${next.hash}" style="text-align:right"><small>Next →</small>${next.label}</a></div>`;
  const cleanups = [];
  if (r.mount) cleanups.push(r.mount(main));
  cleanups.push(mountTabs(main));
  cleanup = cleanups.length ? () => cleanups.forEach((fn) => { try { fn && fn(); } catch (_) {} }) : null;
  window.scrollTo(0, 0); refreshLive();
}
window.addEventListener('hashchange', route);
if (!location.hash) location.hash = '#/';
route();
