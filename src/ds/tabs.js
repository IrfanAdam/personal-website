/* ADAM/DS — tabs shell. One tab container every component/function reuses.
   panes: [{ label, html }] → tablist + panels. Preview-first default.
   Mount via mountTabs(root); cleanup returned. ≤100 lines. */
const reg = (window.__tabsReg = window.__tabsReg || {});
export function tabs({ panes = [], initial = 0, vertical = false } = {}) {
  const id = 'tabs-' + Math.random().toString(36).slice(2, 6);
  reg[id] = { panes, initial };
  const btns = panes.map((p, i) => `<button class="ds-tab${i === initial ? ' on' : ''}" role="tab" aria-selected="${i === initial}" data-tab="${i}" data-tabs="${id}">${p.label}</button>`).join('');
  const bodies = panes.map((p, i) => `<div class="ds-pane" role="tabpanel" data-pane="${i}" data-tabs="${id}"${i === initial ? '' : ' hidden'}>${p.html}</div>`).join('');
  return `<div class="ds-tabs${vertical ? ' vert' : ''}" data-tabs-root="${id}"><div class="ds-tablist" role="tablist"${vertical ? ' aria-orientation="vertical"' : ''}>${btns}</div><div class="ds-panes">${bodies}</div></div>`;
}
export function mountTabs(root) {
  const offs = [];
  root.querySelectorAll('[data-tabs-root]').forEach((box) => {
    const id = box.getAttribute('data-tabs-root');
    const btns = [...box.querySelectorAll(`[data-tab][data-tabs="${id}"]`)];
    const panes = [...box.querySelectorAll(`[data-pane][data-tabs="${id}"]`)];
    if (!btns.length) return;
    const select = (n) => {
      btns.forEach((b, i) => { b.classList.toggle('on', i === n); b.setAttribute('aria-selected', i === n ? 'true' : 'false'); });
      panes.forEach((p, i) => { if (i === n) p.removeAttribute('hidden'); else p.setAttribute('hidden', ''); });
    };
    const onClick = (e) => {
      const b = e.target.closest(`[data-tab][data-tabs="${id}"]`);
      if (!b) return;
      select(Number(b.dataset.tab));
    };
    box.addEventListener('click', onClick);
    offs.push(() => box.removeEventListener('click', onClick));
  });
  return () => offs.forEach((fn) => fn());
}
