/* ADAM/SOUND — src/fx/sound/voices/noise.js · tick + static noise voices ·
   [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: tick, staticNoise

export function tick(ctx, buf, gain, freq, ms) {
  const src = ctx.createBufferSource(); src.buffer = buf;
  const filt = ctx.createBiquadFilter(); filt.type = 'bandpass'; filt.frequency.value = freq; filt.Q.value = 1.2;
  const g = ctx.createGain(); g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(gain * 0.8, ctx.currentTime + Math.min(0.005, ms / 2 / 1000));
  g.gain.linearRampToValueAtTime(0, ctx.currentTime + ms / 1000);
  src.connect(filt); filt.connect(g); g.connect(ctx.destination);
  src.start(); src.stop(ctx.currentTime + ms / 1000 + 0.02);
}

export function staticNoise(ctx, buf, gain, ms) {
  const src = ctx.createBufferSource(); src.buffer = buf;
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 420;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 950 + Math.random() * 180; bp.Q.value = 0.85;
  const g = ctx.createGain();
  const t0 = ctx.currentTime, dur = ms / 1000;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain * 0.55, t0 + 0.012);
  g.gain.linearRampToValueAtTime(gain * 0.42, t0 + dur * 0.35);
  g.gain.linearRampToValueAtTime(gain * 0.15, t0 + dur * 0.75);
  g.gain.linearRampToValueAtTime(0, t0 + dur);
  if (dur > 0.08) { g.gain.setValueAtTime(gain * 0.3, t0 + dur * 0.18); g.gain.linearRampToValueAtTime(gain * 0.45, t0 + dur * 0.2); }
  src.connect(hp); hp.connect(bp); bp.connect(g); g.connect(ctx.destination);
  src.start(); src.stop(t0 + dur + 0.02);
}
