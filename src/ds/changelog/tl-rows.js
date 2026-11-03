/* ADAM/DS — ds/changelog/tl-rows · bar, ghost, row markup ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-4] */
// Exports: titleOf, rowHtml — one name per row (longest bout); every bar
// carries the whole lane payload, so the popover never re-parses a plan.
import { geomOf } from './tl-grid.js';
import { spanText } from './tl-meta.js';
import { isSealed } from './raw-detail.js';
const noq = (s) => String(s || '').replace(/"/g, '');
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const titleOf = (p) => p.title || p.file || 'Untitled plan';
const pctOf = (p) => {
  const ss = p.sprints || [];
  if (!ss.length) return 0;
  return Math.round((ss.filter(isSealed).length / ss.length) * 100);
};
const payload = (r, extra) => {
  const m = r.meta || {};
  return [
    ` data-pop="${noq(titleOf(r.p))}"`,
    m.desc ? ` data-desc="${noq(m.desc)}"` : '',
    ` data-ph="${noq(m.ph)}" data-tk="${noq(m.tk)}"`,
    ` data-cm="${noq(m.cm)}" data-rv="${noq(m.revTxt || m.rv)}"`,
    m.dates ? ` data-dates="${noq(m.dates)}"` : '',
    extra || '',
  ].join('');
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
const barHtml = (r, b, i, startMs, pct) => {
  const span = spanText(b.start, b.end);
  const tip = `${titleOf(r.p)} · ${span} · ${b.dates.length}d`;
  const cls = pct < 100 ? ' is-open' : '';
  return [
    `<button class="ds-tl-bar${cls}" data-tl-open="${r.p.file}" data-tl-bout="${r.p.file}:${i}"`,
    payload(r, ` data-tip="${noq(tip)}"`),
    ` style="${geomOf(b.start, b.end, startMs)};--tl-done:${pct}%"`,
    ` aria-label="${noq(tip)}"></button>`,
  ].join('');
};
const ghostHtml = (r, g, startMs) => {
  if (!g) return '';
  const tip = `Due ${g.to}${g.overdue ? ' · overdue' : ''} · ${titleOf(r.p)}`;
  const extra = ` data-tl-ghost="${r.p.file}" data-tip="${noq(tip)}"`;
  return [
    `<button class="ds-tl-ghost${g.overdue ? ' is-overdue' : ''}" data-tl-open="${r.p.file}"`,
    payload(r, extra),
    ` style="${geomOf(g.from, g.to, startMs)}" aria-label="${noq(tip)}"></button>`,
  ].join('');
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const rowHtml = (r, startMs) => {
  const pct = pctOf(r.p);
  const bars = r.bouts.map((b, i) => barHtml(r, b, i, startMs, pct)).join('');
  const label = [
    `<button class="ds-tl-label" data-tl-open="${r.p.file}"`,
    payload(r, '') + ` aria-label="${noq(titleOf(r.p))}">`,
    `<span class="ds-num">${esc(r.seq || r.p.id || '')}</span>`,
    `<span class="ds-tl-label-name">${esc(titleOf(r.p))}</span></button>`,
  ].join('');
  return [
    `<div class="ds-tl-row${r.bouts.length ? ' has-track' : ''}" data-tl-row="${r.p.file}">`,
    label,
    `<div class="ds-tl-lane"><button class="ds-tl-edge is-l" data-tl-edge="l"`,
    ` aria-label="Show earlier track · ${noq(titleOf(r.p))}" hidden>«</button>`,
    bars,
    ghostHtml(r, r.ghost, startMs),
    `<button class="ds-tl-edge is-r" data-tl-edge="r"`,
    ` aria-label="Show later track · ${noq(titleOf(r.p))}" hidden>»</button></div></div>`,
  ].join('');
};
