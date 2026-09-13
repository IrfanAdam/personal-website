/* ADAM/FX — gridReveal-tick · frame scheduler + split ticker · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: makeTicker(s, render, finish) — RAF fallback + eased split chase
import { smoothstep } from './cells.js';

// — Frame scheduler: RAF when visible, timeout fallback —
export function nextFrame(cb, state) {
  if (typeof requestAnimationFrame === 'function' && document.visibilityState === 'visible') {
    state.viaRaf = true;
    return requestAnimationFrame(cb);
  }
  state.viaRaf = false;
  return setTimeout(() => cb(performance.now()), 16);
}

export function cancelFrame(id, state) {
  if (state.viaRaf && typeof cancelAnimationFrame === 'function') return cancelAnimationFrame(id);
  return clearTimeout(id);
}

// — Ticker —
export function makeTicker(s, render, finish) {
  const st = { viaRaf: false };
  let raf = 0;
  let visible = true;
  let stopped = false;
  const tick = (now) => {
    raf = nextFrame(tick, st);
    const dt = Math.min(((now - (s.now || now)) / 1000) || 0, 0.05);
    s.clock += dt;
    if (now < s.t0) {
      render(now);
      return;
    }
    s.elapsed += dt;
    const target = s.done ? 1 : 0.9 * (1 - Math.exp(-s.elapsed / s.spanS));
    s.eased += (target - s.eased) * (1 - Math.exp(-dt * 8));
    const released = !s.done || now - s.loadedAt > s.holdMs;
    const wanted = Math.min(s.eased, released ? 1 : s.waitCap);
    s.split += (wanted - s.split) * (1 - Math.exp(-dt * 6));
    render(now);
    if (s.done) {
      const pr = s.hasColors ? smoothstep(s.photoFrom, 1, s.split) : s.fade;
      if (pr > 0.99 && s.split > 0.985) {
        render(now);
        stopped = true;
        cancelFrame(raf, st);
        raf = 0;
        finish();
      }
    }
  };
  const start = () => {
    if (!stopped && !raf) raf = nextFrame(tick, st);
  };
  const stop = () => {
    cancelFrame(raf, st);
    raf = 0;
  };
  const setVisible = (v) => {
    if (v === visible) return;
    visible = v;
    if (visible) start();
    else stop();
  };
  return { start, stop, setVisible };
}
