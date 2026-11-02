/* ADAM/DS — changelog link layer: manifest → phase badges + unlinked list.
   Continuation 20260909_145218_9888b1 — all future plans branch from here.
   [plan:2026-11-02_192021-changelog-parity#phase-2] */
import manifest from './changelog-manifest.json';
const GH = 'https://github.com/IrfanAdam/personal-website/commit/';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
export const commits = manifest.commits || [];
export const wip = manifest.wip || [];
export const continuation = manifest.continuation || '20260909_145218_9888b1';
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Digit-boundary match: `task-1` hits `{#task-1}` but never `{#task-10}`.
// No left guard: `file#anchor` trailer mentions inside prose are true claims.
// Lookbehind falls back to substring on engines without it (old Safari).
// [plan:2026-11-02_192021-changelog-parity#phase-2]
export const anchorHit = (text, anchor) => {
  try {
    const re = new RegExp(`${escRe(String(anchor))}(?![\\d])`);
    return re.test(String(text || ''));
  } catch { return String(text || '').includes(String(anchor)); }
};
export const anchorHitCI = (text, anchor) => {
  try {
    const re = new RegExp(`${escRe(String(anchor))}(?![\\d])`, 'i');
    return re.test(String(text || ''));
  } catch { return String(text || '').toLowerCase().includes(String(anchor).toLowerCase()); }
};
// Per-head token: `Phase|Task|Step N` -> `phase-N` / `task-N` / `step-N`.
const headToken = (head) => {
  const m = String(head || '').match(/^(Phase|Task|Step)\s+(\d+)/i);
  if (!m) return null;
  return `${m[1].toLowerCase()}-${Number(m[2])}`;
};
// Section bodies with synthesized `{#token}` markers, so triage sees the
// same tokens badge hits see even when raw plan text lacks them.
const sectionBodies = (text) => {
  const parts = String(text || '').split(/^## /m);
  parts.shift();
  return parts.map((p) => {
    const nl = p.indexOf('\n');
    const head = (nl < 0 ? p : p.slice(0, nl)).trim();
    const rest = nl < 0 ? '' : p.slice(nl + 1);
    const tok = headToken(head);
    if (tok && !anchorHit(rest, tok)) return `${rest}\n{#${tok}}`;
    return rest;
  });
};
const badge = (c) =>
  `<a href="${GH}${c.full}">${c.sha}</a> ${esc(c.subject)} <small>${c.date}${c.time ? ' ' + esc(c.time) : ''}</small>`;
// anchor-less commits attach to their plan's first phase; anchored ones to the first phase whose text contains the
// anchor (digit-boundary, interpolated-safe).
// [plan:2026-11-02_192021-changelog-parity#phase-2]
export const hits = (file, text, first) => commits
  .filter((c) => c.plan === file && (c.anchor ? anchorHit(text, c.anchor) : first));
export const badges = (list) => (list.length ? `<p class="ds-commits">${list.map(badge).join('<br>')}</p>` : '');
// Plan-wide orphan union: anchored commits no section claims. First-section
// ownership dedupe happens at render (orphanRail), never here.
// [plan:2026-11-02_192021-changelog-parity#phase-2]
export const orphans = (file, sprints) => {
  const owned = new Set();
  (sprints || []).forEach((s) => hits(file, s.body, false).forEach((c) => owned.add(c.sha)));
  return commits.filter((c) => c.plan === file && c.anchor && !owned.has(c.sha));
};
// Triage matches the way hits() matches: whole-text case-insensitive check
// plus per-section synthesized-token check.
// [plan:2026-11-02_192021-changelog-parity#phase-2]
export const unlinked = (texts) => {
  const secCache = {};
  const secHit = (file, anchor) => {
    if (!anchor) return false;
    if (!secCache[file]) secCache[file] = sectionBodies(texts[file] || '');
    return secCache[file].some((b) => anchorHit(b, anchor));
  };
  const xs = commits.filter((c) => !c.plan || !texts[c.plan]
    || (c.anchor && !anchorHitCI(texts[c.plan], c.anchor) && !secHit(c.plan, c.anchor)));
  if (!xs.length
    && !wip.length) return '<h2>Unlinked DS changes</h2><p>All tracked — every DS commit cites its plan.</p>';
  return ['<h2>Unlinked DS changes</h2><p>These cite no plan — link next time via ',
    '<code>[plan:&lt;file&gt;#&lt;anchor&gt;]</code>.</p>'].join('')
    + (xs.length ? `<ul>${xs.map((c) => `<li>${badge(c)}</li>`).join('')}</ul>` : '')
    + (wip.length ? `<p>Uncommitted:</p><ul>${wip.map((w) => `<li><code>${esc(w)}</code></li>`).join('')}</ul>` : '');
};
