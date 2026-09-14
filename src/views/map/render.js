/* ADAM/PAGE — views/map/render · grid, group boxes, node rows
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-7] */
import { KINDS, GROUPS, membersOf } from './data.js';
import { token, roundPath } from './paint.js';
// Exports: drawGrid, drawGroups, drawRows
const STEP = 40;
const HH = 32;
const RADIUS = 10;
const LABEL_MIN = 0.5;
const kindColor = (k) => token((KINDS[k] || {}).color || '--color-ink-muted');
export function drawGrid(ctx, v) {
  const x0 = Math.floor(-v.ox / v.scale / STEP) * STEP;
  const y0 = Math.floor(-v.oy / v.scale / STEP) * STEP;
  const x1 = x0 + v.W / v.scale + STEP;
  const y1 = y0 + v.H / v.scale + STEP;
  ctx.save();
  ctx.strokeStyle = token('--color-line');
  ctx.lineWidth = 1 / v.scale;
  ctx.beginPath();
  for (let x = x0; x < x1; x += STEP) {
    ctx.moveTo(x, y0);
    ctx.lineTo(x, y1);
  }
  for (let y = y0; y < y1; y += STEP) {
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
  }
  ctx.stroke();
  ctx.restore();
}
export function drawGroups(ctx, v, focus, hoverGroup) {
  GROUPS.forEach((g) => {
    const dim = focus.active && !focus.keep.has(g.id);
    const hot = hoverGroup === g.id;
    ctx.save();
    ctx.globalAlpha = dim ? 0.4 : 1;
    roundPath(ctx, g.x, g.y, g.w, g.h, RADIUS);
    ctx.fillStyle = token('--color-surface');
    ctx.fill();
    ctx.lineWidth = (hot ? 1.5 : 1) / v.scale;
    ctx.strokeStyle = hot ? token('--color-ink') : token('--color-line');
    ctx.stroke();
    const headAlpha = hot ? 0.52 : 0.36;
    ctx.globalAlpha = dim ? 0.3 : headAlpha;
    ctx.fillStyle = token(g.tint);
    roundPath(ctx, g.x, g.y, g.w, HH, RADIUS);
    ctx.fill();
    ctx.fillRect(g.x, g.y + HH - RADIUS, g.w, RADIUS);
    ctx.globalAlpha = dim ? 0.55 : 1;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = token('--color-ink');
    ctx.font = `600 ${12 / v.scale}px ${token('--font-display')}`;
    ctx.fillText(g.label, g.x + 12 / v.scale, g.y + 13 / v.scale);
    ctx.fillStyle = token('--color-ink-muted');
    ctx.font = `500 ${10 / v.scale}px ${token('--font-mono')}`;
    ctx.fillText(g.sub, g.x + 12 / v.scale, g.y + 25 / v.scale);
    ctx.restore();
  });
}
export function drawRows(ctx, v, focus) {
  GROUPS.forEach((g) => {
    membersOf(g).forEach((n) => {
      const dim = focus.active && !focus.keep.has(n.id);
      ctx.save();
      ctx.globalAlpha = dim ? 0.38 : 1;
      const y = n.y + n.h / 2;
      ctx.beginPath();
      ctx.arc(n.x + 9 / v.scale, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = kindColor(n.kind);
      ctx.fill();
      if (v.scale > LABEL_MIN) {
        ctx.fillStyle = token('--color-ink');
        ctx.font = `600 ${11 / v.scale}px ${token('--font-body')}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, n.x + 17 / v.scale, y);
      }
      ctx.restore();
    });
  });
}
