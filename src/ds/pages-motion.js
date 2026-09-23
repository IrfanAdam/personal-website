/* ADAM/DS — ds/pages-motion · Elements Motion vertical tabs ·
   [plan:2026-09-23_174000-motion-elements-vertical.md#phase-1] */
// Exports: title, render, mount — vertical Elements sheet
import { note, refreshLive } from './specimens.js';
import { tabs } from './tabs.js';
import { panes } from './motion-panes.js';

// — Page —
export const title = 'Motion';
export function render() {
  return [
    `<p class="ds-crumb">Elements · Motion</p><div class="ds-hero"><h1>Motion with intent.</h1>`,
    `<p class="lede">Durations are prescriptions — each step owns its uses. Motion says when and how (<span class="tok">--dur-*</span> + <span class="tok">--ease-*</span>); FX says what moves (<span class="tok">--fx-*</span>).</p>`,
    `<p class="sub"><a href="#/">← Overview</a></p></div>`,
    tabs({ vertical: true, panes }),
    note('Do', ['Durations read live <span class="tok">var(--dur-*)</span>; travel runs <span class="tok">var(--ease-signature)</span> unless you prove otherwise.'].join('')),
    note('Don’t', 'No raw <span class="tok">ms</span> or cubic-bezier literals outside <span class="tok">tokens.css</span>.', 'dont'),
  ].join('');
}
export function mount(root) {
  const stageEl = root.querySelector('#easeStage');
  const dot = stageEl && stageEl.querySelector('.fd-dot');
  const ctrls = root.querySelector('#easeCtrls');
  const onEase = (e) => {
    if (e.target.closest('[data-ease-replay]')) {
      if (!stageEl) return;
      stageEl.classList.remove('go');
      void stageEl.offsetWidth;
      stageEl.classList.add('go');
      return;
    }
    const s = e.target.closest('[data-ease]');
    if (!s || !dot) return;
    if (s.dataset.ease === 'd') dot.style.setProperty('--fd-d', s.value);
    if (s.dataset.ease === 'e') dot.style.setProperty('--fd-e', s.value);
  };
  if (ctrls) {
    ctrls.addEventListener('click', onEase);
    ctrls.addEventListener('change', onEase);
  }
  refreshLive();
  const obs = new MutationObserver(refreshLive);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
  return () => {
    if (ctrls) {
      ctrls.removeEventListener('click', onEase);
      ctrls.removeEventListener('change', onEase);
    }
    try { obs.disconnect(); } catch {}
  };
}
