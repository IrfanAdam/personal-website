/* ADAM/PAGE — views/promo-video-scrub · pointer scrub · [plan:2026-10-26_000000-lump-sum-builds.md#{#phase-2}] */
// Exports: bindScrub(track, seekFrac)
// — Scrub —
export function bindScrub(track, seekFrac) {
  if (!track) return () => {};
  let active = false;
  const frac = (e) => {
    const r = track.getBoundingClientRect();
    if (!r.width) return 0;
    const x = Math.min(Math.max(0, e.clientX - r.left), r.width);
    return x / r.width;
  };
  const down = (e) => { active = true; seekFrac(frac(e)); };
  const move = (e) => { if (active) seekFrac(frac(e)); };
  const up = () => { active = false; };
  const tap = (e) => seekFrac(frac(e));
  const binds = [
    [track, 'pointerdown', down],
    [track, 'click', tap],
    [window, 'pointermove', move],
    [window, 'pointerup', up],
    [window, 'pointercancel', up],
  ];
  binds.forEach(([el, ev, fn]) => { try { el.addEventListener(ev, fn); } catch {} });
  return () => {
    binds.forEach(([el, ev, fn]) => { try { el.removeEventListener(ev, fn); } catch {} });
  };
}
