/* ADAM/DS — ds/changelog/version-poll · poll · [plan:2026-11-02_192021-changelog-parity.md#phase-4] */
// Exports: checkVersion, createVersionPoll — reports change only, never reloads, no DOM
// — Single check —
const VERSION_URL = 'version.json';
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const checkVersion = async (knownSha, fetchImpl) => {
  const run = fetchImpl || globalThis.fetch;
  if (typeof run !== 'function') return { sha: knownSha, changed: false };
  const res = await run(VERSION_URL, { cache: 'no-store' });
  if (!res || !res.ok) return { sha: knownSha, changed: false };
  const body = await res.json();
  const sha = body && typeof body.sha === 'string' ? body.sha : null;
  if (!sha) return { sha: knownSha, changed: false };
  return { sha, changed: knownSha !== null && knownSha !== undefined && sha !== knownSha };
};
// — Interval watcher —
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const createVersionPoll = (opts = {}) => {
  const everyMs = opts.everyMs || 30000;
  const onChange = opts.onChange;
  const fetchImpl = opts.fetchImpl;
  let known = null;
  let timer = null;
  const tick = async () => {
    try {
      const r = await checkVersion(known, fetchImpl);
      if (!r.sha) return;
      if (known === null) known = r.sha;
      else if (r.sha !== known) {
        const prev = known;
        known = r.sha;
        if (typeof onChange === 'function') onChange(r.sha, prev);
      }
    } catch { return; }
  };
  return {
    start: () => {
      if (timer) return;
      timer = setInterval(tick, everyMs);
      tick();
    },
    stop: () => {
      if (timer) clearInterval(timer);
      timer = null;
    },
    run: tick,
  };
};
