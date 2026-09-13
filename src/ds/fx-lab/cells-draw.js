/* ADAM/DS — fx-lab/cells-draw · mosaic painter · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: makeDraw(ctx, canvas, get) — verbatim lab painter, no logic change
import { clamp01, easeOut, mix } from '../../views/masonry/cells.js';
import { rgb, mix3 } from './color.js';

// — Factory: getters keep split/pal/root live —
export function makeDraw(ctx, canvas, get) {
  return () => {
    const { root, P, split, pal, hasTex } = get();
    const W = canvas.width, H = canvas.height;
    if (!W || !H || !root) return;
    ctx.fillStyle = rgb(pal.bg);
    ctx.fillRect(0, 0, W, H);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const gut = P.gut * dpr * (1 - clamp01((split - 0.35) / 0.4));
    const walk = (c, px, py, pw, ph) => {
      if (!c.kids || split < c.splitAt) {
        const g = gut / 2;
        const frontier = split - c.splitAt;
        let col;
        if (hasTex) col = [c.r, c.g, c.b];
        else col = mix3(pal.bg, pal.ink, 0.1 + c.tone * 0.45);
        if (!hasTex && c.splitAt > -1 && frontier >= 0 && frontier < 0.09) col = mix3(col, pal.accent, 0.55);
        else if (hasTex && c.splitAt > -1 && frontier >= 0 && frontier < 0.09) col = mix3(col, pal.accent, 0.35);
        ctx.fillStyle = rgb(col);
        ctx.fillRect(px + g, py + g, Math.max(0, pw - gut), Math.max(0, ph - gut));
        return;
      }
      const tt = easeOut(clamp01((split - c.splitAt) / P.morph));
      for (const k of c.kids) {
        const nx = mix(px, k.x * W, tt);
        const ny = mix(py, k.y * H, tt);
        const nw = mix(pw, k.w * W, tt);
        const nh = mix(ph, k.h * H, tt);
        walk(k, nx, ny, nw, nh);
      }
    };
    walk(root, 0, 0, W, H);
  };
}
