/* ADAM/SOUND — src/fx/sound/voices/tone.js · blip + chime tonal voices · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: blip, chime
import { oscEnv } from './helpers.js';

export function blip(ctx, gain, freq, ms) {
  const f0 = freq || 880, f1 = f0 * 1.5;
  const dur = (ms || 140) / 1000, t0 = ctx.currentTime;
  const { o, g } = oscEnv(ctx, 'sine', f0, gain, ms);
  o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t0 + dur * 0.7);
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(gain * 0.72, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(Math.max(0.001, gain * 0.01), t0 + dur);
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 4200;
  o.connect(lp); lp.connect(g); g.connect(ctx.destination);
  o.start(t0); o.stop(t0 + dur + 0.02);
}

export function chime(ctx, gain, ms) {
  const dur = (ms || 420) / 1000, t0 = ctx.currentTime;
  const base = 523.25;
  [base, base * 1.5].forEach((f, i) => {
    const { o, g } = oscEnv(ctx, 'sine', f, gain * (i === 0 ? 0.62 : 0.42), ms);
    const att = 0.012 + i * 0.004;
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(gain * (i ? 0.38 : 0.58), t0 + att);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur * (i ? 0.85 : 1));
    o.connect(g); g.connect(ctx.destination);
    o.start(t0); o.stop(t0 + dur + 0.04);
    if (i === 0) {
      const { o: o2, g: g2 } = oscEnv(ctx, 'sine', f * 2, gain * 0.08, ms);
      g2.gain.setValueAtTime(0, t0); g2.gain.linearRampToValueAtTime(gain * 0.08, t0 + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.001, t0 + dur * 0.6);
      o2.connect(g2); g2.connect(ctx.destination); o2.start(t0); o2.stop(t0 + dur * 0.6);
    }
  });
}
