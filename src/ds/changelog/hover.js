/* ADAM/DS — ds/changelog/hover · cursor tip + lane popover ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-4] */
// Exports: bindHover — one mousemove pass: structured lane popover + plain tip
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));
const scopeOf = (d) => {
  const bits = [];
  if (d.ph) bits.push(`<b>${esc(d.ph)}</b> phases`);
  if (d.tk) bits.push(`<b>${esc(d.tk)}</b> tasks`);
  if (!bits.length) return '';
  return `<span class="ds-tl-pop__scope">${bits.join(' · ')}</span>`;
};
const statsOf = (d) => {
  const bits = [];
  if (d.cm) bits.push(`${esc(d.cm)} commits`);
  if (d.rv) bits.push(esc(d.rv));
  return bits.join(' · ');
};
// Lane popover: title, goal, scope, status, stats, due, range — same order and
// wording as the drawer rail, so hovering a bar previews what clicking opens.
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
const paintPop = (pv, el) => {
  const d = el.dataset;
  const stats = statsOf(d);
  pv.innerHTML = [
    `<b class="ds-tl-pop__title">${esc(d.pop)}</b>`,
    d.desc ? `<span class="ds-tl-pop__desc">${esc(d.desc)}</span>` : '',
    scopeOf(d),
    d.st ? `<span class="ds-tl-pop__status">${esc(d.st)}</span>` : '',
    stats ? `<span class="ds-tl-pop__stats">${stats}</span>` : '',
    d.due ? `<span class="ds-tl-pop__due">Due ${esc(d.due)}</span>` : '',
    d.span ? `<span class="ds-tl-pop__date">${esc(d.span)}</span>` : '',
  ].join('');
};
const place = (el, x, y, pad) => {
  el.style.left = '-9999px';
  el.style.top = '0px';
  const r = el.getBoundingClientRect();
  let px = x + pad, py = y + pad;
  if (px + r.width > innerWidth - 8) px = x - r.width - pad;
  if (py + r.height > innerHeight - 8) py = y - r.height - pad;
  px = Math.min(px, innerWidth - r.width - 8);
  py = Math.min(py, innerHeight - r.height - 8);
  el.style.left = `${Math.max(8, px)}px`;
  el.style.top = `${Math.max(8, py)}px`;
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-10]
export const bindHover = (root) => {
  const move = (e) => {
    // Touch never fires a leave, so a tap-painted tip would latch forever:
    // pointer-gate the whole pass instead of deleting the desktop hover.
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const pv = root.querySelector('[data-tl-pop]');
    if (pv) {
      const pop = e.target.closest('[data-pop]');
      if (!pop || !pop.dataset.desc) pv.hidden = true;
      else { paintPop(pv, pop); pv.hidden = false; place(pv, e.clientX, e.clientY, 10); }
    }
    const el = e.target.closest('[data-tip]');
    const tip = root.querySelector('.ds-cursor-tip');
    if (!tip) return;
    if (!el) { tip.hidden = true; return; }
    tip.textContent = el.dataset.tip;
    tip.hidden = false;
    place(tip, e.clientX, e.clientY, 14);
  };
  const hide = () => {
    const t = root.querySelector('.ds-cursor-tip');
    if (t) t.hidden = true;
    const pv = root.querySelector('[data-tl-pop]');
    if (pv) pv.hidden = true;
  };
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerdown', hide);
  document.addEventListener('pointerleave', hide);
  return () => {
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerdown', hide);
    document.removeEventListener('pointerleave', hide);
  };
};
