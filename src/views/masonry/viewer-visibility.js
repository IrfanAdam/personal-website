/* ADAM/PAGE — views/masonry/viewer-visibility · show/hide ·
   [plan:2026-09-13_235413-over-limit-splits.md#phase-3] */
// Exports: makeVisibility — idle/portal cluster over shared state (single-frame: no cursor/tether)
export function makeVisibility(state, els, cfg) {
  function clearIdle() { if (state.idleTimer) { clearTimeout(state.idleTimer); state.idleTimer = 0; } }
  function armIdle() { clearIdle(); if (state.portalOn) state.idleTimer = setTimeout(() => hidePortal(), cfg.IDLE); }
  function showCursor() {
    if (state.hideTimer) { clearTimeout(state.hideTimer); state.hideTimer = 0; }
    // No-op in single-frame mode — cursor removed, portal is the only frame
  }
  function showPortal() {
    if (state.portalOn || !state.card) return;
    state.portalOn = true;
    els.viewerEl.classList.add('on'); armIdle();
  }
  function hidePortal() {
    if (!state.portalOn) return;
    state.portalOn = false; clearIdle();
    els.viewerEl.classList.remove('on');
    state.enterX = state.cx; state.enterY = state.cy;
  }
  function hideAll() {
    if (state.hideTimer) { clearTimeout(state.hideTimer); state.hideTimer = 0; }
    clearIdle(); state.portalOn = false;
    state.card = null; state.rect = null;
    els.viewerEl.classList.remove('on');
    if (state.raf) { cancelAnimationFrame(state.raf); state.raf = 0; }
    if (state.pendingRaf) { cancelAnimationFrame(state.pendingRaf); state.pendingRaf = 0; }
  }
  function scheduleHide() { if (state.hideTimer) return; state.hideTimer = setTimeout(hideAll, cfg.HIDE); }
  function cancelHide() { if (state.hideTimer) { clearTimeout(state.hideTimer); state.hideTimer = 0; } }
  return { clearIdle, armIdle, showCursor, showPortal, hidePortal, hideAll, scheduleHide, cancelHide };
}
