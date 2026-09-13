/* ADAM/PAGE — parallax-chase · exponential chase loop · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: makeChase — frame-rate independent decay, no overshoot
const LAMBDA = 11;

// — Factory —
export function makeChase(cols, getDeficits, getProgress) {
  let target = 0;
  let current = 0;
  let rafId = 0;
  let last = 0;
  const render = () => {
    const deficits = getDeficits();
    for (let i = 0; i < cols.length; i++) {
      const y = deficits[i] * current;
      cols[i].style.transform = y < 0.05 ? 'translate3d(0,0,0)' : `translate3d(0,${y.toFixed(2)}px,0)`;
    }
  };
  const tick = (now) => {
    const dt = Math.min(0.033, (now - last) / 1000 || 0.016);
    last = now;
    const delta = target - current;
    if (Math.abs(delta) < 0.00035) {
      current = target;
      render();
      rafId = 0;
      return;
    }
    current += delta * (1 - Math.exp(-LAMBDA * dt));
    render();
    rafId = requestAnimationFrame(tick);
  };
  const kick = () => {
    target = getProgress();
    if (!rafId) {
      last = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  };
  const snapAtTop = (gridStart) => {
    if (!rafId && Math.abs(current - target) > 0.002) {
      if (window.scrollY < gridStart + 2) current = target;
    }
  };
  const reset = () => {
    current = 0;
    target = 0;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  };
  return { kick, snapAtTop, reset, get current() { return current; } };
}
