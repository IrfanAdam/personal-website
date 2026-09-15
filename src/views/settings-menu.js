/* ADAM/SHARED — views/settings-menu · gear dropdown · [plan:2026-09-15_100000-mobile-optimisation.md#phase-1] */
// Exports: initSettingsMenu(stripbar) — toggles hidden + aria-expanded
// — Section: toggle —
export function initSettingsMenu(bar) {
  const btn = bar.querySelector('#settingsBtn');
  const pop = bar.querySelector('#smenuPop');
  if (!btn || !pop) return;
  const close = (focus) => {
    pop.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    if (focus) btn.focus();
  };
  const open = () => {
    pop.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  };
  btn.addEventListener('click', () => {
    if (pop.hidden) open();
    else close(false);
  });
  document.addEventListener('click', (e) => {
    if (pop.hidden) return;
    if (bar.contains(e.target)) return;
    close(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !pop.hidden) close(true);
  });
}
