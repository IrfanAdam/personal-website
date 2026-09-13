/* ADAM/FX — views/glitch-sound/geom · proximity · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
const R = 260, HOVER_R = 18;
export function prox(el, mx, my) { if (!el) return 0.6;
  if (mx < -5e3) return 0.6;
  const r = el
    .getBoundingClientRect();
  const dx = Math
    .max(r.left - mx, 0, mx - r.right);
  const dy = Math
    .max(r.top - my, 0, my - r.bottom);
  const d = Math
    .hypot(dx, dy);
  if (d >= R) return 0;
  return 1 - d / R;
}
export function isOver(el, px, py) { if (!el) return false;
  const r = el
    .getBoundingClientRect();
  const cx = r
    .left + r
    .width / 2, cy = r
    .top + r
    .height / 2;
  return Math
    .hypot(px - cx, py - cy) < HOVER_R || (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom);
}
