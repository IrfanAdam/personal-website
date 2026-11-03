/* ADAM/DS — ds/changelog/tl-edges · sticky month badge + per-row carets ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-4] */
// Exports: syncTlEdges, revealTrack — geometry reads only, no state writes
const SLOP = 24;
// The plan-label column is sticky over the lane's left edge, so everything to
// its left is hidden: reveal tests measure the pane's inner edge, not the raw
// scroll box (a track behind that column is not "visible").
const padOf = (root) => {
  const lab = root && root.querySelector('.ds-tl-label');
  return lab ? lab.getBoundingClientRect().width : 0;
};
const paneOf = (sc, pad) => {
  const vr = sc.getBoundingClientRect();
  return { left: vr.left + pad, right: vr.right };
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
const syncBadge = (host, view) => {
  const badge = host.querySelector('[data-tl-curmonth]');
  if (!badge) return;
  const ticks = host.querySelector('.ds-tl-ticks');
  // The ticks strip is pulled left by the badge width while it shows; measure
  // the un-shifted position or the compensation feeds back into the verdict.
  const shift = ticks ? parseFloat(ticks.style.marginLeft || '0') || 0 : 0;
  const realLeft = (el) => el.getBoundingClientRect().left - shift;
  const months = [...host.querySelectorAll('.ds-tl-tick.is-month')];
  let cur = '';
  let curLeft = Infinity;
  for (const m of months) {
    const l = realLeft(m);
    if (l <= view.left + SLOP) { cur = m.textContent; curLeft = l; }
  }
  if (!cur && months.length) {
    cur = months[0].textContent;
    curLeft = realLeft(months[0]);
  }
  if (badge.textContent !== cur) badge.textContent = cur;
  const show = !!(cur && curLeft < view.left);
  badge.hidden = !show;
  if (!ticks) return;
  const want = show ? `${-badge.offsetWidth}px` : '';
  if (ticks.style.marginLeft !== want) ticks.style.marginLeft = want;
};
const tracksOf = (row) => [...row.querySelectorAll('[data-tl-bout],[data-tl-ghost]')];
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
const syncRow = (row, view) => {
  const tracks = tracksOf(row);
  const l = row.querySelector('[data-tl-edge="l"]');
  const r = row.querySelector('[data-tl-edge="r"]');
  if (!tracks.length) {
    if (l) l.hidden = true;
    if (r) r.hidden = true;
    return;
  }
  const first = tracks[0].getBoundingClientRect();
  const last = tracks[tracks.length - 1].getBoundingClientRect();
  if (l) l.hidden = !(last.right < view.left + SLOP);
  if (r) r.hidden = !(first.left > view.right - SLOP);
};
// Reveal only what sits outside the visible window — never yanks a visible row.
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const syncTlEdges = (host) => {
  if (!host) return;
  const sc = host.querySelector('.ds-tl-scroll');
  if (!sc) return;
  const view = paneOf(sc, padOf(host));
  syncBadge(host, view);
  host.querySelectorAll('[data-tl-row]').forEach((row) => syncRow(row, view));
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const revealTrack = (row, dir) => {
  const sc = row && row.closest('.ds-tl-scroll');
  const tracks = row ? tracksOf(row) : [];
  if (!sc || !tracks.length) return;
  const view = paneOf(sc, padOf(row));
  const box = (dir === 'l' ? tracks[tracks.length - 1] : tracks[0]).getBoundingClientRect();
  const delta = dir === 'l' ? box.right - view.left - SLOP : box.left - view.right + SLOP;
  sc.scrollBy({ left: delta, behavior: 'smooth' });
};
