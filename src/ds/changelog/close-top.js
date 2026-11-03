/* ADAM/DS — ds/changelog/close-top · one dismissal order ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-4] */
// Exports: closeTop — filter popover, then the phone drawer level, then the
// drawer, then the timeline view. Scrim, ✕, back and Escape all route here so
// two layers never close at once.
import { stepBack } from './mobile.js';
// [plan:2026-11-02_192021-changelog-parity.md#phase-10]
export const closeTop = (st) => {
  if (st.filterOpen) { st.filterOpen = false; return true; }
  if (st.open) {
    if (stepBack(st)) { st.stage = 'list'; return true; }
    st.open = false;
    st.stage = 'list';
    if (st.returnView) { st.view = st.returnView; st.returnView = ''; }
    return true;
  }
  if (st.view === 'timeline') { st.view = 'list'; return true; }
  return false;
};
