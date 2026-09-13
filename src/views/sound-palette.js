/* ADAM/SOUND — src/views/sound-palette.js · dispatcher to voice families ·
   [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: TYPES, synth, createHumLoop
import { tick, staticNoise } from '../fx/sound/voices/noise.js';
import { blip, chime } from '../fx/sound/voices/tone.js';
import { hum, dataPips, zap, createHumLoop } from '../fx/sound/voices/drone.js';
import { zapscan, scanner } from '../fx/sound/voices/scan.js';

export const TYPES = ['tick', 'static', 'blip', 'chime', 'hum', 'data', 'scanner', 'zap', 'zapscan'];
export { createHumLoop };

// Default params per voice (ms duration, base freq) — overrides via opts.
const MS = {
  static: 180, blip: 140, chime: 420, hum: 320, data: 280,
  scanner: 520, zap: 150, zapscan: 260,
};
const FREQ = { tick: 2100, blip: 880 };

export function synth(ctx, buf, type, gain, opts) {
  const t = TYPES.includes(type) ? type : 'hum';
  const ms = opts && opts.ms > 0 ? opts.ms : (MS[t] || 100);
  const freq = opts && opts.freq > 0 ? opts.freq : (FREQ[t] || 0);
  const g = Math.max(0, Math.min(1, gain * (opts && opts.gain > 0 ? Math.min(1, opts.gain) : 1)));
  if (t === 'tick') tick(ctx, buf, g, freq * (0.95 + Math.random() * 0.1), ms);
  else if (t === 'static') staticNoise(ctx, buf, g, ms);
  else if (t === 'blip') blip(ctx, g, freq, ms);
  else if (t === 'chime') chime(ctx, g, ms);
  else if (t === 'hum') hum(ctx, g, ms);
  else if (t === 'data') dataPips(ctx, g, ms);
  else if (t === 'scanner') scanner(ctx, g, ms, buf);
  else if (t === 'zap') zap(ctx, g, ms);
  else if (t === 'zapscan') zapscan(ctx, g, ms);
}
