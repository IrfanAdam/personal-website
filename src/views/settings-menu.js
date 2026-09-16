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
  const allBtns = () => [btn, document.getElementById('fSettingsBtn')].filter(Boolean);
  const sync = (expanded) => {
    allBtns().forEach((b) => b.setAttribute('aria-expanded', expanded ? 'true' : 'false'));
  };
  const syncPos = () => {
    const mobile = window.innerWidth <= 640;
    if (mobile) {
      if (pop.parentElement !== document.body) document.body.appendChild(pop);
    } else {
      const smenu = bar.querySelector('.smenu') || document.querySelector('.smenu');
      if (smenu && pop.parentElement !== smenu) smenu.appendChild(pop);
    }
  };
  syncPos();
  const close = (focus) => {
    pop.hidden = true;
    backdrop.hidden = true;
    sync(false);
    if (focus) btn.focus();
  };
  const open = () => {
    syncPos();
    const mobile = window.innerWidth <= 640;
    pop.hidden = false;
    backdrop.hidden = !mobile;
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
    if (pop.contains(e.target)) return;
    if (btn.contains(e.target)) return;
    if (e.target.closest('#smenuPop')) return;
    close(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !pop.hidden) close(true);
  });
  window.addEventListener('resize', syncPos);
}

// — Section: reposition —
export function syncSettingsPop() {}
