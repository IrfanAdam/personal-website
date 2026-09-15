/* ADAM/DS — ds/foundations/sound/synth-render · offline wave render ·
   [plan:2026-09-15_190000-foundations-sound-pane.md#phase-1] */
// Exports: renderWave
// — Render —
import { synth } from '../../../views/sound-palette.js';

const RATE = 44100;

function noiseBuf(c) {
  const b = c.createBuffer(1, RATE, RATE);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}

export async function renderWave(voice, opts) {
  try {
    const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OC) return null;
    const ms = opts.ms || 280;
    const c = new OC(1, Math.ceil(RATE * (ms / 1000 + 0.1)), RATE);
    synth(c, noiseBuf(c), voice, 1, opts);
    const rendered = await c.startRendering();
    return rendered.getChannelData(0);
  } catch { return null; }
}
