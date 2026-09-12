/* ADAM/FX — Glitch sound · multi-voice palette (tick/static/blip/chime/hum/data). Hum 320ms, proximity-scaled per glitch. */
import { TYPES, synth } from './sound-palette.js';
let ctx, buf, el, timer = null, phase = null, last = 0, mx = -1e4, my = -1e4, on = true;
let lo = 5000, hi = 9000, kind = 'hum';
const R = 260, FLOOR = 600, HOVER_R = 18, AT = 0.88;
const red = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
function getCtx() { if (ctx) return ctx; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ctx = new AC(); return ctx; }
function getBuf() { if (buf) return buf; const c = getCtx(); if (!c) return null; const len = c.sampleRate; buf = c.createBuffer(1, len, c.sampleRate); const d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; return buf; }
function prox() { if (!el) return 0.6; if (mx < -5e3) return 0.6; const r = el.getBoundingClientRect(); const dx = Math.max(r.left - mx, 0, mx - r.right); const dy = Math.max(r.top - my, 0, my - r.bottom); const d = Math.hypot(dx, dy); if (d >= R) return 0; return 1 - d / R; }
function pickKind(raw) { if (!raw) return kind; const v = String(raw).toLowerCase(); const found = v.split(/[\s,|]+/).map((s) => s.trim()).filter((s) => TYPES.includes(s)); if (found.length === 0) return kind; if (found.length === 1) return found[0]; return found[Math.floor(Math.random() * found.length)]; }
function durMs() { try { if (!el) return 2400; const r = getComputedStyle(el).getPropertyValue('--dur-glitch').trim() || '2.4s'; if (r.endsWith('ms')) return parseFloat(r) || 2400; if (r.endsWith('s')) return (parseFloat(r) || 2.4) * 1000; return 2400; } catch { return 2400; } }
function untilGlitch() { try { if (!el || !el.isConnected || !el.getAnimations) return 0; const anims = el.getAnimations(); const g = anims.find((a) => String(a.animationName || '').toLowerCase().includes('glitch')); if (!g || g.playState === 'paused') return 0; let dur = null; try { dur = g.effect.getTiming().duration; } catch {} if (typeof dur === 'string') dur = parseFloat(dur); dur = Number(dur); if (!dur || !isFinite(dur)) dur = durMs(); const cur = Number(g.currentTime); if (!isFinite(cur)) return 0; const at = dur * AT; const mod = ((cur % dur) + dur) % dur; let d = at - mod; if (d < 20) d += dur; return d > 0 ? d : 0; } catch { return 0; } }
async function play(manual, opts) {
  if (red()) return 'reduced'; if (!on) return 'muted';
  if (!manual && el && !el.isConnected) { clearTimeout(timer); timer = null; if (phase) { clearTimeout(phase); phase = null; } return 'detached'; }
  const o = opts || {}; const now = Date.now();
  if (manual && now - last < FLOOR) return 'floor'; if (manual) last = now;
  const c = getCtx(), b = getBuf(); if (!c || !b) return 'blocked';
  if (c.state === 'suspended') { try { await c.resume(); } catch {} if (c.state !== 'running') { try { await new Promise((r) => setTimeout(r, 150)); } catch {} } if (c.state !== 'running') { if (manual) last = 0; return 'blocked'; } }
  const p = prox(); const g = manual ? 0.72 + 0.28 * p : 0.34 + 0.56 * p;
  if (g <= 0.08) { if (!manual) schedule(); return 'far'; }
  const jitter = 0.9 + Math.random() * 0.2;
  const type = o.type ? pickKind(o.type) : (manual && o.voice ? pickKind(o.voice) : pickKind(kind));
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
    const d = untilGlitch(); if (d > 32) phase = setTimeout(() => { phase = null; play(false); }, d); else play(false);
  }, wait);
}
function isOver(px, py) { if (!el) return false; const r = el.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; return Math.hypot(px - cx, py - cy) < HOVER_R || (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom); }
function tryHover(px, py) { if (isOver(px, py)) play(true); }
async function unlock(e) { const c = getCtx(); if (!c) return; if (c.state === 'suspended') { try { await c.resume(); } catch {} } const x = e && e.clientX != null ? e.clientX : mx, y = e && e.clientY != null ? e.clientY : my; if (on && isOver(x, y)) play(true); }
function parseAttr(v) { const s = String(v || '').trim().toLowerCase(); const m = s.match(/(\d+)\s*-\s*(\d+)/); if (m) { lo = Math.max(500, +m[1]); hi = Math.max(lo + 500, +m[2]); } const toks = s.split(/[\s,|]+/).filter((t) => TYPES.includes(t)); if (toks.length === 1) kind = toks[0]; else if (toks.length > 1) kind = toks.join(','); }
export function attach(node) { if (!node || !(node instanceof Element)) return; if (el && el.isConnected) return; parseAttr(node.getAttribute('data-glitch-sound')); el = node; node.addEventListener('mouseenter', () => play(true)); node.addEventListener('click', () => play(true)); node.addEventListener('pointerenter', () => play(true)); if (!timer && !red() && on) schedule(); }
export function detach() { clearTimeout(timer); timer = null; if (phase) { clearTimeout(phase); phase = null; } el = null; }
export const tick = (o) => play(true, o || {});
export const playSound = (type, o) => play(true, { ...(o || {}), type });
export { TYPES };
export function setEnabled(v) { on = !!v; const c = ctx; if (!c) return; if (on) { if (c.state === 'suspended') c.resume().catch(() => {}); if (!timer && el) schedule(); } else { if (c.state === 'running') c.suspend().catch(() => {}); clearTimeout(timer); timer = null; if (phase) { clearTimeout(phase); phase = null; } } }
try { addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; if (el && on) tryHover(e.clientX, e.clientY); }, { passive: true }); addEventListener('pointerdown', unlock); addEventListener('click', unlock); addEventListener('touchstart', unlock, { passive: true }); addEventListener('keydown', unlock); } catch {}
try { const s = localStorage.getItem('adam-sound'); if (s === 'off') on = false; if (s === 'on') on = true; } catch {}
if (red()) on = false;
