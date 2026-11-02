/* ADAM/DS — ds/changelog/hover · cursor tip + timeline popover · [plan:2026-11-02_192021-changelog-parity#phase-4] */
// Exports: bindHover — mousemove/leave wiring, popover + tip share one placer
const popLines = (pop) => {
  const out = [];
  if (pop.dataset.span) out.push(pop.dataset.span);
  if (pop.dataset.cm) out.push(`${pop.dataset.cm} commits`);
  if (pop.dataset.due) out.push(`Due ${pop.dataset.due}`);
  return out;
};
const placeNear = (el, x, y) => {
  const pad = 14;
  let ax = x + pad, ay = y + pad;
  const r = el.getBoundingClientRect();
  if (ax + r.width > innerWidth - 8) ax = x - r.width - pad;
  if (ay + r.height > innerHeight - 8) ay = y - r.height - pad;
  el.style.left = ax + 'px';
  el.style.top = ay + 'px';
};
const paintPop = (pv, pop) => {
  pv.replaceChildren();
  const b = document.createElement('b');
  b.textContent = pop.dataset.pop || '';
  pv.appendChild(b);
  popLines(pop).forEach((line) => {
    const s = document.createElement('span');
    s.textContent = line;
    pv.appendChild(s);
  });
};
// [plan:2026-11-02_192021-changelog-parity#phase-4]
export const bindHover = (root) => {
  const move = (e) => {
    const pv = root.querySelector('[data-tl-pop]');
    if (pv) {
      const pop = e.target.closest('[data-pop]');
      if (!pop) pv.hidden = true;
      else {
        paintPop(pv, pop);
        pv.hidden = false;
        placeNear(pv, e.clientX, e.clientY);
      }
    }
    const el = e.target.closest('[data-tip]');
    const tip = root.querySelector('.ds-cursor-tip');
    if (!tip) return;
    if (!el) { tip.hidden = true; return; }
    tip.textContent = el.dataset.tip;
    tip.hidden = false;
    placeNear(tip, e.clientX, e.clientY);
  };
  const hideTip = () => {
    const t = root.querySelector('.ds-cursor-tip');
    if (t) t.hidden = true;
    const pv = root.querySelector('[data-tl-pop]');
    if (pv) pv.hidden = true;
  };
  root.addEventListener('mousemove', move);
  document.addEventListener('mouseleave', hideTip);
  return () => {
    root.removeEventListener('mousemove', move);
    document.removeEventListener('mouseleave', hideTip);
  };
};
