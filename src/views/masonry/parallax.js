// Column bottom-alignment parallax: short columns drift down as you scroll so
// all column bottoms align at the end of the page scroll.
export function attachParallax(grid) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (window.innerWidth <= 640) return () => {};
  const cols = [...grid.querySelectorAll('.col')];
  if (cols.length < 2) return () => {};
  // disable on narrow single/two-col where heights are unstable; keep enabled >=2 cols
  // but skip if grid is very short (no scrollable distance)
  let deficits = [];
  let maxH = 0;
  let ticking = false;
  let rafId = 0;

  function measure() {
    const hs = cols.map((c) => c.getBoundingClientRect().height);
    maxH = Math.max(...hs);
    deficits = hs.map((h) => Math.max(0, maxH - h));
    // tag short columns for debug if needed
    cols.forEach((c, i) => c.dataset.deficit = String(Math.round(deficits[i])));
    update();
  }

  function progress() {
    const doc = document.documentElement;
    const scrollMax = doc.scrollHeight - window.innerHeight;
    if (scrollMax <= 40) return 0;
    // grid-aware: blend page progress with grid visibility so movement starts
    // once the grid has entered and finishes at bottom of page
    let p = window.scrollY / scrollMax;
    // ease slightly for natural feel
    return Math.min(1, Math.max(0, p));
  }

  function update() {
    const p = progress();
    cols.forEach((c, i) => {
      const y = deficits[i] * p;
      // use 3d for compositor
      c.style.transform = y > 0.5 ? `translate3d(0,${y.toFixed(2)}px,0)` : 'none';
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    rafId = requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  }

  function onResize() {
    cancelAnimationFrame(rafId);
    measure();
  }

  // wait for images to settle before first measure
  const imgs = [...grid.querySelectorAll('img')];
  let pending = imgs.length;
  const afterImages = () => {
    if (pending <= 0) measure();
  };
  if (pending === 0) requestAnimationFrame(measure);
  else {
    imgs.forEach((img) => {
      if (img.complete) { pending--; }
      else {
        img.addEventListener('load', () => { pending--; afterImages(); }, { once: true });
        img.addEventListener('error', () => { pending--; afterImages(); }, { once: true });
      }
    });
    // also measure early then re-measure
    requestAnimationFrame(measure);
    if (pending <= 0) measure();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  // observe grid size changes (fonts, layout)
  const ro = new ResizeObserver(onResize);
  ro.observe(grid);

  // initial
  requestAnimationFrame(measure);

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    ro.disconnect();
    cancelAnimationFrame(rafId);
    cols.forEach((c) => { c.style.transform = ''; c.removeAttribute('data-deficit'); });
  };
}
