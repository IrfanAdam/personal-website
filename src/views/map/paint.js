/* ADAM/PAGE — views/map/paint · canvas primitives + cached token reader
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-7] */
// Exports: token, resetTokens, roundPath, arrowHead, labelPill
const memo = new Map();
export function token(name) {
  if (memo.has(name)) return memo.get(name);
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  memo.set(name, v);
  return v;
}
export const resetTokens = () => memo.clear();
export function roundPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
export function trace(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i].x, pts[i].y);
}
export function arrowHead(ctx, x, y, ang, scale, color) {
  const s = 7 / scale;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-s, -s * 0.42);
  ctx.lineTo(-s, s * 0.42);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}
export function labelPill(ctx, x, y, text, scale, bg, ink) {
  ctx.save();
  ctx.font = `${10 / scale}px ${token('--font-mono')}`;
  const w = ctx.measureText(text).width + 12 / scale;
  const h = 16 / scale;
  roundPath(ctx, x - w / 2, y - h / 2, w, h, 8 / scale);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = token('--color-line');
  ctx.lineWidth = 1 / scale;
  ctx.stroke();
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y + 0.5 / scale);
  ctx.restore();
}
