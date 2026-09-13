/* ADAM/DS — ds/foundations-mix · color mixer demo ·
   [plan:2026-09-13_235413-over-limit-splits.md#phase-2] */
// Exports: makeMix — mixer refresh over sw/aSel/bSel/tIn/tOut/val elements
import { cssVar, toRGB } from './specimens.js';

export function makeMix(els) {
  const { sw, aSel, bSel, tIn, tOut, val } = els;
  const refreshMix = () => {
    if (!sw || !aSel || !bSel || !tIn) return;
    const t = Number(tIn.value) / 100; if (tOut) tOut.textContent = t.toFixed(2);
    const mc = [0,
      1,
      2].map((i) => toRGB(cssVar(aSel.value)
          || '#16130e')[i] * (1 - t) + toRGB(cssVar(bSel.value)
          || '#e8442e')[i] * t);
    const hex = '#' + mc.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
    sw.style.background = hex; if (val) val.textContent = [
      aSel.value,
      ` ↔ `,
      bSel.value,
      ` @ `,
      t.toFixed(2),
      ` → `,
      hex,
      ` · var mix`,
    ].join('');
    sw.dataset.hex = hex; sw.dataset.var = [
      `color-mix(in srgb, var(`,
      aSel.value,
      `) `,
      Math.round((1 - t) * 100),
      `%, var(`,
      bSel.value,
      `))`,
    ].join('');
  };
  return { refreshMix };
}
