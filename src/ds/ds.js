/* ADAM/DS — ds/ds · app shell · [plan:2026-09-24_150000-sound-to-foundations.md#phase-1] */
import { routes } from './routes.js';
import { mountTheme } from './theme.js';
import { mountSidebar } from './sidebar.js';
import { refreshLive } from './specimens.js';
import '../views/init-sound.js';
import { mountTabs } from './tabs.js';
const main = document.getElementById('ds-main');
const nav = document.getElementById('ds-nav');
mountTheme();
mountSidebar();
/* nav */
let lastGroup = '';
nav.innerHTML = routes.map((r) => {
  if (r.hash === '#/changelog') {
    lastGroup = r.group;
    return `<hr class="ds-nav-div"><a href="${r.hash}">${r.label}</a>`;
  }
  const h = r.group !== lastGroup ? `<div class="ds-nav-label">${r.group}</div>` : '';
  lastGroup = r.group; return `${h}<a href="${r.hash}">${r.label}</a>`;
}).join('');
let cleanup = null;
function route() {
  if (cleanup) { cleanup(); cleanup = null; }
  let h = location.hash || '#/';
  if (h.startsWith('#/motion')) {
    location.hash = '#/foundations';
    h = '#/foundations';
  }
  if (h === '#/sound' || h.startsWith('#/sound')) { location.hash = '#/foundations'; h = '#/foundations'; }
  if (h === '#/functions/sound') { location.hash = '#/foundations'; h = '#/foundations'; }
  if (h === '#/functions' || h.startsWith('#/functions/')) {
    location.hash = '#/special';
    h = '#/special';
  }
  if (h === '#/tokens') { location.hash = '#/foundations'; h = '#/foundations'; }
  if (h === '#/builds') { location.hash = '#/changelog'; h = '#/changelog'; }
  const i = Math.max(0, routes.findIndex((r) => r.hash === h));
  const r = routes[i];
  nav.querySelectorAll('a').forEach((a) => a.classList.toggle('on', a.getAttribute('href') === r.hash));
  const prev = routes[(i - 1 + routes.length) % routes.length];
  const next = routes[(i + 1) % routes.length];
  main.innerHTML = r.render()
    + [
      `<div class="ds-footnav"><a href="`,
      prev.hash,
      `"><small>← Prev</small>`,
      prev.label,
      `</a><a href="`,
      next.hash,
      `" style="text-align:right"><small>Next →</small>`,
      next.label,
      `</a></div>`,
    ].join('');
  const cleanups = [];
  if (r.mount) cleanups.push(r.mount(main));
  cleanups.push(mountTabs(main));
  cleanup = cleanups.length ? () => cleanups.forEach((fn) => { try { fn && fn(); } catch (_) {} }) : null;
  window.scrollTo(0, 0); refreshLive();
}
window.addEventListener('hashchange', route);
if (!location.hash) location.hash = '#/';
route();
