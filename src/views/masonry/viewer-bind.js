/* ADAM/PAGE — views/masonry/viewer-bind · bind · [plan:2026-09-22_141500-housekeeping-refactor.md#phase-1] */
// Exports: bindViewer — wires card/grid/scroll/resize + image fallback
import { targetY, placeViewerNear } from './viewer-markup.js';
import { attachRefresh } from './viewer-bind-refresh.js';

export function bindViewer(o) {
  const { grid, cards, els, state, cfg, paint, kick, schedulePaint, setTgt } = o;
  const { vimg } = els;
  const getState = () => state;
  const { teardown: teardownRefresh } = attachRefresh({ getState, cfg, els, paint, kick });
  const enter = (e) => {
    const next = e.currentTarget;
    o.cancelHide(); o.clearIdle();
    state.card = next;
    state.rect = state.card.getBoundingClientRect();
    const img = state.card.querySelector('img');
    const src = state.card.dataset.mock || (img && (img.currentSrc || img.src));
    if (src) { vimg.src = src; if (img) vimg.alt = img.alt; }
    state.vh = els.viewerEl.offsetHeight || 220;
    state.cx = e.clientX; state.cy = e.clientY;
    state.enterX = state.cx; state.enterY = state.cy;
    state.portalOn = false;
    els.viewerEl.classList.remove('on'); els.svg.classList.remove('on');
    const p = placeViewerNear(state.rect, state.cx, cfg.VW, cfg.VGAP, cfg.VPAD);
    state.vx = p.x; state.side = p.side;
    state.cur = targetY(state.cy, state.rect, state.vh);
    state.tgt = state.cur; state.vel = 0;
    paint(); o.showCursor(); kick();
  };
  const move = (e) => {
    if (!state.card) return;
    o.cancelHide();
    state.cx = e.clientX; state.cy = e.clientY;
    setTgt(targetY(state.cy, state.rect, state.vh));
    o.checkThreshold(); if (state.portalOn) o.armIdle();
    schedulePaint();
  };
  const leave = () => o.scheduleHide();
  const onGridMove = (e) => {
    if (!state.cursorOn) return;
    state.cx = e.clientX; state.cy = e.clientY;
    const over = !!e.target.closest('.card');
    if (state.card && state.rect) {
      setTgt(targetY(state.cy, state.rect, state.vh));
      if (over) o.checkThreshold();
      if (state.portalOn) o.armIdle();
    }
    if (!over) o.scheduleHide(); else o.cancelHide();
    schedulePaint();
  };
  const onGridLeave = () => o.scheduleHide();
  cards.forEach((c) => {
    c.addEventListener('mouseenter', enter, { passive: true });
    c.addEventListener('mousemove', move, { passive: true });
    c.addEventListener('mouseleave', leave, { passive: true });
  });
  grid.addEventListener('mousemove', onGridMove, { passive: true });
  grid.addEventListener('mouseleave', onGridLeave, { passive: true });
  return () => {
    cards.forEach((c) => {
      c.removeEventListener('mouseenter', enter);
      c.removeEventListener('mousemove', move);
      c.removeEventListener('mouseleave', leave);
    });
    grid.removeEventListener('mousemove', onGridMove);
    grid.removeEventListener('mouseleave', onGridLeave);
    teardownRefresh();
  };
}
