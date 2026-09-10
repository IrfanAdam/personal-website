/* Glimmer orb — vanilla port of MatrixOrb. Square cells (fillRect, radius-none
   doctrine), states idle/listening/thinking, mic-level envelope, spring scale.
   Color defaults to --color-accent (no literals). Single source for DS lab. */
const STATES = ['idle', 'listening', 'thinking'];
const SCALE = { idle: 0.88, listening: 1, thinking: 0.92 };
const ORBITERS = [
  { radius: 0.62, speed: 2.2, phase: 0, spread: 0.42 },
  { radius: 0.4, speed: -1.7, phase: 2.1, spread: 0.36 },
  { radius: 0.8, speed: 1.15, phase: 4, spread: 0.34 },
];
const parseColor = (s) => {
  s = String(s || '').trim();
  let m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) { let h = m[1]; if (h.length === 3) h = [...h].map((c) => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  m = s.match(/rgba?\(([^)]+)\)/);
  if (m) { const p = m[1].split(',').map(Number); return [p[0] || 0, p[1] || 0, p[2] || 0]; }
  return [232, 68, 46];
};
const tokenColor = () => {
  try { const v = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim(); if (v) return parseColor(v); } catch (_) {}
  return [232, 68, 46];
};
const envelope = (t) => {
  const slow = 0.5 + 0.5 * Math.sin(t * 0.62 + 0.4);
  const fast = 0.5 + 0.5 * Math.sin(t * 1.9 + 1.1);
  return 0.22 + 0.78 * (0.45 + 0.55 * slow) * fast;
};
const intensityOf = (state, d, nx, ny, t, amp) => {
  if (state === 'listening') { const r = 0.5 + 0.5 * Math.sin(d * 4.2 - t * 3); return 0.32 + amp * (0.34 + 0.38 * r); }
  if (state === 'thinking') {
    let heat = 0;
    for (const o of ORBITERS) { const a = t * o.speed + o.phase; const dx = nx - Math.cos(a) * o.radius; const dy = ny - Math.sin(a) * o.radius; heat += Math.exp(-(dx * dx + dy * dy) / (o.spread * o.spread)); }
    return 0.26 + 0.8 * Math.min(1, heat);
  }
  return 0.62 + 0.12 * Math.sin(t * 1.05 - d * 2.4);
};
export function attachGlimmerOrb(canvas, opts = {}) {
  const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return () => {};
  const S = { state: opts.state || 'idle', level: opts.level, size: opts.size || 240, dots: Math.max(3, Math.round(opts.dots || 11)) };
  const rgb = opts.color ? parseColor(opts.color) : tokenColor();
  const grid = S.dots, half = (grid - 1) / 2, size = S.size;
  const spacing = (size * 0.74) / (grid - 1), maxR = spacing * 0.6, center = size / 2;
  const dpr = Math.min(window.devicePixelRatio || 1, 4);
  const buffer = Math.round(size * dpr);
  canvas.width = canvas.height = buffer; ctx.scale(buffer / size, buffer / size);
  const weights = { idle: 0, listening: 0, thinking: 0 }; weights[S.state] = 1;
  const levelAt = (t) => { const v = S.level; return v === undefined || !Number.isFinite(v) ? envelope(t) : Math.min(1, Math.max(0, v)); };
  const draw = (t, amp, scale) => {
    ctx.clearRect(0, 0, size, size);
    for (let iy = 0; iy < grid; iy++) for (let ix = 0; ix < grid; ix++) {
      const nx = (ix - half) / half, ny = (iy - half) / half, d = Math.hypot(nx, ny);
      if (d > 1.12) continue;
      let b = 0; for (const s of STATES) { if (weights[s] >= 0.001) b += weights[s] * intensityOf(s, d, nx, ny, t, amp); }
      const inten = Math.min(1, Math.max(0, b)), r = maxR * Math.exp(-d * d * 1.7) * inten * scale;
      if (r * dpr < 0.5) continue;
      const a = Math.min(1, 0.25 + inten * 0.75), x = center + (ix - half) * spacing * scale, y = center + (iy - half) * spacing * scale;
      ctx.fillStyle = `rgba(${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0},${a.toFixed(3)})`;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { const c = S.state; for (const s of STATES) weights[s] = s === c ? 1 : 0; draw(0, levelAt(0), SCALE[c]); return () => {}; }
  let t = 0, amp = 0, scale = SCALE[S.state], vel = 0, last = performance.now(), raf = 0;
  const frame = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05); last = now; t += dt;
    const tgt = levelAt(t), rate = tgt > amp ? 0.22 : 0.08;
    amp += (tgt - amp) * (1 - Math.pow(1 - rate, dt * 60));
    const step = 1 - Math.pow(1 - 0.16, dt * 60);
    for (const s of STATES) weights[s] += ((s === S.state ? 1 : 0) - weights[s]) * step;
    vel += (-180 * (scale - SCALE[S.state]) - 26 * vel) * dt; scale += vel * dt;
    draw(t, amp, scale); raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return Object.assign(() => cancelAnimationFrame(raf), { setState(s) { if (STATES.includes(s)) S.state = s; }, setLevel(v) { S.level = v; } });
}
