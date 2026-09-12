/* ADAM/FX — Sound palette · procedural cyberpunk voices (WebAudio, no samples). */
export const TYPES = ['tick', 'static', 'blip', 'chime', 'hum', 'data'];

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
  const base = 62; // warm sub — city bed
  [0, 1.15].forEach((det) => {
    const { o, g } = oscEnv(ctx, 'triangle', base, gain * 0.45, ms, det * 12);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380;
    const att = Math.min(0.045, dur * 0.18), rel = Math.min(0.14, dur * 0.42);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(gain * 0.34, t0 + att);
    g.gain.setValueAtTime(gain * 0.34, t0 + Math.max(att + 0.01, dur - rel));
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

export function synth(ctx, buf, type, gain, opts) {
  const t = TYPES.includes(type) ? type : 'hum';
  const ms = opts && opts.ms > 0 ? opts.ms : (t === 'static' ? 180 : t === 'blip' ? 140 : t === 'chime' ? 420 : t === 'hum' ? 320 : t === 'data' ? 280 : 100);
  const freq = opts && opts.freq > 0 ? opts.freq : (t === 'tick' ? 2100 : t === 'blip' ? 880 : 0);
  const g = Math.max(0, Math.min(1, gain * (opts && opts.gain > 0 ? Math.min(1, opts.gain) : 1)));
  if (t === 'tick') noiseTick(ctx, buf, g, freq * (0.95 + Math.random() * 0.1), ms);
  else if (t === 'static') noiseStatic(ctx, buf, g, ms);
  else if (t === 'blip') blip(ctx, g, freq, ms);
  else if (t === 'chime') chime(ctx, g, ms);
  else if (t === 'hum') hum(ctx, g, ms);
  else if (t === 'data') dataPips(ctx, g, ms);
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
