/* ADAM/DS — src/ds/functions/glitch/meta.js · TYPE_META + option builders · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: TYPE_META, VOICE_DEFAULTS, buildTypeOpts, buildChips, buildFileOpts, buildKindOpts, buildVoiceOpts
import { TYPES } from '../../../views/glitch-sound.js';
import { FILES } from '../../../views/sound-files.js';

// — Meta —
export const TYPE_META = {
  tick: 'filtered noise · 2.1kHz snap · 100ms — tick',
  static: 'tape hiss · 950Hz band + crackle · 180ms — idle CRT',
  blip: 'sine chirp 880→1320Hz · 140ms — pleasant ack',
  chime: 'fifth 523/785Hz · 420ms glass bell — warm cyberpunk',
  hum: 'sub 62Hz detuned · 320ms bed — city drone (default)',
  data: '3 pips 1.3/1.7/2.1kHz · 280ms — data stream',
  scanner: 'rising sweep 340→1180Hz + lock ping · 520ms — page load',
  zap: 'falling saw 880→110Hz · 150ms — snappy zap',
  zapscan: 'falling glass 880→110Hz + 9Hz wobble · 260ms — glass descent',
};
export const VOICE_DEFAULTS = {
  tick: 100,
  static: 180,
  blip: 140,
  chime: 420,
  hum: 320,
  data: 280,
  scanner: 520,
  zap: 150,
  zapscan: 260,
};
function shortLabel(type) {
  const raw = TYPE_META[type] || type;
  const head = raw.split(' ·')[0];
  return head;
}
export function buildTypeOpts() {
  return TYPES.map((t) => {
    const sel = t === 'hum' ? ' selected' : '';
    const label = shortLabel(t);
    return `<option value="${t}"${sel}>${t} — ${label}</option>`;
  }).join('');
}
export function buildChips() {
  return TYPES.map((t) => `<button class="pill" data-snd-chip="${t}">${t}</button>`).join('');
}
export function buildFileOpts(sel) {
  return FILES.map((f) => {
    const active = f.id === sel ? ' selected' : '';
    return `<option value="${f.id}"${active}>${f.id} — ${f.desc}</option>`;
  }).join('');
}
export function buildKindOpts(sel) {
  const a = sel === 'procedural' ? ' selected' : '';
  const b = sel === 'file' ? ' selected' : '';
  const o1 = `<option value="procedural"${a}>procedural</option>`;
  const o2 = `<option value="file"${b}>file</option>`;
  return o1 + o2;
}
export function buildVoiceOpts(sel) {
  return TYPES.map((t) => {
    const active = t === sel ? ' selected' : '';
    const label = shortLabel(t);
    return `<option value="${t}"${active}>${t} — ${label}</option>`;
  }).join('');
}
