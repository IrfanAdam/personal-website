/* ADAM/SOUND — src/fx/sound/voices/helpers.js · shared WebAudio helpers ·
   [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: oscEnv

export function oscEnv(ctx, type, freq, gain, ms, detune) {
  const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
  if (detune) o.detune.value = detune;
  const g = ctx.createGain(); g.gain.setValueAtTime(0, ctx.currentTime);
  return { o, g };
}
