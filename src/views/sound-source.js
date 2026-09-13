/* ADAM/FX — Sound source store · per-slot kind pick (procedural | file).
   Slot 'load' drives the page-load sweep; slot 'glitch' is the lab default.
   Persisted as JSON in localStorage 'adam-sound-src'. */
const KEY = 'adam-sound-src';
const DEFAULTS = {
  load: { kind: 'file', voice: 'scanner', file: 'loading.mp3' },
  glitch: { kind: 'procedural', voice: 'hum', file: 'load.wav' },
  scramble: { kind: 'procedural', voice: 'random', file: 'scifi-weapon.wav' },
};
let mem = {};
try { mem = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { mem = {}; }
function save() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch {} }
export const SLOTS = Object.keys(DEFAULTS);
export function getSource(slot) {
  const d = DEFAULTS[slot] || DEFAULTS.load;
  const o = mem[slot] || {};
  const kind = (o.kind || d.kind) === 'file' ? 'file' : 'procedural';
  return { kind, voice: o.voice || d.voice, file: o.file || d.file };
}
export function setSource(slot, patch) {
  const cur = getSource(slot);
  mem[slot] = { ...cur, ...(patch || {}) };
  if (mem[slot].kind !== 'file' && mem[slot].kind !== 'procedural') mem[slot].kind = 'procedural';
  save();
  return mem[slot];
}
export function resetSources() { mem = {}; save(); }
