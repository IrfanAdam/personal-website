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
    pop.style.removeProperty('top');
    pop.style.removeProperty('right');
    pop.style.removeProperty('left');
    pop.style.removeProperty('bottom');
    if (focus) btn.focus();
  };
  const open = () => {
    pop.hidden = false;
    sync(true);
    const mobile = window.innerWidth <= 640;
    const isList = document.body.dataset.view === 'list';
    if (mobile && isList) {
      const fBtn = document.getElementById('fSettingsBtn');
      if (fBtn) {
        const r = fBtn.getBoundingClientRect();
        pop.style.position = 'fixed';
        pop.style.top = `${r.bottom + 8}px`;
        pop.style.right = `${Math.max(12, window.innerWidth - r.right)}px`;
        pop.style.left = 'auto';
        pop.style.bottom = 'auto';
      }
    }
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
export function syncSettingsPop() {}
