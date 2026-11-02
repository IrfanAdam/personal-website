/* ADAM/DS — ds/changelog/boot · deep-link + version-poll boot · [plan:2026-11-02_192021-changelog-parity#phase-4] */
// Exports: bootState, bootPoll — mount-time only, no paint logic
import { parseDeepLinks } from './deep-links.js';
import { createVersionPoll } from './version-poll.js';
// Applies ?day= ?sha= ?view=timeline&plan=&bout= onto state before first paint.
// [plan:2026-11-02_192021-changelog-parity#phase-4]
export const bootState = (st, plans, commits) => {
  try {
    const q = parseDeepLinks(location.search);
    if (q.day) st.day = q.day;
    if (q.view) st.view = q.view;
    const shaHit = q.sha && (commits.find((c) => (c.sha || '').startsWith(q.sha)) || {});
    const pick = q.plan || (shaHit && shaHit.plan);
    if (pick) {
      const i = plans.findIndex((p) => p.file === pick);
      if (i > -1) { st.sel = [i, 0]; st.open = true; st.stage = 'tasks'; }
    }
    if (q.bout !== null && q.bout !== undefined) st.tlSel = { planFile: q.plan, boutIdx: q.bout };
  } catch {}
};
// Version poll: banner only, never reloads itself; stop on unmount.
// [plan:2026-11-02_192021-changelog-parity#phase-4]
export const bootPoll = (root) => {
  let poll = null;
  try {
    poll = createVersionPoll({ everyMs: 30000, onChange: () => {
      if (root.querySelector('[data-ver-note]')) return;
      const bar = document.createElement('button');
      bar.dataset.verNote = '1';
      bar.className = 'ds-ver-note';
      bar.textContent = 'New build available — click to refresh';
      bar.addEventListener('click', () => location.reload());
      root.prepend(bar);
    } });
    poll.start();
  } catch {}
  return () => { try { poll && poll.stop(); } catch {} };
};
