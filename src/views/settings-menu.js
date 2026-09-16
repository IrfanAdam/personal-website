/* ADAM/SHARED — views/settings-menu · gear dropdown · [plan:2026-09-15_100000-mobile-optimisation.md#phase-1] */
// Exports: initSettingsMenu, syncSettingsPop
// — Section: toggle —
export function initSettingsMenu(bar) {
  const btn = bar.querySelector('#settingsBtn');
  const pop = bar.querySelector('#smenuPop');
  if (!btn || !pop) return;
  let backdrop = document.getElementById('smenuBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'smenuBackdrop';
    backdrop.className = 'smenu-backdrop';
    backdrop.hidden = true;
    document.body.appendChild(backdrop);
  }
  // move pop to body so fixed center escapes header backdrop-filter
  if (pop.parentElement !== document.body) document.body.appendChild(pop);
  const allBtns = () => [btn, document.getElementById('fSettingsBtn')].filter(Boolean);
  const sync = (expanded) => {
    allBtns().forEach((b) => b.setAttribute('aria-expanded', expanded ? 'true' : 'false'));
  };
  const close = (focus) => {
    pop.hidden = true;
    backdrop.hidden = true;
    sync(false);
    if (focus) btn.focus();
  };
  const open = () => {
    pop.hidden = false;
    backdrop.hidden = false;
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
  backdrop.addEventListener('click', () => close(false));
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
