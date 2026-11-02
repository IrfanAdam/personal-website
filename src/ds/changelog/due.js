/* ADAM/DS — src/ds/changelog/due.js · Due dates for incomplete sections only */
// Exports: parseDue, dueOf
// [plan:2026-11-02_192021-changelog-parity#phase-2]

// — Matchers —
const DUE_LINE = /^\s*\*?Due:\s*(\d{4})-(\d{2})-(\d{2})\*?\s*$/;
const DUE_DIM = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const SHIP_SEAL = /\(ship\)[^\n]*\bPASSED\b/;

// — Parsing —
// First Due-shaped line wins (`*Due: YYYY-MM-DD*` or bare `Due: YYYY-MM-DD`).
// Malformed, out-of-range, or impossible calendar dates → null, never throws.
// [plan:2026-11-02_192021-changelog-parity#phase-2]
export const parseDue = (body) => {
  for (const ln of String(body || '').split('\n')) {
    const m = ln.match(DUE_LINE);
    if (!m) continue;
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    if (y < 1 || y > 2099 || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    if (d > (mo === 2 && leap ? 29 : DUE_DIM[mo - 1])) return null;
    return `${m[1]}-${m[2]}-${m[3]}`;
  }
  return null;
};

// Due honored for incomplete sections only: a head carrying ✓/✗, a body
// whose checkboxes are all done, or a shipped marker (head word or sealed
// ship gate) yields null — done/shipped work never grows a ghost.
// section = { head, body }.
// [plan:2026-11-02_192021-changelog-parity#phase-2]
export const dueOf = (section) => {
  if (!section) return null;
  const head = String(section.head || '');
  const body = String(section.body || '');
  if (/[✓✗]/.test(head)) return null;
  if (/shipped/i.test(head)) return null;
  if (SHIP_SEAL.test(body)) return null;
  const done = (body.match(/^[ \t]*-[ \t]*\[x\]/gim) || []).length;
  const open = (body.match(/^[ \t]*-[ \t]*\[ \]/gm) || []).length;
  if (done + open > 0 && open === 0) return null;
  return parseDue(body);
};
