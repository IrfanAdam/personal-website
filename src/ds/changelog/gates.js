/* ADAM/DS — src/ds/changelog/gates.js · REF GATE verdicts by heading number */
// Exports: parseGates, gateTag, planGateTag
// [plan:2026-11-02_192021-changelog-parity#phase-2]

// — Matchers —
const GATE_N = (n) => new RegExp(`REF GATE\\s+0*${n}\\b`);
const REV_LINE = /·\s*rev\s+\d{4}-\d{2}-\d{2}/;
const firstDate = (s) => (s.match(/(20\d{2}-\d{2}-\d{2})/) || [])[1] || '';

// — Verdicts —
// Verdict parser for lines shaped like REF GATE N STATUS.
// Explicit uppercase verdict words only: PASSED → passed, FAILED → failed,
// anything else (incl. explicit OPEN) → open. Lowercase prose such as
// "fails" never counts: the FAILED test skips backtick spans.
// [plan:2026-11-02_192021-changelog-parity#phase-2]
export const parseGates = (head, body) => {
  const m = String(head).match(/(?:Task|Phase|Step)\s+0*(\d+)/);
  if (!m) return null;
  const lines = String(body).split('\n').filter((l) => GATE_N(m[1]).test(l));
  if (!lines.length) return null;
  const revs = lines.filter((l) => REV_LINE.test(l));
  const bases = lines.filter((l) => !REV_LINE.test(l));
  const src = bases.length ? bases[bases.length - 1] : lines[lines.length - 1];
  const code = src.replace(/`[^`]*`/g, '');
  let verdict = 'open';
  if (/\bPASSED\b/.test(src)) verdict = 'passed';
  else if (/\bFAILED\b/.test(code)) verdict = 'failed';
  return {
    n: m[1],
    verdict,
    revCount: revs.length,
    ship: /\(ship\)/.test(lines.join('\n')),
    bases,
    revLines: revs,
    baseDate: firstDate(src)
  };
};

// Section suffix: `2/3 · GATE PASSED · 1 rev` (frac optional).
// [plan:2026-11-02_192021-changelog-parity#phase-2]
export const gateTag = (head, body, frac) => {
  const g = parseGates(head, body);
  if (!g) return '';
  let v = 'GATE OPEN';
  if (g.verdict === 'passed') v = 'GATE PASSED';
  else if (g.verdict === 'failed') v = 'GATE FAILED';
  const rev = g.revCount ? ` · ${g.revCount} rev${g.revCount > 1 ? 's' : ''}` : '';
  return frac ? `${frac} · ${v}${rev}` : `${v}${rev}`;
};

// Plan rollup: failed outranks open outranks passed.
// [plan:2026-11-02_192021-changelog-parity#phase-2]
export const planGateTag = (sprints) => {
  const gs = sprints.map((s) => parseGates(s.head, s.body)).filter(Boolean);
  if (!gs.length) return '';
  if (gs.some((g) => g.verdict === 'failed')) return 'GATE FAILED';
  if (gs.some((g) => g.verdict === 'open')) return 'GATE OPEN';
  return 'GATE PASSED';
};
