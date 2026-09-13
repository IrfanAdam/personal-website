/* ADAM/PAGE — views/masonry/viewer · viewer · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: attachViewer — open/close orchestration, delegates markup + events
import { fxNum, fxMs } from '../fx-tokens.js';
import { createViewerDom, makePaint, springStep } from './viewer-markup.js';
import { bindViewer } from './viewer-bind.js';
export { clamp01, smoothstep, targetY, offsetPoint, springStep, placeViewer, placeViewerNear, HALF, OFF } from './viewer-markup.js';
export function attachViewer(grid) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (window.innerWidth <= 640 || matchMedia('(hover: none)').matches) return () => {};
  const cards = [...grid.querySelectorAll('.card')];
  if (!cards.length) return () => {};
  const cfg = {
    TH: fxNum('--fx-viewer-threshold', 12),
    IDLE: fxMs('--fx-viewer-idle', 850),
    HIDE: fxMs('--fx-viewer-debounce', 70),
    K: fxNum('--fx-viewer-k', 0.1),
    FR: fxNum('--fx-viewer-fr', 0.54),
    VW: fxNum('--size-viewer-w', 180),
    VGAP: fxNum('--size-viewer-gap', 10),
    VPAD: fxNum('--size-viewer-pad', 20),
  };
  const els = createViewerDom();
  const state = {
    card: null, rect: null, vx: 0, side: 'right', vh: 220,
    cx: 0, cy: 0, tgt: 0, cur: 0, vel: 0, raf: 0,
    hideTimer: 0, idleTimer: 0, cursorOn: false, portalOn: false,
    enterX: 0, enterY: 0, pendingRaf: 0,
  };
  const paint = makePaint(state, els, cfg);
  const tick = () => {
    state.raf = 0;
    if (!state.card || !state.rect) { paint(); return; }
    const s = springStep(state.cur, state.vel, state.tgt, cfg.K, cfg.FR);
    state.cur = s.pos; state.vel = s.vel; paint();
    if (Math.abs(state.tgt - state.cur) > 0.1 || Math.abs(state.vel) > 0.1) state.raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!state.raf) state.raf = requestAnimationFrame(tick); };
  const schedulePaint = () => {
    if (state.pendingRaf) return;
    state.pendingRaf = requestAnimationFrame(() => { state.pendingRaf = 0; paint(); kick(); });
  };
  const clearIdle = () => { if (state.idleTimer) { clearTimeout(state.idleTimer); state.idleTimer = 0; } };
  const armIdle = () => { clearIdle(); if (state.portalOn) state.idleTimer = setTimeout(() => hidePortal(), cfg.IDLE); };
  const showCursor = () => {
    if (state.hideTimer) { clearTimeout(state.hideTimer); state.hideTimer = 0; }
    if (state.cursorOn) return;
    state.cursorOn = true;
    els.cursorEl.classList.add('on');
    document.documentElement.classList.add('viewer-cursor-active');
    grid.style.cursor = 'none';
  };
  const showPortal = () => {
    if (state.portalOn || !state.card) return;
    state.portalOn = true;
    els.viewerEl.classList.add('on'); els.svg.classList.add('on'); armIdle();
  };
  const hidePortal = () => {
    if (!state.portalOn) return;
    state.portalOn = false; clearIdle();
    els.viewerEl.classList.remove('on'); els.svg.classList.remove('on');
    state.enterX = state.cx; state.enterY = state.cy;
  };
  const hideAll = () => {
    if (state.hideTimer) { clearTimeout(state.hideTimer); state.hideTimer = 0; }
    clearIdle(); state.portalOn = false; state.cursorOn = false;
    state.card = null; state.rect = null;
    els.cursorEl.classList.remove('on');
    els.viewerEl.classList.remove('on'); els.svg.classList.remove('on');
    document.documentElement.classList.remove('viewer-cursor-active');
    grid.style.cursor = '';
    if (state.raf) { cancelAnimationFrame(state.raf); state.raf = 0; }
    if (state.pendingRaf) { cancelAnimationFrame(state.pendingRaf); state.pendingRaf = 0; }
  };
  const scheduleHide = () => { if (state.hideTimer) return; state.hideTimer = setTimeout(hideAll, cfg.HIDE); };
  const cancelHide = () => { if (state.hideTimer) { clearTimeout(state.hideTimer); state.hideTimer = 0; } };
  const checkThreshold = () => {
    if (state.portalOn || !state.card) return;
    if (Math.hypot(state.cx - state.enterX, state.cy - state.enterY) > cfg.TH) showPortal();
  };
  const offBind = bindViewer({
    grid, cards, els, state, cfg, paint, kick, schedulePaint,
    showCursor, scheduleHide, cancelHide, clearIdle, armIdle, checkThreshold,
  });
  // expose for bind's idle/threshold callbacks
  state._hidePortal = hidePortal; state._showPortal = showPortal;
  return () => {
    offBind();
    if (state.hideTimer) clearTimeout(state.hideTimer);
    if (state.idleTimer) clearTimeout(state.idleTimer);
    if (state.raf) cancelAnimationFrame(state.raf);
    if (state.pendingRaf) cancelAnimationFrame(state.pendingRaf);
    els.cursorEl.remove(); els.viewerEl.remove(); els.svg.remove();
  };
}
