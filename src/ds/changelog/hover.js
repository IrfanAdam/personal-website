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
// Lane popover: title, goal, scope, stats, one date line — same wording as the
// drawer rail, so hovering a bar previews what clicking opens.
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
const paintPop = (pv, el) => {
  const d = el.dataset;
  const stats = statsOf(d);
  pv.innerHTML = [
    `<b class="ds-tl-pop__title">${esc(d.pop)}</b>`,
    d.desc ? `<span class="ds-tl-pop__desc">${esc(d.desc)}</span>` : '',
    scopeOf(d),
    stats ? `<span class="ds-tl-pop__stats">${stats}</span>` : '',
    d.dates ? `<span class="ds-tl-pop__date">${esc(d.dates)}</span>` : '',
  ].join('');
};
// Identity of a painted card: same node + same payload → nothing to rewrite,
// so a lane-wide sweep repaints once per row instead of once per mousemove.
const sigOf = (el) => {
  const d = el.dataset;
  return [d.pop, d.desc, d.ph, d.tk, d.cm, d.rv, d.dates].join('\u0001');
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
  let card = null; // { pv, el, sig } — the card currently on screen
  const move = (e) => {
    // Touch never fires a leave, so a tap-painted tip would latch forever:
    // pointer-gate the whole pass instead of deleting the desktop hover.
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const pv = root.querySelector('[data-tl-pop]');
    if (pv) {
      // Anywhere on a lane previews its plan: every bar carries the same lane
      // payload, so the row's label stands in for the empty grid around them.
      const row = e.target.closest('[data-tl-row]');
      const pop = e.target.closest('[data-pop]') || (row && row.querySelector('[data-pop]'));
      if (!pop) { pv.hidden = true; card = null; }
      else {
        const sig = sigOf(pop);
        if (!card || card.pv !== pv || card.el !== pop || card.sig !== sig) {
          paintPop(pv, pop);
          card = { pv, el: pop, sig };
        }
        pv.hidden = false;
        place(pv, e.clientX, e.clientY, 10);
      }
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
