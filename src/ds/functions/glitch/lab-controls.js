/* ADAM/DS — glitch/lab-controls · visual + tabs + sync · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: mountLabControls(root, snd) — trigger/dur/int, tabs, sync, pause
import { attachGlitch, glitchOnce, pauseGlitch, resumeGlitch } from '../../../views/glitch.js';

// — Bind —
export function mountLabControls(root, snd) {
  const q = (s) => root.querySelector(s);
  const demos = [...root.querySelectorAll('[data-lab]')];
  const stops = [];
  const offs = [];
  const on = (el, ev, fn) => {
    if (!el) return;
    el.addEventListener(ev, fn);
    offs.push(() => el.removeEventListener(ev, fn));
  };
  const trig = q('[data-ctl="trigger"]');
  const dur = q('[data-ctl="dur"]');
  const int = q('[data-ctl="int"]');
  const apply = () => {
    stops.splice(0).forEach((fn) => { try { fn(); } catch {} });
    demos.forEach((el) => stops.push(attachGlitch(el, { trigger: trig.value })));
  };
  [trig, dur, int].forEach((c) => on(c, 'input', apply));
  on(q('[data-ctl="fire"]'), 'click', () => demos.forEach((el) => glitchOnce(el)));
  let paused = false;
  const pause = q('[data-ctl="pause"]');
  on(pause, 'click', () => {
    paused = !paused;
    demos.forEach((el) => (paused ? pauseGlitch(el) : resumeGlitch(el)));
  });
  const tabBar = q('[data-glitch-tabs]');
  const onTabs = (e) => {
    const b = e.target.closest('[data-tab]');
    if (!b || !tabBar) return;
    tabBar.querySelectorAll('[data-tab]').forEach((x) => {
      const on = x === b;
      x.classList.toggle('on', on);
      x.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    root.querySelectorAll('[data-tab-panel]').forEach((pn) => {
      pn.hidden = pn.dataset.tabPanel !== b.dataset.tab;
    });
  };
  on(tabBar, 'click', onTabs);
  let syncOn = false;
  const syncBtn = q('[data-snd="sync"]');
  const pending = new Map();
  const onCycle = () => {
    if (!syncOn || !snd) return;
    const tp = snd.typeSel ? snd.typeSel.value : 'hum';
    try { snd.playViaLabProx(tp, { ms: 320, gain: 1 }); } catch {}
  };
  demos.forEach((el) => {
    on(el, 'animationiteration', onCycle);
    on(el, 'animationstart', onCycle);
  });
  on(syncBtn, 'click', () => {
    syncOn = !syncOn;
    if (syncBtn) syncBtn.textContent = syncOn ? 'sample on glitch: on' : 'sample on glitch: off';
  });
  apply();
  return () => {
    pending.forEach((t) => clearTimeout(t));
    offs.forEach((fn) => { try { fn(); } catch {} });
    stops.forEach((fn) => { try { fn(); } catch {} });
  };
}
