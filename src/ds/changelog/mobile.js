/* ADAM/DS — ds/changelog/mobile · viewport contract · [plan:2026-11-02_192021-changelog-parity.md#phase-9] */
// Exports: MOBILE_BP, isMobile, levelOf, stepBack — one 720px contract
// so CSS (max-width: 720px) and JS never disagree about "mobile".
// — Contract —
export const MOBILE_BP = 720;
const QUERY = '(max-width: 720px)';
// [plan:2026-11-02_192021-changelog-parity.md#phase-9]
export function isMobile(width) {
  if (typeof width === 'number') return width <= MOBILE_BP;
  if (typeof matchMedia === 'function') return matchMedia(QUERY).matches;
  if (typeof innerWidth === 'number') return innerWidth <= MOBILE_BP;
  return false;
}
// Stage doubles as level: list = L1, tasks = L2.
// [plan:2026-11-02_192021-changelog-parity.md#phase-9]
export function levelOf(st) {
  if (!st) return 1;
  return st.stage === 'tasks' ? 2 : 1;
}
// Pure: reports whether a back step applies; the caller sets stage.
// [plan:2026-11-02_192021-changelog-parity.md#phase-9]
export function stepBack(st, width) {
  if (!st) return false;
  if (st.stage !== 'tasks') return false;
  return isMobile(width);
}
