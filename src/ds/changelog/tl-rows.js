/* ADAM/DS — ds/changelog/tl-rows · bar, ghost, row markup ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-4] */
// Exports: titleOf, rowHtml — exactly one bar name per row, on its longest bout
import { DAY, atMid, geomOf, spanText } from './tl-grid.js';
const noq = (s) => String(s || '').replace(/"/g, '');
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const titleOf = (p) => p.title || p.file || 'Untitled plan';
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
const pctOf = (p) => {
  const ss = p.sprints || [];
  if (!ss.length) return 0;
  const done = ss.filter((s) => /✓/.test(String(s.head || ''))).length;
  return Math.round((done / ss.length) * 100);
};
const daysOf = (b) => Math.round((atMid(b.end) - atMid(b.start)) / DAY) + 1;
const longestIdx = (bs) => {
  let bi = 0;
  bs.forEach((b, i) => { if (daysOf(b) > daysOf(bs[bi])) bi = i; });
  return bi;
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
const barHtml = (p, b, i, startMs, named, pct) => {
  const tip = `${titleOf(p)} · ${spanText(b.start, b.end)} · ${b.dates.length}d`;
  const name = named ? `<span class="ds-tl-barname">${esc(titleOf(p))}</span>` : '';
  return [
    `<button class="ds-tl-bar" data-tl-open="${p.file}" data-tl-bout="${p.file}:${i}"`,
    ` data-tip="${noq(tip)}" data-pop="${noq(titleOf(p))}"`,
    ` style="${geomOf(b.start, b.end, startMs)};--tl-done:${pct}%"`,
    ` aria-label="${noq(tip)}">${name}</button>`,
  ].join('');
};
const ghostHtml = (p, g, startMs) => {
  if (!g) return '';
  const tip = `Due ${g.to}${g.overdue ? ' · overdue' : ''} · ${titleOf(p)}`;
  return [
    `<button class="ds-tl-ghost${g.overdue ? ' is-overdue' : ''}" data-tl-open="${p.file}"`,
    ` data-tl-ghost="${p.file}" data-due="${g.to}" data-tip="${noq(tip)}"`,
    ` style="${geomOf(g.from, g.to, startMs)}" aria-label="${noq(tip)}"></button>`,
  ].join('');
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const rowHtml = (r, startMs) => {
  const named = r.bouts.length ? longestIdx(r.bouts) : -1;
  const pct = pctOf(r.p);
  const bars = r.bouts.map((b, i) => barHtml(r.p, b, i, startMs, i === named, pct)).join('');
  const bare = r.bouts.length ? '' : [
    `<button class="ds-tl-lane-name" data-tl-open="${r.p.file}"`,
    ` data-tip="${noq(titleOf(r.p))}">${esc(titleOf(r.p))}</button>`,
  ].join('');
  return [
    `<div class="ds-tl-row" data-tl-row="${r.p.file}" data-pop="${noq(titleOf(r.p))}">`,
    `<div class="ds-tl-lane"><button class="ds-tl-edge is-l" data-tl-edge="l"`,
    ` aria-label="Scroll track into view" hidden>«</button>`,
    bars,
    ghostHtml(r.p, r.ghost, startMs),
    bare,
    `<button class="ds-tl-edge is-r" data-tl-edge="r"`,
    ` aria-label="Scroll track into view" hidden>»</button></div></div>`,
  ].join('');
};
