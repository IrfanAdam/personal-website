/* ADAM/DS — ds/changelog/deep-links · links · [plan:2026-11-02_192021-changelog-parity.md#phase-4] */
// Exports: parseDeepLinks, buildDeepLink — pure, no DOM, no location access
// — Guards —
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const SHA = /^[0-9a-f]{4,64}$/i;
const BOUT = /^\d+$/;
const cleanDay = (v) => {
  const s = String(v || '').trim();
  if (!ISO.test(s)) return '';
  return Number.isNaN(Date.parse(`${s}T00:00:00Z`)) ? '' : s;
};
const cleanSha = (v) => {
  const s = String(v || '').trim();
  return SHA.test(s) ? s.toLowerCase() : '';
};
const cleanBout = (v) => {
  const s = String(v === null || v === undefined ? '' : v).trim();
  return BOUT.test(s) ? Number(s) : null;
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const parseDeepLinks = (search = '') => {
  const q = new URLSearchParams(String(search || ''));
  const view = q.get('view') === 'timeline' ? 'timeline' : 'list';
  const plan = String(q.get('plan') || '').trim();
  return {
    day: cleanDay(q.get('day')),
    sha: cleanSha(q.get('sha')),
    view,
    plan,
    bout: cleanBout(q.get('bout')),
  };
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const buildDeepLink = (sel = {}) => {
  const q = new URLSearchParams();
  if (sel.day) q.set('day', sel.day);
  if (sel.sha) q.set('sha', sel.sha);
  if (sel.view === 'timeline') q.set('view', 'timeline');
  if (sel.plan) q.set('plan', sel.plan);
  if (sel.bout !== null && sel.bout !== undefined) q.set('bout', String(sel.bout));
  const s = q.toString();
  return s ? `?${s}` : '';
};
