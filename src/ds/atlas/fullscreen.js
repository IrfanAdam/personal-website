/* ADAM/DS — ds/atlas/fullscreen · stage overlay toggle (dock chip · ✕ · esc)
   [plan:2026-09-14_192124-atlas-fullscreen.md#phase-1] */
// Exports: makeFullscreen
const IDLE = { isFull: () => false, set: () => false, unbind: () => {} };
export function makeFullscreen(root, onResize) {
  const stage = root.querySelector('#atlasStage');
  const chip = root.querySelector('#atlasFull');
  const close = root.querySelector('#atlasClose');
  if (!stage || !chip || !close) return IDLE;
  let full = false;
  const paint = () => {
    stage.classList.toggle('is-full', full);
    document.body.classList.toggle('atlas-full', full);
    chip.setAttribute('aria-pressed', String(full));
    chip.setAttribute('aria-label', full ? 'Exit fullscreen' : 'Fullscreen stage');
    close.hidden = !full;
  };
  const set = (next) => {
    if (next === full) return false;
    full = next;
    paint();
    requestAnimationFrame(onResize);
    (full ? close : chip).focus();
    return true;
  };
  const onChip = () => set(!full);
  const onClose = () => set(false);
  const onKey = (e) => {
    if (e.key !== 'Escape' || !full) return;
    e.stopPropagation();
    set(false);
  };
  chip.addEventListener('click', onChip);
  close.addEventListener('click', onClose);
  document.addEventListener('keydown', onKey, true);
  return {
    isFull: () => full,
    set,
    unbind() {
      chip.removeEventListener('click', onChip);
      close.removeEventListener('click', onClose);
      document.removeEventListener('keydown', onKey, true);
      full = false;
      paint();
    },
  };
}
