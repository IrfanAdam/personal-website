/* ADAM/DS — ds/changelog/close-top · one dismissal order ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-4] */
// Exports: closeTop — filter popover, then drawer, then the timeline view.
// Scrim, ✕ and Escape all route here so two layers never close at once.
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const closeTop = (st) => {
  if (st.filterOpen) { st.filterOpen = false; return true; }
  if (st.open) {
    st.open = false;
    st.stage = 'list';
    if (st.returnView) { st.view = st.returnView; st.returnView = ''; }
    return true;
  }
  if (st.view === 'timeline') { st.view = 'list'; return true; }
  return false;
};
