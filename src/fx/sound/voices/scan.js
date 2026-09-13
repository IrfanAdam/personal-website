/* ADAM/SOUND — src/fx/sound/voices/scan.js · scanner + zapscan glass voices ·
   [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: scanner, zapscan

export function zapscan(ctx, gain, ms) {
  const dur = Math.max(0.12, Math.min(0.8, (ms || 260) / 1000)), t0 = ctx.currentTime;
  const f0 = 880, f1 = 110, peak = Math.min(0.5, gain);
  let lfo = null;
  try {
    lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 9;
    lfo.start(t0); lfo.stop(t0 + dur + 0.02);
  } catch { lfo = null; }
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 250;
  hp.connect(ctx.destination);
  [[1, 0.5, 1], [2.76, 0.2, 0.7], [5.4, 0.09, 0.45]].forEach(([ratio, lvl, dec]) => {
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(Math.max(40, f0 * ratio), t0);
    o.frequency.exponentialRampToValueAtTime(Math.max(40, f1 * ratio), t0 + dur);
    if (lfo) {
      try {
        const depth = ctx.createGain(); depth.gain.value = 55 * ratio;
        lfo.connect(depth); depth.connect(o.frequency);
      } catch {}
    }
    const g = ctx.createGain(), end = t0 + dur * dec;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(peak * lvl, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, end);
    o.connect(g); g.connect(hp);
    o.start(t0); o.stop(end + 0.02);
  });
  try {
    const p = ctx.createOscillator(); p.type = 'sine'; p.frequency.value = 3100;
    const pg = ctx.createGain();
    pg.gain.setValueAtTime(0, t0);
    pg.gain.linearRampToValueAtTime(peak * 0.22, t0 + 0.004);
    pg.gain.exponentialRampToValueAtTime(0.001, t0 + 0.045);
    p.connect(pg); pg.connect(hp);
    p.start(t0); p.stop(t0 + 0.07);
  } catch {}
}

export function scanner(ctx, gain, ms, buf) {
  const dur = Math.max(0.15, Math.min(1.5, (ms || 520) / 1000)), t0 = ctx.currentTime;
  const f0 = 340, f1 = 1180, end = t0 + dur;
  const sweep = (param) => { param.setValueAtTime(f0, t0); param.exponentialRampToValueAtTime(f1, t0 + dur * 0.85); };
  const o = ctx.createOscillator(); o.type = 'sine'; sweep(o.frequency);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain * 0.5, t0 + dur * 0.08);
  g.gain.setValueAtTime(gain * 0.5, t0 + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(0.001, end);
  o.connect(g); g.connect(ctx.destination);
  o.start(t0); o.stop(end + 0.05);
  const o2 = ctx.createOscillator(); o2.type = 'sine';
  o2.frequency.setValueAtTime(f0 * 2, t0);
  o2.frequency.exponentialRampToValueAtTime(f1 * 2, t0 + dur * 0.85);
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0, t0 + dur * 0.05);
  g2.gain.linearRampToValueAtTime(gain * 0.09, t0 + dur * 0.5);
  g2.gain.exponentialRampToValueAtTime(0.001, end);
  o2.connect(g2); g2.connect(ctx.destination);
  o2.start(t0); o2.stop(end + 0.05);
  try {
    if (buf) {
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      src.playbackRate.value = 0.7;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 7; sweep(bp.frequency);
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0, t0 + dur * 0.04);
      ng.gain.linearRampToValueAtTime(gain * 0.2, t0 + dur * 0.4);
      ng.gain.exponentialRampToValueAtTime(0.001, t0 + dur * 0.92);
      src.connect(bp); bp.connect(ng); ng.connect(ctx.destination);
      src.start(t0); src.stop(end + 0.05);
    }
  } catch {}
  try {
    const p = ctx.createOscillator(); p.type = 'sine'; p.frequency.value = f1 * 1.5;
    const pg = ctx.createGain(); const pa = t0 + dur * 0.88;
    pg.gain.setValueAtTime(0, pa);
    pg.gain.linearRampToValueAtTime(gain * 0.22, pa + 0.012);
    pg.gain.exponentialRampToValueAtTime(0.001, pa + 0.14);
    p.connect(pg); pg.connect(ctx.destination);
    p.start(pa); p.stop(pa + 0.2);
  } catch {}
}
