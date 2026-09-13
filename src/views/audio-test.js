/* ADAM/SOUND — audio-test · self-tests + WAV encode · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: testLiveOsc, testFileTone, encodeWavBuffer — diagnostics only
import { getCtx } from './audio-ctx.js';

// — Encode —
export function encodeWavBuffer(ch, rate) {
  const n = ch.length;
  const buf = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buf);
  const wstr = (o, s) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };
  wstr(0, 'RIFF');
  v.setUint32(4, 36 + n * 2, true);
  wstr(8, 'WAVE');
  wstr(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  wstr(36, 'data');
  v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, ch[i]));
    v.setInt16(44 + i * 2, s * 32767, true);
  }
  return buf;
}

// — Self-tests —
export async function testLiveOsc() {
  try {
    const c = getCtx();
    if (!c) return 'no-ctx';
    if (c.state !== 'running') {
      try { await c.resume(); } catch {}
    }
    if (c.state !== 'running') return 'blocked:' + c.state;
    const o = c.createOscillator();
    o.type = 'sine';
    o.frequency.value = 880;
    const g = c.createGain();
    g.gain.value = 0.5;
    o.connect(g);
    g.connect(c.destination);
    o.start();
    o.stop(c.currentTime + 0.35);
    return 'played:raw-880Hz@' + c.sampleRate;
  } catch { return 'error'; }
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
    let pk = 0;
    for (let i = 0; i < ch.length; i++) {
      const a = Math.abs(ch[i]);
      if (a > pk) pk = a;
    }
    if (pk < 0.01) return 'silent-render';
    const url = URL.createObjectURL(new Blob([encodeWavBuffer(ch, rate)], { type: 'audio/wav' }));
    const el = new Audio(url);
    el.volume = 1;
    await el.play();
    return 'played:file-chime-peak-' + pk.toFixed(2);
  } catch { return 'error'; }
}
