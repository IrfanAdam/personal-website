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
// Nearest hidden track per side: a lane can hide a piece on either edge while
// another bout of the same plan is still in view, so the verdict is per track.
// The whole box is kept — revealing needs the far edge, not just the near one.
const edgeOf = (tracks, view) => {
  let l = null;
  let r = null;
  for (const t of tracks) {
    const b = t.getBoundingClientRect();
    if (b.right < view.left + SLOP && (!l || b.right > l.right)) l = b;
    if (b.left > view.right - SLOP && (!r || b.left < r.left)) r = b;
  }
  return { l, r };
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
const syncRow = (row, view) => {
  const { l, r } = edgeOf(tracksOf(row), view);
  const lb = row.querySelector('[data-tl-edge="l"]');
  const rb = row.querySelector('[data-tl-edge="r"]');
  if (lb) lb.hidden = l == null;
  if (rb) rb.hidden = r == null;
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
  // Reveal the nearest hidden bout — the ghost can sit far right of the bars,
  // so picking by DOM order throws the track to the wrong edge.
  const box = dir === 'l' ? edgeOf(tracks, view).l : edgeOf(tracks, view).r;
  if (!box) return;
  // Land the bout's far edge, not its near one: a near-edge nudge leaves most
  // of the bar clipped and clears the caret, so the reveal can never finish.
  const delta = dir === 'l'
    ? box.left - view.left - SLOP
    : box.right - view.right + SLOP;
  sc.scrollBy({ left: delta, behavior: 'smooth' });
};
