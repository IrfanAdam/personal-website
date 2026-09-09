/* Graduated motion tokens — getComputedStyle with shipped-literal fallback,
   so first paint is pixel-identical with or without the token. Read at
   attach/call time (never per-frame): getComputedStyle per cell costs. */
const raw = (n) => {
  try { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  catch { return ''; }
};
export const fxVar = (n, fb) => raw(n) || fb;
export const fxNum = (n, fb) => {
  const v = parseFloat(raw(n));
  return Number.isFinite(v) ? v : fb;
};
export const fxMs = (n, fb) => {
  const m = raw(n).match(/^([\d.]+)\s*(ms|s)?$/);
  if (!m) return fb;
  const v = parseFloat(m[1]);
  return m[2] === 's' ? v * 1000 : v;
};
