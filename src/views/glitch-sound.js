/* ADAM/FX — Glitch sound: single-voice tick (today only). One context/buffer, ~2kHz bandpass ~80ms. */
let ctx, buf, el, timer = null, last = 0, mx = -1e4, my = -1e4, on = true;
let lo = 5000, hi = 9000;
const R = 260, FLOOR = 600;
const red = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
function getCtx() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC(); return ctx;
}
function getBuf() {
  if (buf) return buf;
  const c = getCtx(); if (!c) return null;
  const len = c.sampleRate;
  buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}
function prox() {
  if (!el) return 0.6;
  if (mx < -5e3) return 0.6;
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const d = Math.hypot(mx - cx, my - cy);
  if (d >= R) return 0;
  const t = 1 - d / R; return t * t;
}
function play(manual) {
  if (red() || !on) return;
  const now = Date.now();
  if (manual && now - last < FLOOR) return;
  const c = getCtx(), b = getBuf();
  if (!c || !b) return;
  if (c.state === 'suspended') c.resume().catch(() => {});
  const g = manual ? 1 : prox();
  if (g <= 0.02) { if (!manual) schedule(); return; }
  const jitter = 0.9 + Math.random() * 0.2;
  const src = c.createBufferSource(); src.buffer = b;
  const filt = c.createBiquadFilter(); filt.type = 'bandpass';
  filt.frequency.value = 2100 * (0.95 + Math.random() * 0.1);
  filt.Q.value = 1.2;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(g * jitter * 0.7, c.currentTime + 0.005);
  gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.08);
  src.connect(filt); filt.connect(gain); gain.connect(c.destination);
  src.start(); src.stop(c.currentTime + 0.09);
  last = now; schedule();
}
function schedule() {
  clearTimeout(timer);
  timer = setTimeout(() => play(false), lo + Math.random() * (hi - lo));
}
function isOver() {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return mx >= r.left && mx <= r.right && my >= r.top && my <= r.bottom;
}
function unlock() {
  const c = getCtx(); if (!c) return;
  if (c.state === 'suspended') c.resume().catch(() => {});
  if (on && isOver()) play(true);
}
export function attach(node) {
  if (!node || !(node instanceof Element)) return;
  if (el && el.isConnected) return;
  const v = (node.getAttribute('data-glitch-sound') || '').trim();
  const m = v.match(/(\d+)\s*-\s*(\d+)/);
  if (m) { lo = Math.max(500, +m[1]); hi = Math.max(lo + 500, +m[2]); }
  el = node;
  node.addEventListener('mouseenter', () => play(true));
  node.addEventListener('click', () => play(true));
  if (!timer && !red() && on) schedule();
}
export function detach() { clearTimeout(timer); timer = null; el = null; }
export function setEnabled(v) {
  on = !!v;
  const c = ctx; if (!c) return;
  if (on) { if (c.state === 'suspended') c.resume().catch(() => {}); if (!timer && el) schedule(); }
  else { if (c.state === 'running') c.suspend().catch(() => {}); clearTimeout(timer); timer = null; }
}
try {
  addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  addEventListener('click', unlock, { once: true });
  addEventListener('keydown', unlock, { once: true });
} catch {}
try { const s = localStorage.getItem('adam-sound'); if (s === 'off') on = false; if (s === 'on') on = true; } catch {}
if (red()) on = false;
