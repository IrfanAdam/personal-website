/* ADAM/FX — gridReveal-draw · mosaic painter · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: patch, draw — canvas mosaic, no lifecycle
import { clamp01, mix, easeOut, smoothstep } from './cells.js';

// — Tone —
export const greyOf = (tone, dark, clock) => (dark ? 30 : 228) + tone * 13 + Math.sin(clock * 1.5 + tone * 6.28) * 3;

// — Patch one cell —
export function patch(ctx, p, W, H, gut, tint, dark, clock, white) {
  const x = Math.round(p.x);
  const y = Math.round(p.y);
  const w = Math.round(p.x + p.w) - x;
  const h = Math.round(p.y + p.h) - y;
  const l = x <= 0 ? 0 : gut;
  const t = y <= 0 ? 0 : gut;
  const iw = w - l - (x + w >= W ? 0 : gut);
  const ih = h - t - (y + h >= H ? 0 : gut);
  if (iw <= 0 || ih <= 0) return;
  if (white == null) {
    const g = greyOf(p.tone, dark, clock);
    ctx.fillStyle = [
      `rgb(`,
      Math.round(mix(g, p.r, tint)),
      `,`,
      Math.round(mix(g, p.g, tint)),
      `,`,
      Math.round(mix(g, p.b, tint)),
      `)`,
    ].join('');
  } else {
    ctx.fillStyle = `rgba(255,255,255,${white.toFixed(3)})`;
  }
  ctx.fillRect(x + l, y + t, iw, ih);
}

// — Draw full mosaic —
export function draw(ctx, root, W, H, s) {
  const tint = s.hasColors ? s.fade : 0;
  const base = greyOf(root.tone, s.dark, s.clock);
  ctx.fillStyle = [
    `rgb(`,
    Math.round(mix(base, root.r, tint) * 0.92),
    `,`,
    Math.round(mix(base, root.g, tint) * 0.92),
    `,`,
    Math.round(mix(base, root.b, tint) * 0.92),
    `)`,
  ].join('');
  ctx.fillRect(0, 0, W, H);
  const gut = s.gut * (1 - smoothstep(0.35, 0.75, s.split));
  const seed = { x: 0, y: 0, w: W, h: H, r: root.r, g: root.g, b: root.b, tone: root.tone };
  const walk = (c, p, gl) => {
    if (!c.kids || s.split < c.splitAt) {
      if (!gl) {
        patch(ctx, p, W, H, gut, tint, s.dark, s.clock);
        return;
      }
      const band = gl.pos - ((p.x + p.y) / (W + H)) * 0.9 - p.tone * 0.25;
      const a = Math.max(0, 1 - Math.abs(band) * 4) * gl.amp;
      if (a > 0.01) patch(ctx, p, W, H, 0, 0, false, 0, a);
      return;
    }
    const t = easeOut(clamp01((s.split - c.splitAt) / s.morph));
    for (const k of c.kids) {
      walk(k, {
        x: mix(p.x, k.x * W, t),
        y: mix(p.y, k.y * H, t),
        w: mix(p.w, k.w * W, t),
        h: mix(p.h, k.h * H, t),
        r: mix(p.r, k.r, t),
        g: mix(p.g, k.g, t),
        b: mix(p.b, k.b, t),
        tone: mix(p.tone, k.tone, t),
      }, gl);
    }
  };
  walk(root, seed);
  if (!s.done || s.now < s.t0) walk(root, seed, { pos: ((s.clock % 1.6) / 1.6) * 1.5, amp: s.sheen });
  if (s.sharp) {
    const pr = s.hasColors ? smoothstep(s.photoFrom, 1, s.split) : s.fade;
    const photo = s.hasColors ? pr : s.fade;
    if (photo > 0.002) {
      ctx.globalAlpha = Math.min(1, photo);
      ctx.drawImage(s.sharp, 0, 0);
      ctx.globalAlpha = 1;
    }
    if (s.done && pr > 0 && pr < 1) walk(root, seed, { pos: pr * 1.5, amp: (s.sheen + 0.1) * (1 - pr) });
  }
}
