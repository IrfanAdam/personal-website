/* ADAM/FX — shared AudioContext singleton (lazy, gesture-safe).
   One context for all voices. The context is ONLY ever created inside a
   user gesture (click/key/touch): a pre-gesture context stays permanently
   silent on Safari even after resume() reports 'running'. Hover/pointermove
   must never create it — getCtx() returns null until the first gesture. */
let ctx = null, buf = null, gestured = false;
function markGesture() {
  if (!gestured) {
    gestured = true;
    // Reclaim a corpse: anything existing now predates the first gesture.
    // Capture listeners run before button handlers, so the play that follows
    // builds a fresh in-gesture context.
    if (ctx) { try { if (ctx.close) ctx.close().catch(() => {}); } catch {} ctx = null; buf = null; }
  }
}
try {
  for (const ev of ['pointerdown', 'click', 'keydown', 'touchstart'])
    addEventListener(ev, markGesture, { passive: true, capture: true });
} catch {}
export const hasGesture = () => gestured;
export function getCtx() {
  if (ctx) return ctx;
  if (!gestured) return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}
export async function ensureRunning() {
  const c = getCtx();
  if (!c) return 'no-ctx';
  if (c.state === 'suspended' || c.state === 'interrupted') { try { await c.resume(); } catch {} }
  return c.state;
}
export function getNoise() {
  const c = getCtx();
  if (!c) return null;
  if (buf) return buf;
  buf = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}
// Self-test: A = raw live oscillator (bypasses all app code), B = same synth
// rendered offline to WAV and played through an <audio> element (the exact
// pipeline YouTube uses). Whichever the user hears isolates the breakage.
export async function testLiveOsc() {
  try {
    const c = getCtx(); if (!c) return 'no-ctx';
    if (c.state === 'suspended' || c.state === 'interrupted') { try { await c.resume(); } catch {} }
    if (c.state !== 'running') return 'blocked:' + c.state;
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 880;
    const g = c.createGain(); g.gain.value = 0.5;
    o.connect(g); g.connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.35);
    return 'played:raw-880Hz@' + c.sampleRate;
  } catch (e) { return 'error'; }
}
export function encodeWavBuffer(ch, rate) {
  const n = ch.length, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const wstr = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  wstr(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); wstr(8, 'WAVE'); wstr(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true);
  v.setUint16(34, 16, true); wstr(36, 'data'); v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) { const s = Math.max(-1, Math.min(1, ch[i])); v.setInt16(44 + i * 2, s * 32767, true); }
  return buf;
}
export async function testFileTone() {
  try {
    const { synth } = await import('./sound-palette.js');
    const rate = 44100;
    const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OC) return 'no-offline';
    const c = new OC(1, Math.ceil(rate * 0.6), rate);
    const nb = c.createBuffer(1, rate, rate);
    synth(c, nb, 'chime', 0.8, { ms: 420 });
    const rendered = await c.startRendering();
    const ch = rendered.getChannelData(0);
    let pk = 0; for (let i = 0; i < ch.length; i++) { const a = Math.abs(ch[i]); if (a > pk) pk = a; }
    if (pk < 0.01) return 'silent-render';
    const url = URL.createObjectURL(new Blob([encodeWavBuffer(ch, rate)], { type: 'audio/wav' }));
    const el = new Audio(url);
    el.volume = 1;
    await el.play();
    return 'played:file-chime-peak-' + pk.toFixed(2);
  } catch (e) { return 'error'; }
}
export const ctxInfo = () => { try { return ctx ? ctx.state + '@' + ctx.sampleRate : 'no-ctx'; } catch { return '?'; } };
// Hard recovery: close a possibly poisoned context; next line rebuilds it
// fresh inside this gesture. Resume is raced so a hung Safari can't freeze us.
export async function resetCtx() {
  try { const old = ctx; ctx = null; buf = null; if (old) { try { await old.close(); } catch {} } } catch {}
  const c = getCtx();
  if (!c) return 'no-ctx';
  if (c.state !== 'running') {
    try { await Promise.race([c.resume(), new Promise((r) => setTimeout(() => r('timeout'), 900))]); } catch {}
  }
  return 'reset:' + c.state + '@' + (c.sampleRate || '?');
}
export function isMuted() {
  try {
    if (localStorage.getItem('adam-sound') === 'off') return true;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  } catch {}
  return false;
}
