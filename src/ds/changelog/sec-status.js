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
  const rev = g.revCount ? ` · ${g.revCount} rev${g.revCount > 1 ? 's' : ''}` : '';
  if (g.verdict === 'passed') return ` ✓ GATE PASSED${rev}`;
  if (g.verdict === 'failed') return ` · GATE FAILED${rev}`;
  return ` · GATE OPEN${rev}`;
};
// — Status lines —
// [plan:2026-11-02_192021-changelog-parity.md#phase-7]
export const joinStatus = (lead, suffix) => {
  const gate = String(suffix || '').replace(/^\s*[✓·]\s*/, '').trim();
  return gate ? `${lead} · ${esc(gate)}` : lead;
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-7]
export const gatePassed = (s) => /^\s*✓/.test(String(s || '')) || /waiv/i.test(String(s || ''));
// [plan:2026-11-02_192021-changelog-parity.md#phase-7]
export const gateOnlyLine = (suffix) => {
  const t = String(suffix || '').replace(/^[✓·\s]+/, '').trim();
  const cls = gatePassed(suffix) ? 'ds-is-done' : 'ds-is-gate';
  return t ? `<p class="ds-status ${cls}">${esc(t)}</p>` : '';
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-7]
export const headStatus = (headText, suffix, frac) => {
  const clean = String(headText || '').replace(/\{#([^}]*)\}/g, '').trim();
  const m = clean.match(/\s*([✓✗])\s*(done|cancelled)(\s*\([^)]*\))?\s*$/i);
  if (!m) return gateOnlyLine(suffix);
  const paren = m[3] || '';
  const bit = m[1] === '✗' ? `✗ cancelled${esc(paren)}` : `✓ DONE${esc(paren)}`;
  const lead = frac ? `${frac} · ${bit}` : bit;
  const cls = m[1] === '✗' ? 'ds-is-cancelled' : 'ds-is-done';
  return `<p class="ds-status ${cls}">${joinStatus(lead, suffix)}</p>`;
};
