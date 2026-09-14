/* ADAM/DS — ds/changelog-events · drawer + filter interactions ·
   [plan:2026-09-12_150255-glitch-sound.md#phase-6] */
// Exports: bindChangelogEvents — click/key/hover wiring over shared state st
import { playVoice } from '../views/element-sound.js';
import { untilGlitch } from '../views/glitch-sound/timing.js';
// — Sound hotspot —
const TODAY_SEL = '.ds-day.is-today';
const NEAR_R = 260;
const NEAR_FLOOR = 1500;
const isReduced = () => {
  try {
    return matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};
// — Events —
export function bindChangelogEvents(root, st, helpers) {
  const { cur, doPaint } = helpers;
  let lastNear = 0, pending = 0, px = 0, py = 0;
  const onClick = (e) => {
    if (e.target.closest('[data-day-clear]')) { st.day = ''; st.sel = [0, 0]; doPaint(root); return; }
    const dd = e.target.closest('[data-day]');
    if (dd) { st.day = st.day === dd.dataset.day ? '' : dd.dataset.day;
      st.sel = [0, 0]; doPaint(root); return; }
    const chip = e
      .target
      .closest('.ds-chip');
    if (chip) { const t = chip.dataset.tag;
      if (!t) { st.active = new Set();
        st.day = '';
      } else { st.active.has(t) ? st.active.delete(t) : st.active.add(t);
      } st.sel = [0,
        0]; doPaint(root); return; }
    if (e.target.closest('[data-close]')
      || e.target.closest('[data-scrim]')) { st.open = false; st.stage = 'list'; doPaint(root); return; }
    if (e.target.closest('[data-back]')) { st.stage = 'list'; doPaint(root); return; }
    const step = e.target.closest('[data-step]');
    if (step && !step.disabled) { const c = cur(); st.sel = [c.pi,
        Math.min(Math.max(c.si + Number(step.dataset.step), 0),
          c.sprints.length - 1)]; st.open = true; doPaint(root); return; }
    const b = e.target.closest('.ds-pick'); if (!b) return;
    const col = b.closest('[data-col]'), i = [...col.querySelectorAll('.ds-pick')].indexOf(b);
    if (col.dataset.col === 'plan') { st.sel = [i,
        st.sel[1]]; st.open = true; st.stage = 'tasks'; } else { st.sel = [st.sel[0],
        i]; st.stage = 'tasks'; }
    doPaint(root);
  };
  const onKey = (e) => { if (e.key === 'Escape' && st.open) { st.open = false; doPaint(root); } };
  const move = (e) => {
    const el = e.target.closest('[data-tip]'), tip = root.querySelector('.ds-cursor-tip');
    if (!tip) return;
    if (!el) { tip.hidden = true; return; }
    tip.textContent = el.dataset.tip; tip.hidden = false;
    const pad = 14; let x = e.clientX + pad, y = e.clientY + pad;
    const r = tip.getBoundingClientRect();
    if (x + r.width > innerWidth - 8) x = e.clientX - r.width - pad;
    if (y + r.height > innerHeight - 8) y = e.clientY - r.height - pad;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  };
  const fire = () => {
    pending = 0;
    const el = root.querySelector(TODAY_SEL);
    if (!el) return;
    const b = el.getBoundingClientRect();
    const ox = Math.max(b.left - px, 0, px - b.right);
    const oy = Math.max(b.top - py, 0, py - b.bottom);
    const inside = Math.hypot(ox, oy) === 0;
    const gain = inside ? 0.55 : 0.06 + 0.2 * (1 - Math.hypot(ox, oy) / NEAR_R);
    try { playVoice('hum', { ms: inside ? 320 : 480, gain }); } catch {}
  };
  const humNear = (e) => {
    if (isReduced() || pending) return;
    const t = root.querySelector(TODAY_SEL);
    if (!t) return;
    const r = t.getBoundingClientRect();
    const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
    const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
    if (Math.hypot(dx, dy) >= NEAR_R) return;
    const now = Date.now();
    if (now - lastNear < NEAR_FLOOR) return;
    lastNear = now;
    px = e.clientX;
    py = e.clientY;
    const wait = untilGlitch(t);
    if (wait > 24 && wait < 3000) pending = setTimeout(fire, wait);
    else fire();
  };
  const hideTip = () => { const t = root.querySelector('.ds-cursor-tip'); if (t) t.hidden = true; };
  root.addEventListener('click', onClick); document.addEventListener('keydown', onKey);
  root.addEventListener('mousemove', move); root.addEventListener('pointermove', humNear);
  document.addEventListener('mouseleave', hideTip);
  return () => { if (pending) clearTimeout(pending);
    root.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey);
    root.removeEventListener('mousemove', move); root.removeEventListener('pointermove', humNear);
    document.removeEventListener('mouseleave', hideTip); };
}
