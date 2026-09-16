/* ADAM/SHARED — views/stripbar · strip helper · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
// Exports: initStripbar, syncStripMode
// — Section: markup —
import { stripItems, viewTabs } from './shared.js';
import { initSettingsMenu } from './settings-menu.js';
import { initTheme } from '../theme.js';

export function initStripbar(stripbar) {
  stripbar.innerHTML = [
    `<div class="strip" id="strip">`,
    viewTabs(),
    stripItems(),
    `<span class="tab-frame" id="tabframe" aria-hidden="true"></span>`,
    `</div>`,
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
  const links = [...stripbar.querySelectorAll('.strip a')];
  const closeBtn = stripbar.querySelector('#closeBtn');
  return { vtabs, stripLinks: links, closeBtn };
}

// — Section: mode sync —
export function syncStripMode(isProject, masonryView, closeBtn) {
  document.body.dataset.view = masonryView;
  document.body.dataset.route = isProject ? 'project' : 'masonry';
  if (!closeBtn) return;
  const mobile = window.innerWidth <= 640;
  closeBtn.hidden = !(isProject && mobile);
}
