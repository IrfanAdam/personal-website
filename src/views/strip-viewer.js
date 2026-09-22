/* ADAM/SHARED — views/strip-viewer · strip icon hover hero preview
   [plan:2026-09-15_183400-lump-sum-builds.md#phase-17] */
// Exports: attachStripViewer — cursor-following hero popover for header strip
import {
  HERO, slugFrom, placeWithOrigin, preloadHeroes,
} from './strip-viewer-helpers.js';
import { makeViewerCore } from './strip-viewer-core.js';
export function attachStripViewer(bar) {
  if (!bar) return () => {};
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (matchMedia('(hover: none)').matches) return () => {};
  const links = [...bar.querySelectorAll('.strip a[href^="#/projects/"]')];
  if (!links.length) return () => {};
  preloadHeroes();
  const { VW, GAP, PAD, HIDE, SWAP, el, img, fol, VH } = makeViewerCore();
  let cur = '', hideT = 0, popT = 0, on = false, cx = 0, cy = 0;
  const place = () => placeWithOrigin(el, cx, cy, VW, VH, PAD, GAP);
  const cancelH = () => { if (hideT) { clearTimeout(hideT); hideT = 0; } };
  const clearPop = () => { if (popT) { clearTimeout(popT); popT = 0; } };
  const schedH = () => { cancelH(); hideT = setTimeout(hide, HIDE); };
  const show = (slug, x, y) => {
    const src = HERO[slug];
    if (!src) return;
    cx = x; cy = y;
    const p = place();
    if (slug === cur && on) { fol.aim(p.x, p.y); return; }
    if (img.getAttribute('src') !== src) {
      img.src = src;
      if (img.decode) img.decode().catch(() => {});
    }
    img.alt = slug;
    cancelH(); clearPop();
    if (!on) {
      cur = slug; on = true;
      fol.snap(p.x, p.y);
      el.classList.add('on');
      requestAnimationFrame(() => fol.pop());
    } else {
      cur = slug;
      fol.dip();
      fol.aim(p.x, p.y);
      popT = setTimeout(() => { popT = 0; fol.settle(); }, SWAP);
    }
  };
  const hide = () => {
    if (!on) return;
    on = false; cur = '';
    clearPop(); fol.idle();
    el.classList.remove('on');
  };
  const onEnter = (e) => { cancelH(); show(slugFrom(e.currentTarget), e.clientX, e.clientY); };
  const onMove = (e) => {
    if (!on) return;
    cx = e.clientX; cy = e.clientY;
    const p = place();
    fol.aim(p.x, p.y);
  };
  const onLeave = () => schedH();
  const onStripMove = (e) => {
    if (!on) return;
    cx = e.clientX; cy = e.clientY;
    const over = !!e.target.closest('.strip a[href^="#/projects/"]');
    if (!over) schedH();
    else { cancelH(); const p = place(); fol.aim(p.x, p.y); }
  };
  const onStripLeave = () => schedH();
  links.forEach((a) => {
    a.addEventListener('mouseenter', onEnter);
    a.addEventListener('mousemove', onMove, { passive: true });
    a.addEventListener('mouseleave', onLeave);
  });
  const strip = bar.querySelector('.strip');
  if (strip) {
    strip.addEventListener('mousemove', onStripMove, { passive: true });
    strip.addEventListener('mouseleave', onStripLeave);
  }
  const onResize = () => { if (!on) return; const p = place(); fol.aim(p.x, p.y); };
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onResize, { passive: true });
  return () => {
    cancelH(); clearPop(); fol.stop();
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onResize);
    links.forEach((a) => {
      a.removeEventListener('mouseenter', onEnter);
      a.removeEventListener('mousemove', onMove);
      a.removeEventListener('mouseleave', onLeave);
    });
    if (strip) {
      strip.removeEventListener('mousemove', onStripMove);
      strip.removeEventListener('mouseleave', onStripLeave);
    }
    el.remove();
  };
}
