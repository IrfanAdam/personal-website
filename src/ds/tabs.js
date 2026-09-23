/* ADAM/DS — tabs shell · [plan:2026-09-23_130000-ds-understandable-mutable.md#phase-1] */
// Exports: tabs, mountTabs — click + keyboard (Arrow/Home/End), roving tabindex
const reg = (window.__tabsReg = window.__tabsReg || {});
export function tabs({ panes = [], initial = 0, vertical = false, variant = '' } = {}) {
  const id = 'tabs-' + Math.random().toString(36).slice(2, 6);
  reg[id] = { panes, initial };
  const btns = panes.map((p, i) => [
    `<button class="ds-tab`,
    i === initial ? ' on' : '',
    `" role="tab" aria-selected="`,
    i === initial,
    `" tabindex="`,
    i === initial ? '0' : '-1',
    `" data-tab="`,
    i,
    `" data-tabs="`,
    id,
    `">`,
    p.label,
    `</button>`,
  ].join('')).join('');
  const bodies = panes.map((p, i) => [
    `<div class="ds-pane" role="tabpanel" data-pane="`,
    i,
    `" data-tabs="`,
    id,
    `"`,
    i === initial ? '' : ' hidden',
    `>`,
    p.html,
    `</div>`,
  ].join('')).join('');
  return [
    `<div class="ds-tabs`,
    vertical ? ' vert' : '',
    `" data-tabs-root="`,
    id,
    `"><div class="ds-tablist${variant === 'line' ? ' ds-tablist--line' : ''}" role="tablist"`,
    vertical ? ' aria-orientation="vertical"' : '',
    `>`,
    btns,
    `</div><div class="ds-panes">`,
    bodies,
    `</div></div>`,
  ].join('');
}
export function mountTabs(root) {
  const offs = [];
  root.querySelectorAll('[data-tabs-root]').forEach((box) => {
    const id = box.getAttribute('data-tabs-root');
    const btns = [...box.querySelectorAll(`[data-tab][data-tabs="${id}"]`)];
    const panes = [...box.querySelectorAll(`[data-pane][data-tabs="${id}"]`)];
    if (!btns.length) return;
    const isVert = box.classList.contains('vert');
    const select = (n) => {
      btns.forEach((b, i) => {
        b.classList.toggle('on', i === n);
        b.setAttribute('aria-selected', i === n ? 'true' : 'false');
        b.setAttribute('tabindex', i === n ? '0' : '-1');
      });
      panes.forEach((p, i) => { if (i === n) p.removeAttribute('hidden'); else p.setAttribute('hidden', ''); });
    };
    const onClick = (e) => {
      const b = e.target.closest(`[data-tab][data-tabs="${id}"]`);
      if (!b) return;
      select(Number(b.dataset.tab));
    };
    const onKey = (e) => {
      const b = e.target.closest(`[data-tab][data-tabs="${id}"]`);
      if (!b) return;
      const cur = btns.indexOf(b);
      let nxt = -1;
      if (!isVert && e.key === 'ArrowRight') nxt = (cur + 1) % btns.length;
      else if (!isVert && e.key === 'ArrowLeft') nxt = (cur - 1 + btns.length) % btns.length;
      else if (isVert && e.key === 'ArrowDown') nxt = (cur + 1) % btns.length;
      else if (isVert && e.key === 'ArrowUp') nxt = (cur - 1 + btns.length) % btns.length;
      else if (e.key === 'Home') nxt = 0;
      else if (e.key === 'End') nxt = btns.length - 1;
      else return;
      e.preventDefault();
      select(nxt);
      btns[nxt].focus();
    };
    box.addEventListener('click', onClick);
    box.addEventListener('keydown', onKey);
    offs.push(() => box.removeEventListener('click', onClick));
    offs.push(() => box.removeEventListener('keydown', onKey));
  });
  return () => offs.forEach((fn) => fn());
}
