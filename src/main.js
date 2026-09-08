import { Masonry, mountMasonry, setView } from './views/masonry.js';
import { Project, mountProject } from './views/project.js';
import { Contact, mountContact } from './views/contact.js';
import { stripItems, viewTabs } from './views/shared.js';
import { syncHeaderFrames, centerActiveThumb } from './views/headerFrame.js';
import { initTheme } from './theme.js';

const root = document.getElementById('app');
const header = document.querySelector('.top');
const stripbar = document.getElementById('stripbar');
stripbar.innerHTML = `<div class="strip" id="strip">${viewTabs()}${stripItems()}<span class="tab-frame" id="tabframe" aria-hidden="true"></span></div>`
  + `<div class="strip-meta"><div class="theme-switch" id="themeSwitch"><button class="pill" data-theme-btn="system">system</button><button class="pill" data-theme-btn="light">light</button><button class="pill" data-theme-btn="dark">dark</button></div><span class="hint" id="count">14 stories</span></div>`;
initTheme();
const vtabs = [...stripbar.querySelectorAll('[data-vtab]')];
const stripLinks = [...stripbar.querySelectorAll('.strip a')];
let cleanup = null;
let masonryView = 'grid'; // 'grid' | 'list'

function setHeaderH() {
  document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
}
setHeaderH();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(setHeaderH);
window.addEventListener('resize', setHeaderH);
new ResizeObserver(setHeaderH).observe(header);

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let lastY = window.scrollY;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header.classList.toggle('hide', y > 120 && y > lastY);
      lastY = y;
      ticking = false;
    });
  }, { passive: true });
}

function syncThemeSwitch() {
  const el = document.getElementById('themeSwitch');
  if (!el) return;
  const h = location.hash || '#/masonry';
  const isMasonry = h === '#/masonry' || h === '#/';
  el.style.display = isMasonry && masonryView === 'list' ? 'flex' : 'none';
}
function syncTabs() {
  vtabs.forEach((b) => b.classList.toggle('on', b.dataset.vtab === masonryView));
  syncThemeSwitch();
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
  } else if (h.startsWith('#/contact')) {
    root.innerHTML = Contact();
    cleanup = mountContact(root);
  } else {
    setView(masonryView);
    root.innerHTML = Masonry();
    cleanup = mountMasonry(root);
  }
  syncTabs();
  syncThemeSwitch();
  centerActiveThumb();
}
window.addEventListener('hashchange', route);
window.addEventListener('resize', () => requestAnimationFrame(syncHeaderFrames));
window.addEventListener('load', syncHeaderFrames);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncHeaderFrames);
if (!location.hash) location.hash = '#/masonry';
route();
