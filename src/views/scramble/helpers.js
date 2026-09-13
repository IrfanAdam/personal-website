/* ADAM/FX — views/scramble/helpers · charsets · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
export const MAP = { upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowerCase: 'abcdefghijklmnopqrstuvwxyz',
  upperAndLowerCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' };
export const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
export const charsFor = (c) => MAP[c] || (typeof c==='string' && c.length ? c : MAP.upperCase);
export const rnd = (cs) => cs[Math.floor(Math.random()*cs.length)];
export const reduced = () => {
  try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
};
export const active = new WeakMap();
export function killScramble(el){ const a=active.get(el); if(a) a.kill(); }
