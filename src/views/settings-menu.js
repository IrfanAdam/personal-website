/* ADAM/SHARED — views/settings-menu · gear dropdown · [plan:2026-09-15_100000-mobile-optimisation.md#phase-1] */
// Exports: initSettingsMenu, syncSettingsPop
// — Section: toggle —
export function initSettingsMenu(bar) {
  const btn = bar.querySelector('#settingsBtn');
  const pop = bar.querySelector('#smenuPop');
  if (!btn || !pop) return;
  const allBtns = () => [btn, document.getElementById('fSettingsBtn')].filter(Boolean);
  const sync = (expanded) => {
    allBtns().forEach((b) => b.setAttribute('aria-expanded', expanded ? 'true' : 'false'));
  };
  const close = (focus) => {
    pop.hidden = true;
    sync(false);
    if (focus) btn.focus();
  };
  const open = () => {
    pop.hidden = false;
    sync(true);
  };
  const toggle = () => {
    if (pop.hidden) open();
    else close(false);
  };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle();
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('#fSettingsBtn')) {
      e.stopPropagation();
      toggle();
      return;
    }
    if (pop.hidden) return;
    if (bar.contains(e.target)) return;
    if (e.target.closest('#filtersBar')) return;
    close(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !pop.hidden) close(true);
  });
}

// — Section: reposition —
export function syncSettingsPop() {
  const pop = document.getElementById('smenuPop');
  const wrap = document.getElementById('fWrap');
  const smenu = document.querySelector('.smenu');
  if (!pop || !smenu) return;
  const mobile = window.innerWidth <= 640;
  const isList = document.body.dataset.view === 'list';
  const shouldMove = mobile && isList && wrap;
  if (shouldMove && pop.parentElement !== wrap) wrap.appendChild(pop);
  else if (!shouldMove && pop.parentElement !== smenu) smenu.appendChild(pop);
}
