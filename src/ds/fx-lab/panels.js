/* ADAM/DS — fx-lab/panels · shimmer + rise mounts · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: mountShimmer, mountRise — small lab widgets
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function mountShimmer(scope) {
  const box = scope.querySelector('[data-fx-shimmer]');
  if (!box) return () => {};
  const dur = scope.querySelector('[data-fx-dur]');
  const out = scope.querySelector('[data-fx-dur-v]');
  const dirB = scope.querySelector('[data-fx-dir]');
  const pauseB = scope.querySelector('[data-fx-pause]');
  const onDur = () => { const s = (+dur.value / 10).toFixed(1); box.style.setProperty('--fx-dur', s + 's'); if (out) out.textContent = s + 's'; };
  const onDir = () => { if (dirB) dirB.textContent = box.classList.toggle('rev') ? 'forward' : 'reverse'; };
  const onPause = () => { if (pauseB) pauseB.textContent = box.classList.toggle('off') ? 'play' : 'pause'; };
  if (dur) dur.addEventListener('input', onDur);
  if (dirB) dirB.addEventListener('click', onDir);
  if (pauseB) pauseB.addEventListener('click', onPause);
  if (dur) onDur();
  return () => {
    if (dur) dur.removeEventListener('input', onDur);
    if (dirB) dirB.removeEventListener('click', onDir);
    if (pauseB) pauseB.removeEventListener('click', onPause);
  };
}

export function mountRise(scope) {
  const box = scope.querySelector('[data-fx-rise]');
  if (!box) return () => {};
  const dur = scope.querySelector('[data-fx-rise-dur]');
  const out = scope.querySelector('[data-fx-rise-v]');
  const btn = scope.querySelector('[data-fx-rise-replay]');
  const onDur = () => { if (dur && out) { box.style.setProperty('--fx-rise-dur', dur.value + 'ms'); out.textContent = dur.value + 'ms'; } };
  const onReplay = () => {
    if (reduced()) return;
    box.classList.add('rest');
    void box.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => box.classList.remove('rest')));
  };
  if (dur) dur.addEventListener('input', onDur);
  if (btn) btn.addEventListener('click', onReplay);
  if (dur) onDur();
  return () => {
    if (dur) dur.removeEventListener('input', onDur);
    if (btn) btn.removeEventListener('click', onReplay);
  };
}
