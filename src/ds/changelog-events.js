/* ADAM/DS — ds/changelog-events · drawer + filter interactions ·
   [plan:2026-09-12_150255-glitch-sound.md#phase-6] */
// Exports: bindChangelogEvents — click/key wiring over shared state st (hover lives in changelog/hover.js)
import { bindHum } from './changelog-hum.js';
import { buildDeepLink } from './changelog/deep-links.js';
import { bindHover } from './changelog/hover.js';
import { revealTrack } from './changelog/tl-edges.js';
import { closeTop } from './changelog/close-top.js';
import { isMobile, stepBack } from './changelog/mobile.js';
// — Events —
// Branch order matters: specific [data-*] branches run before the generic
// .ds-chip fallthrough (the filter trigger carries .ds-chip itself).
// [plan:2026-11-02_192021-changelog-parity#phase-4]
export function bindChangelogEvents(root, st, helpers) {
  const { cur, doPaint } = helpers;
  const close = () => { if (closeTop(st)) doPaint(root); };
  const onClick = (e) => {
    if (e.target.closest('[data-day-clear]')) { st.day = ''; st.sel = [0, 0]; doPaint(root); return; }
    const dd = e.target.closest('[data-day]');
    if (dd) { st.day = st.day === dd.dataset.day ? '' : dd.dataset.day;
      st.sel = [0, 0]; doPaint(root); return; }
    const ft = e.target.closest('[data-filter-toggle]');
    if (ft) { st.filterOpen = !st.filterOpen; doPaint(root); return; }
    const ftab = e.target.closest('[data-tab]');
    if (ftab) { st.filterTab = ftab.dataset.tab; doPaint(root); return; }
    const topt = e.target.closest('[data-tag-opt]');
    if (topt) { const t = topt.dataset.tagOpt;
      if (st.active.has(t)) st.active.delete(t); else st.active.add(t);
      st.sel = [0, 0]; doPaint(root); return; }
    const sopt = e.target.closest('[data-status-opt]');
    if (sopt) { const v = sopt.dataset.statusOpt;
      if (st.status.has(v)) st.status.delete(v); else st.status.add(v);
      st.sel = [0, 0]; doPaint(root); return; }
    const tv = e.target.closest('[data-view="timeline"]');
    if (tv) { st.view = st.view === 'timeline' ? 'list' : 'timeline';
      if (st.view === 'timeline') { st.open = false; st.stage = 'list'; }
      const sel = st.view === 'timeline' ? { view: 'timeline' } : {};
      try { history.replaceState(null, '', buildDeepLink(sel)); } catch {}
      doPaint(root); return; }
    // Phone: back steps one drawer level, then closes. Desktop never shows it.
    // [plan:2026-11-02_192021-changelog-parity.md#phase-10]
    if (e.target.closest('[data-mback]')) {
      if (stepBack(st)) { st.stage = 'list'; doPaint(root); } else close();
      return;
    }
    if (e.target.closest('[data-tl-close],[data-close],[data-scrim]')) { close(); return; }
    const te = e.target.closest('[data-tl-edge]');
    if (te) { const row = te.closest('[data-tl-row]');
      if (row) revealTrack(row, te.dataset.tlEdge);
      return; }
    const to = e.target.closest('[data-tl-open]');
    if (to) { const c = cur();
      const i = c.list.findIndex((p) => p.file === to.dataset.tlOpen);
      if (i > -1) { st.sel = [i, 0]; st.open = true;
        st.stage = isMobile() ? 'list' : 'tasks'; }
      const sc = root.querySelector('.ds-tl-scroll');
      st.tlScroll = sc ? sc.scrollLeft : 0;
      st.returnView = st.view;
      st.view = 'list';
      doPaint(root); return; }
    const chip = e.target.closest('.ds-chip');
    if (chip) { const t = chip.dataset.tag;
      if (!t) { st.active = new Set();
        st.status = new Set();
        st.day = '';
      } else { st.active.has(t) ? st.active.delete(t) : st.active.add(t);
      } st.sel = [0, 0]; doPaint(root); return; }
    if (e.target.closest('[data-back]')) { st.stage = 'list'; doPaint(root); return; }
    const b = e.target.closest('.ds-pick'); if (!b) return;
    const col = b.closest('[data-col]'), i = [...col.querySelectorAll('.ds-pick')].indexOf(b);
    if (col.dataset.col === 'plan') { st.sel = [i,
        i === st.sel[0] ? st.sel[1] : 0]; st.open = true;
      st.stage = isMobile() ? 'list' : 'tasks'; } else { st.sel = [st.sel[0],
        i]; st.stage = 'tasks'; }
    doPaint(root);
  };
  const onKey = (e) => {
    const box = e.key === 'Enter' && e.target.closest('[data-tag-opt] input,[data-status-opt] input');
    if (box) { e.preventDefault(); box.click(); }
    else if (e.key === 'Escape') close();
  };
  const offHum = bindHum(root);
  const offHover = bindHover(root);
  const onDocClick = (e) => {
    if (!st.filterOpen) return;
    if (e.target.closest('[data-filter-drawer],[data-filter-toggle]')) return;
    st.filterOpen = false;
    doPaint(root);
  };
  root.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  document.addEventListener('click', onDocClick);
  return () => {
    offHum();
    offHover();
    root.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('click', onDocClick);
  };
}
