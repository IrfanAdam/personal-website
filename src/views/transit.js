/* ADAM/FX — views/transit · shared media flight into the project page ·
   [plan:2026-09-15_183400-lump-sum-builds.md#phase-22] */
/* The list pane and the detail hero are the same media box, so entering a
   project flies a ghost of it from the pane's rect to the hero's rect — the
   vertical offset between the two reads as motion instead of a jump. The hero
   stays hidden until the ghost lands (html.is-transit) and the pane's cache
   entry is dropped so the arrival mosaics (rise.js [data-reveal]). */
// Exports: armTransit — capture the source on click · takeTransit — before render
//          · flyTransit — ghost flight after render
import { fxMs, fxVar } from './fx-tokens.js';
import { forgetReveal } from './masonry/gridReveal-load.js';

const slugOf = (href) => (href || '').split('/').pop();
let armed = null;

// — Capture: a click on a list row the pane is already showing —
export function armTransit(e) {
  if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const link = e.target && e.target.closest ? e.target.closest('a.work') : null;
  if (!link) return;
  const slug = slugOf(link.getAttribute('href'));
  const pane = document.getElementById('workPeek');
  if (!pane || pane.dataset.slug !== slug || !pane.querySelector('img')) return;
  armed = { slug, from: pane };
}

// — Take-off: measure the pane, hide the hero, free the arrival mosaic —
export function takeTransit(slug) {
  const taken = armed && armed.slug === slug ? armed : null;
  armed = null;
  const from = taken && taken.from;
  if (!from || !from.isConnected) return null;
  const img = from.querySelector('img');
  const src = img ? img.currentSrc || img.src : '';
  const rect = from.getBoundingClientRect();
  if (!src || !rect.width || !rect.height) return null;
  forgetReveal(src);
  document.documentElement.classList.add('is-transit');
  return { rect, src };
}

// — Flight: ghost from the pane's rect to the hero's rect, then reveal —
export function flyTransit(t, root) {
  const hero = root.querySelector('.case .hero-box');
  let ghost = null;
  const done = () => {
    document.documentElement.classList.remove('is-transit');
    if (ghost) ghost.remove();
  };
  if (!t || !hero) {
    done();
    return;
  }
  const to = hero.getBoundingClientRect();
  if (!to.width || !to.height) {
    done();
    return;
  }
  ghost = document.createElement('div');
  ghost.className = 'transit-ghost';
  ghost.setAttribute('aria-hidden', 'true');
  ghost.style.left = `${t.rect.left}px`;
  ghost.style.top = `${t.rect.top}px`;
  ghost.style.width = `${t.rect.width}px`;
  ghost.style.height = `${t.rect.height}px`;
  const gi = document.createElement('img');
  gi.src = t.src;
  gi.alt = '';
  ghost.appendChild(gi);
  document.body.appendChild(ghost);
  const k = to.width / t.rect.width;
  const dur = Math.max(120, fxMs('--dur-transit', 520));
  const shift = `translate(${to.left - t.rect.left}px, ${to.top - t.rect.top}px) scale(${k})`;
  const anim = ghost.animate(
    [{ transform: 'translate(0px, 0px) scale(1)' }, { transform: shift }],
    { duration: dur, easing: fxVar('--ease-signature', 'cubic-bezier(0.32,0.72,0,1)'), fill: 'forwards' },
  );
  if (anim.finished && anim.finished.then) anim.finished.then(done, done);
  else setTimeout(done, dur);
}
