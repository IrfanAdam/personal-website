/* ADAM/APP — route-load · lazy route chunks + paint · [plan:2026-09-28_130000-code-cleanup-perf.md#phase-2] */
// Exports: loadRoute, paintRoute, syncTabs
import { Masonry, mountMasonry, setView } from '../views/masonry.js';
import { syncHeaderFrames, centerActiveThumb } from '../views/headerFrame.js';
import { syncStripMode } from '../views/stripbar.js';
import { syncSettingsPop } from '../views/settings-menu.js';
import { takeTransit, flyTransit } from '../views/transit.js';

// — Loader —
const loaders = {
  project: () => import('../views/project.js'),
  contact: () => import('../views/contact.js'),
  map: () => import('../views/map/index.js'),
  lab: () => import('../views/minimal-lab.js'),
};
const cache = new Map();
export function loadRoute(name) {
  if (!cache.has(name)) cache.set(name, loaders[name]());
  return cache.get(name);
}

// — Tabs —
export function syncTabs(st) {
  const tabs = st.vtabs || [];
  tabs.forEach((b) => b.classList.toggle('on', b.dataset.vtab === st.masonryView));
  syncHeaderFrames();
}

// — Paint —
export async function paintRoute(st, live) {
  const { root, stripLinks, closeBtn } = st;
  const h = location.hash || '#/';
  if (h === '#/') {
    st.masonryView = 'list';
    location.hash = '#/masonry';
    return;
  }
  window.scrollTo(0, 0);
  if (st.cleanup) {
    st.cleanup();
    st.cleanup = null;
  }
  document.querySelectorAll('body > footer').forEach((n) => n.remove());
  const slug = h.startsWith('#/projects/') ? h.split('/')[2] : '';
  const contact = h.startsWith('#/contact');
  const isProject = h.startsWith('#/projects/');
  syncStripMode(isProject, st.masonryView, closeBtn);
  syncSettingsPop();
  stripLinks.forEach((a) => {
    const href = a.getAttribute('href');
    const on = href === `#/projects/${slug}` || (contact && href === '#/contact');
    a.classList.toggle('on', on);
  });
  if (isProject) {
    const { Project, mountProject } = await loadRoute('project');
    if (!live()) return;
    const transit = takeTransit(slug);
    root.innerHTML = Project(slug);
    const hero = root.querySelector('.case .hero-box');
    if (transit && hero) hero.setAttribute('data-reveal', 'replay');
    st.cleanup = mountProject(root);
    if (transit) flyTransit(transit, root);
  } else if (h.startsWith('#/lab/architecture')) {
    const { MapView, mountMap } = await loadRoute('map');
    if (!live()) return;
    root.innerHTML = MapView();
    st.cleanup = mountMap(root);
  } else if (h.startsWith('#/minimal-lab')) {
    const { MinimalLab } = await loadRoute('lab');
    if (!live()) return;
    root.innerHTML = MinimalLab();
  } else if (contact) {
    const { Contact, mountContact } = await loadRoute('contact');
    if (!live()) return;
    root.innerHTML = Contact();
    st.cleanup = mountContact(root);
  } else {
    setView(st.masonryView);
    root.innerHTML = Masonry();
    st.cleanup = mountMasonry(root);
    syncStripMode(false, st.masonryView, closeBtn);
    syncSettingsPop();
  }
  const foot = root.querySelector(':scope > footer');
  if (foot) document.body.appendChild(foot);
  syncTabs(st);
  centerActiveThumb();
}
