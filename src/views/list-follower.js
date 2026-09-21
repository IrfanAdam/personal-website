/* ADAM/SHARED — views/list-follower · list popover inertia · [plan:2026-09-15_183400-lump-sum-builds.md#phase-27] */
// Exports: createListFollower — y-spring follower for list popover
import { fxNum } from './fx-tokens.js';

// — Section: follower —
// Y inertia only (x immediate) · dead-zone + scale spring on one rAF
// Tiny inertia softens viewport-flip (bottom → above fold) without per-mouse rerender
export function createListFollower(el) {
  const SK = fxNum('--fx-viewer-pop-k', 0.28);
  const SFR = fxNum('--fx-viewer-pop-fr', 0.55);
  const FROM = fxNum('--fx-viewer-pop', 0.985);
  const YK = fxNum('--fx-viewer-y-k', 0.22);
  const YFR = fxNum('--fx-viewer-y-fr', 0.68);
  const DEAD = fxNum('--fx-viewer-y-dead', 4);
  let x = 0, y = 0, tx = 0, ty = 0, vy = 0, s = FROM, vs = 0, ts = FROM, raf = 0, live = false;
  const apply = () => {
    el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${s.toFixed(4)})`;
  };
  const tick = () => {
    raf = 0; x = tx;
    vy = (vy + (ty - y) * YK) * YFR; y += vy;
    vs = (vs + (ts - s) * SK) * SFR; s += vs;
    apply();
    const yDone = Math.abs(ty - y) < 0.5 && Math.abs(vy) < 0.05;
    const sclDone = Math.abs(ts - s) < 0.001 && Math.abs(vs) < 0.001;
    if (live || !yDone || !sclDone) raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  return {
    snap(nx, ny) { x = tx = nx; y = ty = ny; vy = 0; apply(); kick(); },
    aim(nx, ny) { tx = nx; if (Math.abs(ny - y) >= DEAD) ty = ny; live = true; kick(); },
    pop() { s = FROM; vs = 0; ts = 1; live = true; kick(); },
    idle() { live = false; ts = FROM; kick(); },
    stop() { if (raf) cancelAnimationFrame(raf); raf = 0; live = false; },
  };
}
