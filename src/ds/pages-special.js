/* ADAM/DS — ds/pages-special · Special 7 vertical labs ·
   [plan:2026-09-23_174000-motion-elements-vertical.md#phase-7] */
// Exports: render, mount — Like Library: 1 tab, 7 labs
import { tabs } from './tabs.js';
import { render as rGrid, mount as mGrid } from './functions/grid-reveal.js';
import { render as rShim, mount as mShim } from './functions/shimmer.js';
import { render as rRise, mount as mRise } from './functions/rise.js';
import { render as rView, mount as mView } from './functions/viewer.js';
import { render as rGlim, mount as mGlim } from './functions/glimmer-orb.js';
import { render as rGlitch, mount as mGlitch } from './functions/glitch.js';
import { render as rScram, mount as mScram } from './functions/scramble.js';
// — Panes —
function panes() {
  return [
    { label: 'GridReveal', html: rGrid() },
    { label: 'Shimmer', html: rShim() },
    { label: 'Rise', html: rRise() },
    { label: 'Viewer', html: rView() },
    { label: 'Glimmer orb', html: rGlim() },
    { label: 'Glitch', html: rGlitch() },
    { label: 'Scramble', html: rScram() },
  ];
}
// — Page —
export function render() {
  return [
    `<p class="ds-crumb">Special · Motion labs</p><div class="ds-hero"><h1>Motion with a model.</h1>`,
    `<p class="lede">Seven tuned labs, each its own sheet. Labs run on production geometry; values graduate to tokens before use.</p></div>`,
  ].join('') + tabs({ vertical: true, panes: panes() });
}
export function mount(root) {
  const c = [mGrid, mShim, mRise, mView, mGlim, mGlitch, mScram].map((fn) => {
    try { return fn(root); } catch (_) { return null; }
  });
  return () => c.forEach((f) => { try { f && f(); } catch (_) {} });
}
