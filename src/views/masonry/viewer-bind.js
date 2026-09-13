/* ADAM/PAGE — views/masonry/viewer-bind · bind · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: bindViewer — wires card/grid/scroll/resize + image fallback
import { targetY, placeViewerNear } from './viewer-markup.js';
export function bindViewer(o) {
  const { grid, cards, els, state, cfg, paint, kick, schedulePaint } = o;
  const { vimg } = els;
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
    state.tgt = targetY(state.cy, state.rect, state.vh);
    o.checkThreshold(); if (state.portalOn) o.armIdle();
    schedulePaint();
  };
  const leave = () => o.scheduleHide();
  const onGridMove = (e) => {
    if (!state.cursorOn) return;
    state.cx = e.clientX; state.cy = e.clientY;
    const over = !!e.target.closest('.card');
    if (state.card && state.rect) {
      state.tgt = targetY(state.cy, state.rect, state.vh);
      if (over) o.checkThreshold();
      if (state.portalOn) o.armIdle();
    }
    if (!over) o.scheduleHide(); else o.cancelHide();
    schedulePaint();
  };
  const onGridLeave = () => o.scheduleHide();
  let refreshRaf = 0;
  const refresh = () => {
    if (refreshRaf) return;
    refreshRaf = requestAnimationFrame(() => {
      refreshRaf = 0;
      if (!state.card) return;
      state.rect = state.card.getBoundingClientRect();
      const p = placeViewerNear(state.rect, state.cx, cfg.VW, cfg.VGAP, cfg.VPAD);
      state.vx = p.x; state.side = p.side;
      state.vh = els.viewerEl.offsetHeight || state.vh;
      state.tgt = targetY(state.cy, state.rect, state.vh);
      paint(); kick();
    });
  };
  const remeasure = () => {
    if (!state.card) return;
    state.vh = els.viewerEl.offsetHeight || state.vh;
    state.tgt = targetY(state.cy, state.rect, state.vh);
    paint(); kick();
  };
  const onErr = () => {
    const fb = state.card && state.card.querySelector('img');
    const fs = fb && (fb.currentSrc || fb.src);
    if (fs && vimg.src !== fs) vimg.src = fs;
  };
  vimg.addEventListener('error', onErr);
  vimg.addEventListener('load', remeasure);
  cards.forEach((c) => {
    c.addEventListener('mouseenter', enter, { passive: true });
    c.addEventListener('mousemove', move, { passive: true });
    c.addEventListener('mouseleave', leave, { passive: true });
  });
  grid.addEventListener('mousemove', onGridMove, { passive: true });
  grid.addEventListener('mouseleave', onGridLeave, { passive: true });
  window.addEventListener('scroll', refresh, { passive: true });
  window.addEventListener('resize', refresh);
  return () => {
    cards.forEach((c) => {
      c.removeEventListener('mouseenter', enter);
      c.removeEventListener('mousemove', move);
      c.removeEventListener('mouseleave', leave);
    });
    grid.removeEventListener('mousemove', onGridMove);
    grid.removeEventListener('mouseleave', onGridLeave);
    window.removeEventListener('scroll', refresh);
    window.removeEventListener('resize', refresh);
    vimg.removeEventListener('error', onErr);
    vimg.removeEventListener('load', remeasure);
    if (refreshRaf) cancelAnimationFrame(refreshRaf);
  };
}
