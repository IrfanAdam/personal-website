/* ADAM/FX — views/footer-shimmer · footer glow on mousemove · [plan:2026-09-15_183400-lump-sum-builds.md#phase-12] */
// Exports: initFooterShimmer — watches #app for .footer-big and tracks mouse
export function initFooterShimmer() {
  let el = null;
  let active = false;
  const find = () => document.querySelector('.footer-big');
  const bind = (next) => {
    if (el === next) return;
    if (el) {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    }
    el = next;
    if (!el) return;
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });
  };
  const onMove = (e) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
    if (!active) {
      active = true;
      el.classList.add('is-hovering');
    }
  };
  const onLeave = () => {
    active = false;
    if (el) el.classList.remove('is-hovering');
  };
  const scan = () => bind(find());
  scan();
  const mo = new MutationObserver(scan);
  try {
    const app = document.getElementById('app');
    if (app) mo.observe(app, { childList: true, subtree: true });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  } catch {}
  // reduce-motion: keep shimmer but drop mouse glow
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches && el) {
      el.classList.remove('is-hovering');
    }
  } catch {}
}
