// Column bottom-alignment parallax: short columns drift down as you scroll so
// all column bottoms align at the end of the page scroll.
// Smooth chase: target scroll progress is chased with a frame-rate
// independent exponential decay (critically damped, no overshoot).
// That removes the underdamped spring's wobble/stutter and feels
// butter-smooth even on variable refresh (60→120Hz) and momentum scroll.
export function attachParallax(grid) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (window.innerWidth <= 640) return () => {};
  const cols = [...grid.querySelectorAll('.col')];
  if (cols.length < 2) return () => {};

  let deficits = [];
  let maxScroll = 1;
  let target = 0, current = 0, rafId = 0, last = 0;

  // λ controls chase speed: 10 ≈ 300ms settle, 14 ≈ 210ms.
  // 10–12 feels fluid without lag; no overshoot by construction.
  const LAMBDA = 11;

  function syncMax() {
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }

  function progress() {
    if (maxScroll <= 40) return 0;
    return Math.min(1, Math.max(0, window.scrollY / maxScroll));
  }

  function render() {
    for (let i = 0; i < cols.length; i++) {
      const y = deficits[i] * current;
      // Keep a composited layer at all times — 'none' drops the layer and
      // causes a hitch when the first non-zero frame promotes it.
      cols[i].style.transform = y < 0.05 ? 'translate3d(0,0,0)' : `translate3d(0,${y.toFixed(2)}px,0)`;
    }
  }

  function tick(now) {
    const dt = Math.min(0.033, (now - last) / 1000 || 0.016);
    last = now;
    const delta = target - current;
    if (Math.abs(delta) < 0.00035) {
      current = target;
      render();
      rafId = 0;
      return;
    }
    // frame-rate independent exponential: independent of dt, no overshoot
    current += delta * (1 - Math.exp(-LAMBDA * dt));
    render();
    rafId = requestAnimationFrame(tick);
  }

  function kick() {
    target = progress();
    if (!rafId) {
      last = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  }

  function measure() {
    if (window.innerWidth <= 640) {
      cols.forEach((c) => { c.style.transform = 'translate3d(0,0,0)'; });
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      current = target = 0;
      return;
    }
    syncMax();
    // read heights in one batch before writing transforms
    const hs = cols.map((c) => c.getBoundingClientRect().height);
    const tallest = Math.max(...hs);
    deficits = hs.map((h) => Math.max(0, tallest - h));
    cols.forEach((c, i) => (c.dataset.deficit = String(Math.round(deficits[i]))));
    target = progress();
    // snap current on first measure so first paint isn't offset-zero → jump
    if (!rafId && Math.abs(current - target) > 0.002) {
      // if we haven't animated yet, jump to near target to avoid visible snap
      // but still let the decay smooth subsequent scrolls
      const atTop = window.scrollY < 2;
      if (atTop) current = target;
    }
    kick();
  }

  let measureRaf = 0;
  function onResize() {
    if (measureRaf) return;
    measureRaf = requestAnimationFrame(() => {
      measureRaf = 0;
      measure();
    });
  }

  const imgs = [...grid.querySelectorAll('img')];
  let pending = imgs.length;
  const afterImages = () => { if (pending <= 0) measure(); };
  if (pending === 0) requestAnimationFrame(measure);
  else {
    imgs.forEach((img) => {
      if (img.complete) pending--;
      else {
        img.addEventListener('load', () => { pending--; afterImages(); }, { once: true });
        img.addEventListener('error', () => { pending--; afterImages(); }, { once: true });
      }
    });
    requestAnimationFrame(measure);
    if (pending <= 0) measure();
  }

  syncMax();
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', onResize);
  const ro = new ResizeObserver(onResize);
  ro.observe(grid);
  requestAnimationFrame(measure);

  return () => {
    window.removeEventListener('scroll', kick);
    window.removeEventListener('resize', onResize);
    ro.disconnect();
    if (measureRaf) cancelAnimationFrame(measureRaf);
    cancelAnimationFrame(rafId);
    cols.forEach((c) => { c.style.transform = ''; c.removeAttribute('data-deficit'); });
  };
}
