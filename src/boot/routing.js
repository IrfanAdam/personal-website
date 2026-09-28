/* ADAM/APP — routing · masonry view + hash router · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
// Exports: initRouting — masonry eager, project/contact/map/lab lazy
import { paintRoute, syncTabs } from './route-load.js';
import { syncStripMode } from '../views/stripbar.js';
import { syncSettingsPop } from '../views/settings-menu.js';
import { syncHeaderFrames } from '../views/headerFrame.js';

// — Router —
export function initRouting({ root, vtabs, stripLinks, closeBtn }) {
  const st = { root, vtabs, stripLinks, closeBtn, cleanup: null, masonryView: 'grid' };
  let nav = 0;

  function showMasonry(view) {
    st.masonryView = view;
    if (location.hash !== '#/masonry') location.hash = '#/masonry';
    else route();
    syncTabs(st);
  }

  vtabs.forEach((b) => b.addEventListener('click', () => showMasonry(b.dataset.vtab)));
  if (closeBtn) closeBtn.addEventListener('click', () => { location.hash = '#/masonry'; });

  async function route() {
    const my = ++nav;
    const live = () => my === nav;
    try {
      await paintRoute(st, live);
    } catch {
      if (!live()) return;
      if (location.hash !== '#/masonry') location.hash = '#/masonry';
    }
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('resize', () => {
    const isProject = location.hash.startsWith('#/projects/');
    syncStripMode(isProject, st.masonryView, closeBtn);
    syncSettingsPop();
    requestAnimationFrame(syncHeaderFrames);
  });
  window.addEventListener('load', syncHeaderFrames);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncHeaderFrames);
  if (!location.hash) location.hash = '#/masonry';
  route();
}
