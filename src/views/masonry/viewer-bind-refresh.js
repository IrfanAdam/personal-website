/* ADAM/PAGE — views/masonry/viewer-bind-refresh · refresh [plan:2026-09-22_141500-housekeeping-refactor.md#phase-1] */
// Exports: attachRefresh — scroll/resize/viewport + remeasure
import { targetY, placeViewerNear } from './viewer-markup.js';

export function attachRefresh(o) {
  const { getState, cfg, els, paint, kick } = o;
  const { vimg, viewerEl } = els;
  let raf = 0;
  const refresh = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const state = getState();
      if (!state.card) return;
      state.rect = state.card.getBoundingClientRect();
      const p = placeViewerNear(state.rect, state.cx, cfg.VW, cfg.VGAP, cfg.VPAD);
      state.vx = p.x; state.side = p.side;
      state.vh = viewerEl.offsetHeight || state.vh;
      state.tgt = targetY(state.cy, state.rect, state.vh);
      paint(); kick();
    });
  };
  const remeasure = () => {
    const state = getState();
    if (!state.card) return;
    state.vh = viewerEl.offsetHeight || state.vh;
    state.tgt = targetY(state.cy, state.rect, state.vh);
    paint(); kick();
  };
  const onErr = () => {
    const state = getState();
    const fb = state.card && state.card.querySelector('img');
    const fs = fb && (fb.currentSrc || fb.src);
    if (fs && vimg.src !== fs) vimg.src = fs;
  };
  vimg.addEventListener('error', onErr);
  vimg.addEventListener('load', remeasure);
  window.addEventListener('scroll', refresh, { passive: true });
  window.addEventListener('resize', refresh);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', refresh);
    window.visualViewport.addEventListener('scroll', refresh);
  }
  const teardown = () => {
    vimg.removeEventListener('error', onErr);
    vimg.removeEventListener('load', remeasure);
    window.removeEventListener('scroll', refresh);
    window.removeEventListener('resize', refresh);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', refresh);
      window.visualViewport.removeEventListener('scroll', refresh);
    }
    if (raf) cancelAnimationFrame(raf);
  };
  return { refresh, remeasure, teardown };
}
