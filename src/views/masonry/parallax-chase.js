/* ADAM/PAGE — parallax-chase · exponential chase loop · [plan:2026-09-21_125642-lump-sum-builds.md#phase-8] */
// Exports: makeChase, scrollState — frame-rate independent decay, no overshoot
const LAMBDA = 11;
const FAST_LAMBDA = 22;
const SETTLE_LAMBDA = 26;
const SETTLE_FRAMES = 3;
const SNAP_GAP = 0.5;

// — Shared state —
// Reveal tickers read this to yield paint budget while the chase settles.
export const scrollState = { active: false };

// — Factory —
export function makeChase(cols, getDeficits, getProgress, onSettle) {
  let target = 0;
  let prevTarget = 0;
  let current = 0;
  let rafId = 0;
  let last = 0;
  let lastY = [];
  let stillN = 0;
  const render = () => {
    const deficits = getDeficits();
    for (let i = 0; i < cols.length; i++) {
      const y = deficits[i] * current;
      const q = y < 0.05 ? 0 : Math.round(y * 50) / 50;
      if (lastY[i] === q) continue;
      lastY[i] = q;
      const v = q === 0 ? 'translate3d(0,0,0)' : `translate3d(0,${q.toFixed(2)}px,0)`;
      cols[i].style.transform = v;
    }
  };
  const tick = (now) => {
    target = getProgress();
    const dt = Math.min(0.033, (now - last) / 1000 || 0.016);
    last = now;
    const moved = Math.abs(target - prevTarget) > 0.000001;
    prevTarget = target;
    stillN = moved ? 0 : stillN + 1;
    const gap = target - current;
    if (Math.abs(gap) > SNAP_GAP) current = target;
    else if (Math.abs(gap) < 0.00035 && !moved) {
      current = target;
      render();
      rafId = 0;
      if (onSettle) onSettle();
      return;
    } else {
      const rate = stillN >= SETTLE_FRAMES
        ? SETTLE_LAMBDA
        : LAMBDA + (FAST_LAMBDA - LAMBDA) * Math.min(1, Math.abs(gap) / 0.08);
      current += gap * (1 - Math.exp(-rate * dt));
    }
    render();
    rafId = requestAnimationFrame(tick);
  };
  const kick = () => {
    target = getProgress();
    scrollState.active = true;
    if (!rafId) {
      last = performance.now();
      prevTarget = target;
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
    prevTarget = 0;
    lastY = [];
    stillN = 0;
    scrollState.active = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  };
  const isRunning = () => rafId !== 0;
  return { kick, snapAtTop, reset, isRunning, get current() { return current; } };
}
