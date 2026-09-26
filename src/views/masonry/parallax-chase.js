/* ADAM/PAGE — parallax-chase · exponential chase loop · [plan:2026-09-21_125642-lump-sum-builds.md#phase-8] */
// Exports: makeChase, scrollState — frame-rate independent decay, no overshoot
const LAMBDA = 11;
const FAST_LAMBDA = 22;
const SNAP_GAP = 0.5;
const IDLE_MS = 250;

// — Shared state —
// Reveal tickers read this to yield paint budget while scrolling fast.
export const scrollState = { active: false, fast: false };

// — Factory —
export function makeChase(cols, getDeficits, getProgress) {
  let target = 0;
  let prevTarget = 0;
  let current = 0;
  let rafId = 0;
  let last = 0;
  let lastY = [];
  let idleT = 0;
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
    const gap = target - current;
    if (Math.abs(gap) > SNAP_GAP) current = target;
    else if (Math.abs(gap) < 0.00035 && !moved) {
      current = target;
      render();
      rafId = 0;
      return;
    } else {
      const rate = scrollState.fast ? FAST_LAMBDA : LAMBDA;
      current += gap * (1 - Math.exp(-rate * dt));
    }
    render();
    rafId = requestAnimationFrame(tick);
  };
  const kick = () => {
    const t = getProgress();
    if (Math.abs(t - target) > 0.02) scrollState.fast = true;
    target = t;
    scrollState.active = true;
    clearTimeout(idleT);
    idleT = setTimeout(() => {
      scrollState.active = false;
      scrollState.fast = false;
    }, IDLE_MS);
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
    clearTimeout(idleT);
    scrollState.active = false;
    scrollState.fast = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  };
  return { kick, snapAtTop, reset, get current() { return current; } };
}
