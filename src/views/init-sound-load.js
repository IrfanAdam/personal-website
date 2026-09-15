/* ADAM/FX — views/init-sound-load · legacy loader no-op · [plan:2026-09-13_235413-over-limit-splits.md#phase-3] */
// Exports: initLoadScan — kept for compat; sound now owned by title-reveal.
// Previously this fired a once-per-session 520ms sweep at 820ms, which drifted
// from the headline scramble. Now the single load sound is triggered atomically
// with the first-and-only scramble via mountTitleReveal, so initLoadScan is a
// no-op (avoids double/dedupe races). Channel arg retained for call-site compat.
export function initLoadScan(channel) {
  void channel;
}
