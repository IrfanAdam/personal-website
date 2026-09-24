/* ADAM/DS — line-tabs · horizontal tab helper · [plan:2026-09-24_140000-ds-docs-compact.md#phase-2] */
export function bindLineTabs(root, sel){
  const bar = root.querySelector(sel);
  if (!bar) return () => {};
  const on = (e) => {
    const b = e.target.closest('[data-tab]');
    if (!b) return;
    const pane = bar.closest('.ds-pane') || bar.parentElement;
    bar.querySelectorAll('[data-tab]').forEach((x) => {
      const yes = x === b;
      x.classList.toggle('on', yes);
      x.setAttribute('aria-selected', yes ? 'true' : 'false');
    });
    (pane || root).querySelectorAll('[data-tab-panel]').forEach((pn) => {
      pn.hidden = pn.dataset.tabPanel !== b.dataset.tab;
    });
  };
  bar.addEventListener('click', on);
  return () => bar.removeEventListener('click', on);
}
