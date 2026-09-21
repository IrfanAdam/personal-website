/* ADAM/PAGE — views/masonry/viewer · viewer · [plan:2026-09-13_235413-over-limit-splits.md#phase-3] */
// Exports: attachViewer — single-frame portal, delegates markup + events
import { fxNum, fxMs } from '../fx-tokens.js';
import { createViewerDom, makePaint, springStep } from './viewer-markup.js';
import { bindViewer } from './viewer-bind.js';
import { makeVisibility } from './viewer-visibility.js';
export { clamp01,
  smoothstep,
  targetY,
  offsetPoint,
  springStep,
  placeViewer,
  placeViewerNear,
  HALF,
  OFF } from './viewer-markup.js';
export function attachViewer(grid) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (window.innerWidth <= 640 || matchMedia('(hover: none)').matches) return () => {};
  const cards = [...grid.querySelectorAll('.card')];
  if (!cards.length) return () => {};
  const cfg = {
    TH: fxNum('--fx-viewer-threshold', 12),
    IDLE: fxMs('--fx-viewer-idle', 850),
    HIDE: fxMs('--fx-viewer-debounce', 70),
    K: fxNum('--fx-viewer-k', 0.05),
    FR: fxNum('--fx-viewer-fr', 0.78),
    YDEAD: fxNum('--fx-viewer-y-dead', 14),
    VW: fxNum('--size-viewer-w', 180),
    VGAP: fxNum('--size-viewer-gap', 10),
    VPAD: fxNum('--size-viewer-pad', 20),
  };
  const els = createViewerDom();
  const state = {
    card: null, rect: null, vx: 0, side: 'right', vh: 220,
    cx: 0, cy: 0, tgt: 0, cur: 0, vel: 0, raf: 0,
    hideTimer: 0, idleTimer: 0, portalOn: false,
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
  const { clearIdle, armIdle, showCursor, showPortal, hidePortal, hideAll, scheduleHide, cancelHide } =
    makeVisibility(state, els, cfg, grid);
  const checkThreshold = () => {
    if (state.portalOn || !state.card) return;
    if (Math.hypot(state.cx - state.enterX, state.cy - state.enterY) > cfg.TH) showPortal();
  };
  const offBind = bindViewer({
    grid, cards, els, state, cfg, paint, kick, schedulePaint,
    showCursor, scheduleHide, cancelHide, clearIdle, armIdle, checkThreshold,
    setTgt: (cand) => { if (Math.abs(cand - state.cur) >= cfg.YDEAD) state.tgt = cand; },
  });
  state._hidePortal = hidePortal; state._showPortal = showPortal;
  return () => {
    offBind();
    if (state.hideTimer) clearTimeout(state.hideTimer);
    if (state.idleTimer) clearTimeout(state.idleTimer);
    if (state.raf) cancelAnimationFrame(state.raf);
    if (state.pendingRaf) cancelAnimationFrame(state.pendingRaf);
    els.viewerEl.remove();
  };
}
