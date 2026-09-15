/* ADAM/FX — Element engine · audible-everywhere playback via <audio>.
   Files play directly; procedural voices render offline through the same
   synth to a WAV blob and play as an element — the exact pipeline test B
   uses. Needs no live AudioContext, so it survives silent-live Safari. */
import { synth, TYPES } from './sound-palette.js';
import { fileById } from './sound-files.js';
import { isMuted, scaledGain, encodeWavBuffer } from './audio-ctx.js';
const RATE = 44100;
const RANDOMS = ['tick', 'blip', 'data', 'chime', 'scanner'];
function noiseBuffer(c) {
  const b = c.createBuffer(1, RATE, RATE), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
function fire(el, url, gain) {
  return new Promise((resolve) => {
    let done = false;
    const revoke = () => { try { if (url.startsWith('blob:')) URL.revokeObjectURL(url); } catch {} };
    const finish = (s) => { if (!done) { done = true; revoke(); try { el.pause(); } catch {} resolve(s); } };
    el.onended = () => finish('played');
    el.onerror = () => finish('file-error');
    setTimeout(() => finish('played'), 5000);
    el.volume = Math.max(0, Math.min(1, gain));
    try {
      const p = el.play();
      if (p && p.catch) p.catch(() => finish('blocked'));
    } catch { finish('blocked'); }
  });
}
export async function playVoice(voice, opts) {
  if (isMuted()) return 'muted';
  const o = opts || {};
  let v = voice;
  if (v === 'random'
    || !TYPES.includes(v)) v = v === 'random' ? RANDOMS[Math.floor(Math.random() * RANDOMS.length)] : 'hum';
  const ms = Math.max(60, Math.min(1500, o.ms || 320));
  const gain = scaledGain(o.gain != null ? Math.max(0, Math.min(1, o.gain)) : 0.6);
  try {
    const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OC) return 'no-offline';
    const c = new OC(1, Math.ceil(RATE * (ms / 1000 + 0.1)), RATE);
    synth(c, noiseBuffer(c), v, 1, { ms, freq: o.freq });
    const rendered = await c.startRendering();
    const url = URL.createObjectURL(new Blob([encodeWavBuffer(rendered.getChannelData(0), RATE)],
        { type: 'audio/wav' }));
    const r = await fire(new Audio(url), url, gain);
    return r === 'played' ? 'played:' + v : r;
  } catch { return 'error'; }
}
export async function playFileId(id, gain = 0.8) {
  if (isMuted()) return 'muted';
  const f = fileById(id);
  if (!f) return 'file-missing';
  const g = scaledGain(Math.max(0, Math.min(1, gain)));
  const r1 = await fire(new Audio(f.url), f.url, g);
  if (r1 === 'played') return 'played:file-' + id;
  if (r1 === 'blocked' || r1 === 'muted') return r1;
  try {
    const res = await fetch(f.remote);
    if (!res.ok) return 'file-error';
    const url = URL.createObjectURL(await res.blob());
    const r2 = await fire(new Audio(url), url, g);
    return r2 === 'played' ? 'played:file-' + id : r2;
  } catch { return 'file-error'; }
}
