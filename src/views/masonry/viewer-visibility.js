/* ADAM/PAGE — views/masonry/viewer-visibility · show/hide ·
   [plan:2026-09-13_235413-over-limit-splits.md#phase-3] */
// Exports: makeVisibility — idle/cursor/portal cluster over shared state
export function makeVisibility(state, els, cfg, grid) {
  function clearIdle() { if (state.idleTimer) { clearTimeout(state.idleTimer); state.idleTimer = 0; } }
  function armIdle() { clearIdle(); if (state.portalOn) state.idleTimer = setTimeout(() => hidePortal(),
      cfg.IDLE); }
  function showCursor() {
    if (state.hideTimer) { clearTimeout(state.hideTimer); state.hideTimer = 0; }
    if (state.cursorOn) return;
    state.cursorOn = true;
    els.cursorEl.classList.add('on');
    document.documentElement.classList.add('viewer-cursor-active');
    grid.style.cursor = 'none';
  }
  function showPortal() {
    if (state.portalOn || !state.card) return;
    state.portalOn = true;
    els.viewerEl.classList.add('on'); els.svg.classList.add('on'); armIdle();
  }
  function hidePortal() {
    if (!state.portalOn) return;
    state.portalOn = false; clearIdle();
    els.viewerEl.classList.remove('on'); els.svg.classList.remove('on');
    state.enterX = state.cx; state.enterY = state.cy;
  }
  function hideAll() {
    if (state.hideTimer) { clearTimeout(state.hideTimer); state.hideTimer = 0; }
    clearIdle(); state.portalOn = false; state.cursorOn = false;
    state.card = null; state.rect = null;
    els.cursorEl.classList.remove('on');
    els.viewerEl.classList.remove('on'); els.svg.classList.remove('on');
    document.documentElement.classList.remove('viewer-cursor-active');
    grid.style.cursor = '';
    if (state.raf) { cancelAnimationFrame(state.raf); state.raf = 0; }
    if (state.pendingRaf) { cancelAnimationFrame(state.pendingRaf); state.pendingRaf = 0; }
  }
  function scheduleHide() { if (state.hideTimer) return; state.hideTimer = setTimeout(hideAll, cfg.HIDE); }
  function cancelHide() { if (state.hideTimer) { clearTimeout(state.hideTimer); state.hideTimer = 0; } }
  return { clearIdle, armIdle, showCursor, showPortal, hidePortal, hideAll, scheduleHide, cancelHide };
}
