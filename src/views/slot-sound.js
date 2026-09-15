/* ADAM/FX — Slot player · plays whatever the slot's kind picks via the
   element engine (audible even where live WebAudio is silent). Short
   per-slot dedupe so the load timer and a title reveal can't double;
   opts.gap overrides that window (press feedback wants rapid repeats). */
import { isMuted } from './audio-ctx.js';
import { getSource } from './sound-source.js';
import { playVoice, playFileId } from './element-sound.js';
const last = {};
const WINDOW = 1200;
export async function playSlot(slot, gain = 0.5, opts) {
  if (isMuted()) return 'muted';
  const o = opts || {};
  const gap = Number.isFinite(o.gap) ? o.gap : WINDOW;
  const now = Date.now();
  if (now - (last[slot] || 0) < gap) return 'dedupe';
  const s = getSource(slot);
  let r;
  try {
    if (s.kind === 'file') r = await playFileId(s.file, gain);
    else r = await playVoice(s.voice || 'scanner', { ms: (opts && opts.ms) || 520, gain });
  } catch { return 'error'; }
  if (String(r).startsWith('played')) last[slot] = Date.now();
  return r;
}
