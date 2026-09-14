/* ADAM/PAGE — views/map/wires · orthogonal edges, arrowheads, hover labels
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-7] */
import { EDGE_KINDS, EDGES, byId, touched } from './data.js';
import { routePath } from './route.js';
import { token, trace, arrowHead, labelPill } from './paint.js';
// Exports: drawWires
const DASH = [7, 5];
const edgeColor = (k) => token((EDGE_KINDS[k] || {}).color || '--color-ink-muted');
export function drawWires(ctx, v, focus, hover, selected, hovEdge, selEdge) {
  EDGES.forEach((e) => {
    const a = byId(e.from);
    const b = byId(e.to);
    if (!a || !b) return;
    const sel = e === selEdge;
    const hov = e === hovEdge;
    const near = !!selected && (e.from === selected.id || e.to === selected.id);
    const dim = touched(focus, e) && !sel && !hov && !near;
    const r = routePath(a, b, e.lane);
    const end = r.path[r.path.length - 1];
    const color = sel || hov ? token('--color-ink') : edgeColor(e.kind);
    ctx.save();
    if (dim) ctx.globalAlpha = 0.14;
    else if (!sel && !hov && !near) ctx.globalAlpha = 0.74;
    const weight = hov || near ? 1.5 : 1.1;
    ctx.lineWidth = (sel ? 2 : weight) / v.scale;
    ctx.strokeStyle = color;
    ctx.setLineDash(e.kind === 'signal' ? DASH.map((d) => d / v.scale) : []);
    trace(ctx, r.path);
    ctx.stroke();
    ctx.setLineDash([]);
    if (!dim) arrowHead(ctx, end.x, end.y, r.ang, v.scale, color);
    if (hov || sel) {
      labelPill(ctx, r.mid.x, r.mid.y, e.label, v.scale, token('--color-surface'), token('--color-ink'));
    }
    ctx.restore();
  });
}
