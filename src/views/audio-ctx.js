/* ADAM/SOUND — audio-ctx · shared context singleton · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: hasGesture, getCtx, ensureRunning, getNoise, ctxInfo, resetCtx, isMuted
// Tests + WAV encode live in audio-test.js — import from there, not here.
export { testLiveOsc, testFileTone, encodeWavBuffer } from './audio-test.js';
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
// Self-test + encode live in audio-test.js (re-exported above for compat).
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
