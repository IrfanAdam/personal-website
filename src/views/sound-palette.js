/* ADAM/FX — Sound palette · procedural cyberpunk voices (WebAudio, no samples). */
export const TYPES = ['tick', 'static', 'blip', 'chime', 'hum', 'data', 'scanner', 'zap', 'zapscan'];

function noiseTick(ctx, buf, gain, freq, ms) {
  const src = ctx.createBufferSource(); src.buffer = buf;
  const filt = ctx.createBiquadFilter(); filt.type = 'bandpass'; filt.frequency.value = freq; filt.Q.value = 1.2;
  const g = ctx.createGain(); g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(gain * 0.8, ctx.currentTime + Math.min(0.005, ms / 2 / 1000));
  g.gain.linearRampToValueAtTime(0, ctx.currentTime + ms / 1000);
  src.connect(filt); filt.connect(g); g.connect(ctx.destination);
  src.start(); src.stop(ctx.currentTime + ms / 1000 + 0.02);
}

function noiseStatic(ctx, buf, gain, ms) {
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
  // light crackle: two micro dips
  if (dur > 0.08) { g.gain.setValueAtTime(gain * 0.3, t0 + dur * 0.18); g.gain.linearRampToValueAtTime(gain * 0.45, t0 + dur * 0.2); }
  src.connect(hp); hp.connect(bp); bp.connect(g); g.connect(ctx.destination);
  src.start(); src.stop(t0 + dur + 0.02);
}

function oscEnv(ctx, type, freq, gain, ms, detune) {
  const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
  if (detune) o.detune.value = detune;
  const g = ctx.createGain(); g.gain.setValueAtTime(0, ctx.currentTime);
  return { o, g };
}

function blip(ctx, gain, freq, ms) {
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

function chime(ctx, gain, ms) {
  const dur = (ms || 420) / 1000, t0 = ctx.currentTime;
  const base = 523.25; // C5 + G5 fifth — glassy, pleasant
  [base, base * 1.5].forEach((f, i) => {
    const { o, g } = oscEnv(ctx, 'sine', f, gain * (i === 0 ? 0.62 : 0.42), ms);
    const att = 0.012 + i * 0.004;
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(gain * (i ? 0.38 : 0.58), t0 + att);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur * (i ? 0.85 : 1));
    o.connect(g); g.connect(ctx.destination);
    o.start(t0); o.stop(t0 + dur + 0.04);
    if (i === 0) { // subtle shimmer overtone
      const { o: o2, g: g2 } = oscEnv(ctx, 'sine', f * 2, gain * 0.08, ms);
      g2.gain.setValueAtTime(0, t0); g2.gain.linearRampToValueAtTime(gain * 0.08, t0 + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.001, t0 + dur * 0.6);
      o2.connect(g2); g2.connect(ctx.destination); o2.start(t0); o2.stop(t0 + dur * 0.6);
    }
  });
}

function hum(ctx, gain, ms) {
  const dur = (ms || 320) / 1000, t0 = ctx.currentTime;
  const base = 62; // warm sub — city bed (+ harmonics so it reads on small speakers)
  // [mult, type, level, detuneCents] — fundamental pair detuned, harmonics sine
  const parts = [[1, 'triangle', 0.34, 0], [1, 'triangle', 0.34, 14], [2, 'sine', 0.2, 0], [3, 'sine', 0.12, 0], [4, 'sine', 0.07, 0]];
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

function dataPips(ctx, gain, ms) {
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


function zap(ctx, gain, ms) {
  // Falling saw — 880Hz drops to 110Hz, 150ms. Snappy UI zap.
  const dur = Math.max(0.05, Math.min(0.6, (ms || 150) / 1000)), t0 = ctx.currentTime;
  const o = ctx.createOscillator(); o.type = 'sawtooth';
  o.frequency.setValueAtTime(880, t0);
  o.frequency.exponentialRampToValueAtTime(110, t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(Math.min(0.5, gain), t0);
  g.gain.exponentialRampToValueAtTime(0.01, t0 + dur);
  // tame harsh top with a tracking lowpass
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 2;
  lp.frequency.setValueAtTime(5200, t0);
  lp.frequency.exponentialRampToValueAtTime(500, t0 + dur);
  o.connect(lp); lp.connect(g); g.connect(ctx.destination);
  o.start(t0); o.stop(t0 + dur + 0.02);
}

function zapscan(ctx, gain, ms) {
  // Glass descent — same falling 880→110Hz flow + 9Hz wobble as zap, but struck-glass texture: sine inharmonic partials instead of saw.
  const dur = Math.max(0.12, Math.min(0.8, (ms || 260) / 1000)), t0 = ctx.currentTime;
  const f0 = 880, f1 = 110, peak = Math.min(0.5, gain);
  // shared wobble: one 9Hz LFO, depth scaled per partial so vibrato stays proportional
  let lfo = null;
  try {
    lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 9;
    lfo.start(t0); lfo.stop(t0 + dur + 0.02);
  } catch { lfo = null; }
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 250;
  hp.connect(ctx.destination);
  // [ratio, level, decay fraction] — inharmonic stack, shimmer dies top-down like struck glass
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
  // strike transient — short high ping, the clink attack
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

function scanner(ctx, gain, ms, buf) {
  // Scanner pass — rising sweep + tracking noise band + lock ping. dur follows the animation.
  const dur = Math.max(0.15, Math.min(1.5, (ms || 520) / 1000)), t0 = ctx.currentTime;
  const f0 = 340, f1 = 1180, end = t0 + dur;
  const sweep = (param) => { param.setValueAtTime(f0, t0); param.exponentialRampToValueAtTime(f1, t0 + dur * 0.85); };
  // sweep tone
  const o = ctx.createOscillator(); o.type = 'sine'; sweep(o.frequency);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain * 0.5, t0 + dur * 0.08);
  g.gain.setValueAtTime(gain * 0.5, t0 + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(0.001, end);
  o.connect(g); g.connect(ctx.destination);
  o.start(t0); o.stop(end + 0.05);
  // octave shimmer riding the same sweep
  const o2 = ctx.createOscillator(); o2.type = 'sine';
  o2.frequency.setValueAtTime(f0 * 2, t0);
  o2.frequency.exponentialRampToValueAtTime(f1 * 2, t0 + dur * 0.85);
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0, t0 + dur * 0.05);
  g2.gain.linearRampToValueAtTime(gain * 0.09, t0 + dur * 0.5);
  g2.gain.exponentialRampToValueAtTime(0.001, end);
  o2.connect(g2); g2.connect(ctx.destination);
  o2.start(t0); o2.stop(end + 0.05);
  // scan band — noise tracking the sweep, the moving head
  try {
    if (buf) {
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = True;
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
  // lock ping at the end of the pass
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

export function synth(ctx, buf, type, gain, opts) {
  const t = TYPES.includes(type) ? type : 'hum';
  const ms = opts && opts.ms > 0 ? opts.ms : (t === 'static' ? 180 : t === 'blip' ? 140 : t === 'chime' ? 420 : t === 'hum' ? 320 : t === 'data' ? 280 : t === 'scanner' ? 520 : t === 'zap' ? 150 : t === 'zapscan' ? 260 : 100);
  const freq = opts && opts.freq > 0 ? opts.freq : (t === 'tick' ? 2100 : t === 'blip' ? 880 : 0);
  const g = Math.max(0, Math.min(1, gain * (opts && opts.gain > 0 ? Math.min(1, opts.gain) : 1)));
  if (t === 'tick') noiseTick(ctx, buf, g, freq * (0.95 + Math.random() * 0.1), ms);
  else if (t === 'static') noiseStatic(ctx, buf, g, ms);
  else if (t === 'blip') blip(ctx, g, freq, ms);
  else if (t === 'chime') chime(ctx, g, ms);
  else if (t === 'hum') hum(ctx, g, ms);
  else if (t === 'data') dataPips(ctx, g, ms);
  else if (t === 'scanner') scanner(ctx, g, ms, buf);
  else if (t === 'zap') zap(ctx, g, ms);
  else if (t === 'zapscan') zapscan(ctx, g, ms);
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
      try { gain.gain.cancelScheduledValues(t); gain.gain.setValueAtTime(gain.gain.value, t); gain.gain.linearRampToValueAtTime(Math.max(0, Math.min(0.45, v)), t + ramp); } catch {}
    },
    stop() { try { nodes.forEach((n) => { try { n.o.stop(); } catch {} try { n.o.disconnect(); } catch {} try { n.lp.disconnect(); } catch {} }); gain.disconnect(); } catch {} },
  };
}
