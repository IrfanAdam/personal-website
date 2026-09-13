/* ADAM/FX — views/glitch-sound · composer · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { TYPES, synth } from './sound-palette.js';
import { getCtx, ctxInfo } from './audio-ctx.js';
import { pickKind, parseAttr } from './glitch-sound/parse.js';
import { prox, isOver } from './glitch-sound/geom.js';
import { getBuf, red, untilGlitch } from './glitch-sound/timing.js';
export { ctxInfo };
let el, timer = null, phase = null, last = 0, mx = -1e4, my = -1e4, on = true;
let lo = 5000, hi = 9000, kind = 'hum';
const FLOOR = 600;
async function play(manual, opts) {
  if (red()) return 'reduced'; if (!on) return 'muted';
  if (!manual && el && !el.isConnected) { clearTimeout(timer);
    timer = null;
    if (phase) { clearTimeout(phase);
      phase = null;
    } return 'detached';
  }
  const o = opts || {}; const now = Date.now();
  if (manual && now - last < FLOOR) return 'floor'; if (manual) last = now;
  const c = getCtx(), b = getBuf(); if (!c || !b) { if (!manual) schedule(); return 'blocked'; }
  if (c.state === 'suspended') { try { await c.resume();
    } catch {} if (c.state !== 'running') { try { await new Promise((r) => setTimeout(r, 150));
      } catch {} } if (c.state !== 'running') { if (manual) last = 0;
      return 'blocked';
    } }
  const p = prox(el, mx, my); const g = manual ? 0.72 + 0.28 * p : 0.34 + 0.56 * p;
  if (g <= 0.08) { if (!manual) schedule(); return 'far'; }
  const jitter = 0.9 + Math.random() * 0.2;
  let type = pickKind(kind, kind);
  if (o.type) type = pickKind(o.type, kind);
  else if (manual && o.voice) type = pickKind(o.voice, kind);
  const lvl = o.gain > 0 ? Math.min(1, o.gain) : 1;
  synth(c, b, type, g * jitter * 0.8 * lvl, o);
  last = now; schedule(); return 'played';
}
function schedule() {
  clearTimeout(timer); if (phase) { clearTimeout(phase); phase = null; }
  if (!el || !el.isConnected || red() || !on) return;
  const wait = lo + Math.random() * (hi - lo);
  timer = setTimeout(async () => {
    const c = getCtx(); if (c && c.state === 'suspended') { try { await c.resume(); } catch {} }
    const d = untilGlitch(el); if (d > 32) phase = setTimeout(() => { phase = null; play(false); }, d); else play(false);
  }, wait);
}
async function unlock(e) { const c = getCtx();
  if (!c) return;
  if (c.state === 'suspended') { try { await c.resume();
    } catch {} } const x = e && e
      .clientX != null ? e
      .clientX : mx, y = e && e
      .clientY != null ? e
      .clientY : my;
  if (on && isOver(el, x, y)) play(true);
}
export function attach(node) { if (!node || !(node instanceof Element)) return;
  if (el && el.isConnected) return;
  ({ lo, hi, kind } = parseAttr(node.getAttribute('data-glitch-sound'), { lo, hi, kind }));
  el = node;
  node
    .addEventListener('mouseenter', () => play(true));
  node
    .addEventListener('click', () => play(true));
  node
    .addEventListener('pointerenter', () => play(true));
  if (!timer && !red() && on) schedule();
}
export function detach() { clearTimeout(timer);
  timer = null;
  if (phase) { clearTimeout(phase);
    phase = null;
  } el = null;
}
export const tick = (o) => play(true, o || {});
export const playSound = (type, o) => play(true, { ...(o || {}), type });
export { TYPES };
export function setEnabled(v) { on = !!v;
  const c = getCtx();
  if (!c) return;
  if (on) { if (c.state === 'suspended') c.resume().catch(() => {});
    if (!timer && el) schedule();
  } else { if (c.state === 'running') c.suspend().catch(() => {});
    clearTimeout(timer);
    timer = null;
    if (phase) { clearTimeout(phase);
      phase = null;
    } } }
try { addEventListener('pointermove',
    (e) => { mx = e.clientX; my = e.clientY; if (el && on && isOver(el, e.clientX, e.clientY)) play(true); },
    { passive: true });
  addEventListener('pointerdown', unlock);
  addEventListener('click', unlock);
  addEventListener('touchstart', unlock, { passive: true });
  addEventListener('keydown', unlock);
} catch {}
try { const s = localStorage.getItem('adam-sound'); if (s === 'off') on = false; if (s === 'on') on = true; } catch {}
if (red()) on = false;
