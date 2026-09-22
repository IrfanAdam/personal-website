/* ADAM/FX — views/rise-layout · height maths · [plan:2026-09-22_141500-housekeeping-refactor.md#{#phase-2}] */
// Exports: calcHeights(box) -> {finalH, placeholderH}
export function calcHeights(box) {
  const w = parseFloat(box.dataset.w) || 3;
  const h = parseFloat(box.dataset.h) || 4;
  const cw = box.getBoundingClientRect().width || window.innerWidth - 24;
  const finalH = Math.round(cw * (h / w));
  let placeholderH = Math.round(Math.min(420, Math.max(300, cw * 0.82)));
  if (finalH - placeholderH < 28) placeholderH = Math.max(220, finalH - 80);
  placeholderH = Math.min(placeholderH, finalH - 24);
  if (placeholderH < 180) placeholderH = Math.min(220, finalH - 24);
  return { finalH, placeholderH };
}
