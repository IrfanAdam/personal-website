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
  { id: 'authorize.mp3', desc: 'authorize · 444ms plucky pop' },
  { id: 'button_pop.mp3', desc: 'button pop · 418ms soft thock' },
  { id: 'click.mp3', desc: 'click · 78ms micro tick' },
  { id: 'hover.wav', desc: 'hover · 410ms brushed pad' },
  { id: 'load.wav', desc: 'load snap · 117ms stereo' },
  { id: 'loading.mp3', desc: 'loading · 504ms mp3 bed' },
  { id: 'pop.mp3', desc: 'pop · 183ms bubble' },
  { id: 'pull.mp3', desc: 'pull · 552ms rubber stretch' },
  { id: 'window-open.mp3', desc: 'window open · 2.09s modern UI' },
  { id: 'reel.mp3', desc: 'reel · 287ms tape tick' },
  { id: 'schloop.mp3', desc: 'schloop · 418ms liquid drop' },
  { id: 'schlop.mp3', desc: 'schlop · 470ms woody plop' },
  { id: 'scifi-weapon.wav', desc: 'scifi sweep · 886ms stereo' },
  { id: 'ui-click-43196.mp3', desc: 'ui click · 552ms crisp' },
  { id: 'weapon_scifi_laser.wav', desc: 'laser · 1296ms sci-fi zap' },
  { id: 'zing.mp3', desc: 'zing · 287ms bright ping' },
];
