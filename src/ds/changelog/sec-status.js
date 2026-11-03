/* ADAM/DS — ds/changelog/sec-status · gate suffix + status lines ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-7] */
// Exports: suffixOf, gatePassed, joinStatus, gateOnlyLine, headStatus
import { parseGates } from './gates.js';
import { esc } from './fmt-text.js';
// — Gate suffix —
// [plan:2026-11-02_192021-changelog-parity.md#phase-7]
export const suffixOf = (head, rawBody) => {
  const g = parseGates(head, rawBody);
  if (!g) return '';
  if (g.verdict === 'passed') return ' ✓ GATE PASSED';
  if (g.verdict === 'failed') return ' · GATE FAILED';
  return ' · GATE OPEN';
};
// — Status lines —
// [plan:2026-11-02_192021-changelog-parity.md#phase-7]
export const gatePassed = (s) => /^\s*✓/.test(String(s || '')) || /waiv/i.test(String(s || ''));
const gateWord = (suffix) => {
  const t = String(suffix || '');
  if (/passed/i.test(t)) return 'GATE PASSED';
  if (/failed/i.test(t)) return 'GATE FAILED';
  return t.trim() ? 'GATE OPEN' : '';
};
const fracOf = (s) => {
  const m = String(s || '').match(/\d+\/\d+/);
  return m ? m[0] : '';
};
// One verdict per line: a done/cancelled marker always wins, so a gate suffix
// can never repeat a verdict that the marker already stated.
const verdictOf = (lead, suffix) => {
  const t = String(lead || '');
  if (/✗\s*cancelled/i.test(t)) return '✗ cancelled';
  if (/✓\s*done/i.test(t)) return '✓ DONE';
  return gateWord(suffix);
};
const part = (kind, text) => `<span class="ds-status-${kind}">${text}</span>`;
const lineInner = (frac, verdict) => {
  const bits = [];
  if (frac) bits.push(part('frac', frac));
  if (verdict) bits.push(part('verdict', verdict));
  return bits.join(part('sep', ' · '));
};
const line = (cls, frac, verdict) => {
  const inner = lineInner(frac, verdict);
  if (!inner) return '';
  return `<p class="ds-status ${cls}">${inner}</p>`;
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-7]
export const joinStatus = (lead, suffix) => lineInner(fracOf(lead), verdictOf(lead, suffix));
// [plan:2026-11-02_192021-changelog-parity.md#phase-7]
export const gateOnlyLine = (suffix, frac) => line('ds-is-gate', fracOf(frac), gateWord(suffix));
// [plan:2026-11-02_192021-changelog-parity.md#phase-7]
export const headStatus = (headText, suffix, frac) => {
  const clean = String(headText || '').replace(/\{#([^}]*)\}/g, '').trim();
  const m = clean.match(/\s*([✓✗])\s*(done|cancelled)(\s*\([^)]*\))?\s*$/i);
  if (!m) return gateOnlyLine(suffix, frac);
  const paren = esc(m[3] || '');
  const stop = m[1] === '✗';
  if (stop) return line('ds-is-cancelled', fracOf(frac), `✗ cancelled${paren}`);
  return line('ds-is-done', fracOf(frac), `✓ DONE${paren}`);
};
