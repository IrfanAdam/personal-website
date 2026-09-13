/* ADAM/SOUND — src/fx/sound/voices/drone.js · hum + data + zap drone voices ·
   [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: hum, dataPips, zap, createHumLoop
import { oscEnv } from './helpers.js';

export function hum(ctx, gain, ms) {
  const dur = (ms || 320) / 1000, t0 = ctx.currentTime;
  const base = 62;
  const parts = [[1, 'triangle', 0.34, 0],
    [1, 'triangle', 0.34, 14],
    [2, 'sine', 0.2, 0],
    [3, 'sine', 0.12, 0],
    [4, 'sine', 0.07, 0]];
  parts.forEach(([mult, type, lvl, det]) => {
    const { o, g } = oscEnv(ctx, type, base * mult, gain * lvl, ms, det);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100;
    const att = Math.min(0.045, dur * 0.18), rel = Math.min(0.14, dur * 0.42);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(gain * lvl, t0 + att);
    g.gain.setValueAtTime(gain * lvl, t0 + Math.max(att + 0.01, dur - rel));
    g.gain.linearRampToValueAtTime(0.001, t0 + dur);
    o.connect(lp); lp.connect(g); g.connect(ctx.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  });
}

export function dataPips(ctx, gain, ms) {
  const t0 = ctx.currentTime;
  const freqs = [1320, 1680, 2140];
  const pipDur = Math.min(0.065, (ms || 280) / 1000 / freqs.length * 0.85);
  freqs.forEach((f, i) => {
    const { o, g } = oscEnv(ctx, 'sine', f + (Math.random() * 30 - 15), gain * 0.5, ms);
    const st = t0 + i * (pipDur + 0.028);
    g.gain.setValueAtTime(0, st); g.gain.linearRampToValueAtTime(gain * 0.52, st + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, st + pipDur);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 1.1;
    o.connect(bp); bp.connect(g); g.connect(ctx.destination);
    o.start(st); o.stop(st + pipDur + 0.02);
  });
}

export function zap(ctx, gain, ms) {
  const dur = Math.max(0.05, Math.min(0.6, (ms || 150) / 1000)), t0 = ctx.currentTime;
  const o = ctx.createOscillator(); o.type = 'sawtooth';
  o.frequency.setValueAtTime(880, t0);
  o.frequency.exponentialRampToValueAtTime(110, t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(Math.min(0.5, gain), t0);
  g.gain.exponentialRampToValueAtTime(0.01, t0 + dur);
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 2;
  lp.frequency.setValueAtTime(5200, t0);
  lp.frequency.exponentialRampToValueAtTime(500, t0 + dur);
  o.connect(lp); lp.connect(g); g.connect(ctx.destination);
  o.start(t0); o.stop(t0 + dur + 0.02);
}

export function createHumLoop(ctx, initialGain = 0) {
  const gain = ctx.createGain(); gain.gain.value = 0;
  const base = 62; const nodes = [];
  [0, 1.15].forEach((det) => {
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = base; o.detune.value = det * 12;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380;
    o.connect(lp); lp.connect(gain); o.start();
    nodes.push({ o, lp });
  });
  gain.connect(ctx.destination);
  gain.gain.linearRampToValueAtTime(Math.max(0, initialGain), ctx.currentTime + 0.12);
  return {
    gain,
    setGain(v, ramp = 0.14) {
      const t = ctx.currentTime;
      try { gain.gain.cancelScheduledValues(t); gain.gain.setValueAtTime(gain.gain.value,
          t); gain.gain.linearRampToValueAtTime(Math.max(0, Math.min(0.45, v)),
          t + ramp); } catch {}
    },
    stop() {
      try {
        nodes
          .forEach((n) => {
          try {
            n
              .o
              .stop();
          } catch {
          } try {
            n
              .o
              .disconnect();
          } catch {
          } try {
            n
              .lp
              .disconnect();
          } catch {
          }
        });
        gain
          .disconnect();
      } catch {} },
  };
}
