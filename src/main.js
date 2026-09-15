/* ADAM/APP — app boot · router + strip + theme init · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
import { Masonry, mountMasonry, setView } from './views/masonry.js';
import { Project, mountProject } from './views/project.js';
import { Contact, mountContact } from './views/contact.js';
import { stripItems, viewTabs } from './views/shared.js';
import { MapView, mountMap } from './views/map/index.js';
import { MinimalLab } from './views/minimal-lab.js';
import { syncHeaderFrames, centerActiveThumb } from './views/headerFrame.js';
import { initTheme } from './theme.js';
import { initChrome } from './boot-chrome.js';
import { initSettingsMenu } from './views/settings-menu.js';
import './views/init-sound.js';

const root = document.getElementById('app');
const header = document.querySelector('.top');
const stripbar = document.getElementById('stripbar');
stripbar.innerHTML = [
  `<div class="strip" id="strip">`,
  viewTabs(),
  stripItems(),
  `<span class="tab-frame" id="tabframe" aria-hidden="true"></span></div>`,
].join('')
  + [
    `<div class="smenu"><button class="pill smenu-btn"`,
    ` id="settingsBtn" aria-haspopup="true" aria-expanded="false"`,
    ` aria-controls="smenuPop" title="Settings">⚙</button>`,
    `<div class="smenu-pop" id="smenuPop" hidden><div class="theme-switch" id="themeSwitch">`,
    `<button class="pill" data-theme-btn="system">system</button>`,
    `<button class="pill" data-theme-btn="light">light</button>`,
    `<button class="pill" data-theme-btn="dark">dark</button></div>`,
    `<div id="soundSlot"></div><span class="hint" id="count">14 stories</span>`,
    `</div></div>`,
  ].join('');
initSettingsMenu(stripbar);
initTheme();
const vtabs = [...stripbar.querySelectorAll('[data-vtab]')];
const stripLinks = [...stripbar.querySelectorAll('.strip a')];
let cleanup = null;
let masonryView = 'grid'; // 'grid' | 'list'

initChrome(header);

function syncTabs() {
  vtabs.forEach((b) => b.classList.toggle('on', b.dataset.vtab === masonryView));
  syncHeaderFrames();
}

function showMasonry(view) {
  masonryView = view;
  if (location.hash !== '#/masonry') location.hash = '#/masonry';
  else route();
  syncTabs();
}

vtabs.forEach((b) => b.addEventListener('click', () => showMasonry(b.dataset.vtab)));

function route() {
  const h = location.hash || '#/';
  if (h === '#/') {
    masonryView = 'list';
    location.hash = '#/masonry';
    return;
  }
  window.scrollTo(0, 0);
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
  const slug = h.startsWith('#/projects/') ? h.split('/')[2] : '';
  const contact = h.startsWith('#/contact');
  stripLinks.forEach((a) => {
    const href = a.getAttribute('href');
    a.classList.toggle('on', href === `#/projects/${slug}` || (contact && href === '#/contact'));
  });
  if (h.startsWith('#/projects/')) {
    root.innerHTML = Project(h.split('/')[2]);
    cleanup = mountProject(root);
  } else if (h.startsWith('#/lab/architecture')) {
    root.innerHTML = MapView();
    cleanup = mountMap(root);
  } else if (h.startsWith('#/minimal-lab')) {
    root.innerHTML = MinimalLab();
  } else if (h.startsWith('#/contact')) {
    root.innerHTML = Contact();
    cleanup = mountContact(root);
  } else {
    setView(masonryView);
    root.innerHTML = Masonry();
    cleanup = mountMasonry(root);
  }
  syncTabs();
  centerActiveThumb();
}
window.addEventListener('hashchange', route);
window.addEventListener('resize', () => requestAnimationFrame(syncHeaderFrames));
window.addEventListener('load', syncHeaderFrames);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncHeaderFrames);
if (!location.hash) location.hash = '#/masonry';
route();
