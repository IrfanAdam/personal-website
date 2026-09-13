/* ADAM/APP — boot-chrome · header height + hide-on-scroll · [plan:2026-09-13_235413-over-limit-splits.md#phase-4] */
// Exports: initChrome — header var + resize/observer + scroll-hide wiring
export function initChrome(header) {
  function setHeaderH() {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
  setHeaderH();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setHeaderH);
  window.addEventListener('resize', setHeaderH);
  new ResizeObserver(setHeaderH).observe(header);

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let lastY = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        header.classList.toggle('hide', y > 120 && y > lastY);
        lastY = y;
        ticking = false;
      });
    }, { passive: true });
  }
}
