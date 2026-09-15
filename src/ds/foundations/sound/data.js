/* ADAM/DS — ds/foundations/sound/data · voice + file meta ·
   [plan:2026-09-15_190000-foundations-sound-pane.md#phase-1] */
// Exports: VOICES, FILES_META, DEFAULTS
export const VOICES = [
  { id: 'tick', freq: 2100, ms: 100, desc: 'filtered noise · 2.1kHz snap' },
  { id: 'static', freq: 0, ms: 180, desc: 'tape hiss · 950Hz band + crackle' },
  { id: 'blip', freq: 880, ms: 140, desc: 'sine chirp 880→1320Hz' },
  { id: 'chime', freq: 0, ms: 420, desc: 'fifth 523/785Hz · glass bell' },
  { id: 'hum', freq: 0, ms: 320, desc: 'sub 62Hz detuned bed' },
  { id: 'data', freq: 0, ms: 280, desc: '3 pips 1.3/1.7/2.1kHz' },
  { id: 'scanner', freq: 0, ms: 520, desc: 'rising sweep 340→1180Hz + ping' },
  { id: 'zap', freq: 0, ms: 150, desc: 'falling saw 880→110Hz' },
  { id: 'zapscan', freq: 0, ms: 260, desc: 'falling glass + 9Hz wobble' },
];
export const FILES_META = [
  { id: 'load.wav', desc: 'load snap · 117ms stereo' },
  { id: 'loading.mp3', desc: 'loading · mp3 bed' },
  { id: 'scifi-weapon.wav', desc: 'scifi sweep · 886ms stereo' },
];
